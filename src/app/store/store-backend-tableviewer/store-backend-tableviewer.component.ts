import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Product, PhysicalStore, ProductMark, ProductReview } from '../entities';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import API from '../api';
import jsPDF from "jspdf";

@Component({
  selector: 'app-store-backend-tableviewer',
  templateUrl: './store-backend-tableviewer.component.html',
  styleUrls: ['./store-backend-tableviewer.component.css']
})
export class StoreBackendTableviewerComponent implements AfterViewInit {

  products?: Product[];
  physicalStores?: PhysicalStore[];
  productMarks?: ProductMark[];
  productReviews?: ProductReview[];
  shipmentUsers?: any[]

  constructor(private route: ActivatedRoute, 
    private http: HttpClient,
    private router: Router) { }
  
  ngOnInit()
  {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; //force refresh component
    this.route.params.subscribe(params => {
      const type = params['type'];
      if(type == 'product') this.getAllXXX(API.getAllProducts, 'products');
      if(type == 'store') this.getAllXXX(API.getAllPhysicalStores, 'physicalStores');
      if(type == 'mark') this.getAllXXX(API.getAllProductMarks, 'productMarks');
      if(type == 'review') this.getAllXXX(API.getAllProductReviews, 'productReviews');
      if(type == 'shipment-user') this.getAllXXX(API.getAllShipmentUsers, 'shipmentUsers');
    });
  }
  
  ngAfterViewInit() {
    
  }

  onEdit(obj: any)
  {
    console.log('editing: ', obj)
    if(this.products) this.router.navigate(['/store-backend-edit', 'product', obj.productId]);
    if(this.productReviews) this.router.navigate(['/store-backend-edit', 'review', obj.productReviewId]);
    if(this.physicalStores) this.router.navigate(['/store-backend-edit', 'store', obj.physicalStoreId]);
    if(this.productMarks) this.router.navigate(['/store-backend-edit', 'mark', obj.productMarkId]);
    if(this.shipmentUsers) this.router.navigate(['/store-backend-edit', 'shipment-user', obj.shipmentUserId]);
  }
  onDelete(obj: any)
  {
    console.log('deleting: ', obj)
    if(!confirm("sure?"))
      return;

    if(this.products) this.deleteXXXById(API.deleteProduct, obj.productId);
    if(this.productReviews) this.deleteXXXById(API.deleteProductReview, obj.reviewId);
    if(this.physicalStores) this.deleteXXXById(API.deletePhysicalStore, obj.physicalStoreId);
    if(this.productMarks) this.deleteXXXById(API.deleteProductMark, obj.productMarkId);
    if(this.shipmentUsers) this.deleteXXXById(API.deleteShipmentUser, obj.shipmentUserId);
  }
  onCreateNew()
  {
    if(this.products) this.router.navigate(['/store-backend-new', 'product']);
    if(this.productReviews) this.router.navigate(['/store-backend-new', 'review']);
    if(this.physicalStores) this.router.navigate(['/store-backend-new', 'store']);
    if(this.productMarks) this.router.navigate(['/store-backend-new', 'mark']);
    if(this.shipmentUsers) this.router.navigate(['/store-backend-new', 'shipment-user']);
  }

  deleteXXXById(url: string, id: number)
  {
    this.http.delete<any>(url+'/'+id).subscribe(
      (response) => {
        console.log('deleted successfuly: ', id);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  getAllXXX(url : string, target : any)
  {
    function getValue<T, K extends keyof T>(data: T, key: K) {
      return data[key];
    }
    function setValue<T, K extends keyof T>(data: T, key: K, value:any) {
      data[key] = value;
    }
    this.http.get<any>(url).subscribe(
      (response) => {
        setValue(this, target, response); // Assign the response to products
        console.log("all "+target+": ", getValue(this, target))
        if (target === 'products') this.createChart()
      },
      (error) => {
        console.error(error);
      }
    );
  }

  chartsToPDF()
  {
    const doc = new jsPDF();

    const chartCanvases = document.querySelectorAll('canvas');
    
    chartCanvases.forEach((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');
      const w = doc.internal.pageSize.getWidth();
      const ratio = w / canvas.width;
      const h = canvas.height * ratio;
      doc.addImage(imgData, 'PNG', 10, 10, w, h);
      doc.addPage();
    });

    doc.save('statistics.pdf');
  }

  getProductByMarketDataset() {
    if (!this.products) {
      throw new Error("Products not available.");
    }
    
    const productCounts : any = {}; // Object to store mark name as key and count as value
  
    // Iterate over products to count products per mark name
    this.products.forEach(product => {
      const markName = product.mark!.name;
      if (productCounts[markName]) {
        productCounts[markName]++;
      } else {
        productCounts[markName] = 1;
      }
    });
  
    // Extract labels (mark names) and values (product counts) from productCounts object
    const labels = Object.keys(productCounts);
    const values = labels.map(label => productCounts[label]);
  
    return { labels, values };
  }
  
  @ViewChild('myChart') myChartCanvas!: ElementRef;
  createChart() {
    var dataset = this.getProductByMarketDataset();
    const ctx : any = this.myChartCanvas.nativeElement;
    const myChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: dataset.labels, //['Product A', 'Product B', 'Product C'],
            datasets: [{
                label: 'Products per mark name',
                data: dataset.values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                /*yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]*/
            }
        }
    });
}
}
