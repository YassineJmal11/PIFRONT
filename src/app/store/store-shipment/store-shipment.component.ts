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

    
    var userURL = API.getPaymentByUserId + "/" + this.userId
    var shipmentUserURL = API.getPaymentByShipmentUser + "/" + this.userId
    this.http.get<any>(userURL).subscribe(
      (response) => {
        //console.log("payment:", response);
        this.payment = response;
      },
      (error) => {
        console.log("this user has no payment. checking if he is a shipper guy...")
        this.http.get<any>(shipmentUserURL).subscribe(
          (response) => {
            //console.log("payment:", response);
            this.payment = response;
          },
          (error) => {
            console.log("not even a shipper.")
          }
        );
      }
    );

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
    if(!this.payment) return;

    var history : any = this.locationData.shipLocationHistory;
    history.push(this.payment.shipmentLocation || "unknown (ship-man has no location on)");

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
    console.log('--------',myLocation)
    
    this.locationData.latitude = myLocation.latitude;
    this.locationData.longitude = myLocation.longitude;

    // if shipper, we set the payment location currently
    // userId we get it from cookies
    var url = API.setShipLocation + "/" + this.userId + "/" + this.getLocationString(this.locationData);
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
        var speed = 60;
        this.locationData.currentDistance = response + "KM"
        // sigmoid is func such as: it goes to 1 when dist goes to 0km and goes to 0 if dist goes to 500km
        this.locationData.progress = (1 - sigmoid(response)) * 100;
        console.log(this.locationData.progress)
        this.locationData.expectedDeliveryDate = this.getExpectedDeliveryTime(parseFloat(this.locationData.currentDistance), speed) + " hour (running at " +speed+ "km/h)";
      },
      (error) => {
        console.error(error);
      }
    );
    function sigmoid(distance : number) {
      const k = 0.01; // Adjust this parameter for the steepness of the curve
      const d0 = 250; // Adjust this parameter for the midpoint of the transition
      return 1 / (1 + Math.exp(-k * (distance - d0)));
  }
  }
  getExpectedDeliveryTime(currdistance: number, carSpeed: number) {
    // Assuming the car speed is provided in kilometers per hour (km/h)

    // Calculate the expected time in hours
    const expectedTimeHours = currdistance / carSpeed;

    // Convert the time to hours and minutes
    const hours = Math.floor(expectedTimeHours);
    const minutes = Math.round((expectedTimeHours - hours) * 60);

    // Return the expected delivery time as a string in the format "HH:MM"
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const result = {latitude, longitude};
          resolve(result);
        },
        (error) => {
          reject(error.message);
        }
      );
    });
  }


}
