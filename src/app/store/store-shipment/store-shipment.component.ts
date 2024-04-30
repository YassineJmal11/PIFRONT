import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import API from '../api';

@Component({
  selector: 'app-store-shipment',
  templateUrl: './store-shipment.component.html',
  styleUrls: ['./store-shipment.component.css']
})
export class StoreShipmentComponent {
  
  locationData = {
    latitude: 0, 
    longitude: 0,
    expectedDeliveryDate: "UKNOWN (1 January 1970)",
    currentDistance: "0 KM",
    progress: 5,
    shipLocationHistory: [],
  }
  isGeolocationDenied = true;
  isGeolocationNotSupported = true;
  payment : any;
  refreshInterval : any;
  userId : number = -1;

  constructor(private route: ActivatedRoute,
    private router: Router, 
    private http: HttpClient) {}
    
  ngOnInit()
  {
    this.userId = parseInt(localStorage.getItem("userId") ?? "-1");
    this.refreshInterval = setInterval(async ()=> await this.getShipmentDetails(), 300);
  }
  ngOnDestroy()
  {
    if(this.refreshInterval) clearInterval(this.refreshInterval);
  }

  deliveryDoneClick()
  {
    var url = API.deletePayment + "/" + this.payment.paymentId
    this.http.delete(url).subscribe
    (
      (response) => {
        alert("payment deleted successfully")
        window.location.reload()
      },
      (error) => console.error(error)
    )
  }

  async getShipmentDetails()
  {

    var url = API.getPaymentByUserId + "/" + this.userId
    this.http.get<any>(url).subscribe(
      (response) => {
        //console.log("payment:", response);
        this.payment = response;
        var history : any = this.locationData.shipLocationHistory;
        history.push(this.payment.shipmentLocation || "unknown (ship-man has no location on)");
      },
      (error) => {
        console.error(error);
      }
    );

    if(!this.payment) return;

    this.isGeolocationNotSupported = await this.checkIfGeolocationNotSupported();
    if(this.isGeolocationNotSupported)
    {
      console.log('Geolocation is not available in this browser.');
      return
    }
    this.isGeolocationDenied = await this.checkIfGeolocationDenied();
    if(this.isGeolocationDenied)
    {
      console.log('Geolocation is denied by user.');
      return
    }

    const myLocation = await this.getGPSLocation()
    this.locationData.latitude = myLocation.latitude;
    this.locationData.longitude = myLocation.longitude;

    // if shipper, we set the payment location currently
    // userId we get it from cookies
    url = API.setShipLocation + "/" + this.userId + "/" + this.getLocationString(this.locationData);
    this.http.get<any>(url).subscribe(
      (response) => {
        console.log("shipment location was updated")
      },
      (error) => {
        console.error(error);
      }
    );

    url = API.getShipDistance + "/" + this.payment.paymentId + "/" + this.getLocationString(this.locationData)
    this.http.get<number>(url).subscribe(
      (response) => {
        this.locationData.currentDistance = response + "KM"
        this.locationData.progress = (response/1) * 100; // each 1km is 1%
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getLocationString(location : any)
  {
    return `Latitude: ${location.latitude}, Longitude: ${location.longitude}`
  }

  checkIfGeolocationNotSupported(): boolean {
    return !navigator.geolocation;
  }
  
  async checkIfGeolocationDenied(): Promise<boolean> {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      return permissionStatus.state === 'denied';
    } catch (error) {
      console.error('Error querying geolocation permission status:', error);
      return false; // Unable to determine permission status.
    }
  }

  async getGPSLocation(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const altitude = position.coords.altitude;
          const longitude = position.coords.longitude;
          const result = {altitude, longitude};
          resolve(result);
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  }


}
