import { Component } from '@angular/core';
import { Product, PhysicalStore, ProductMark, ProductReview, User, ProductDisponibility, ProductCategory } from '../entities';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import API from '../api';

@Component({
  selector: 'app-store-backend-edit',
  templateUrl: './store-backend-edit.component.html',
  styleUrls: ['./store-backend-edit.component.css']
})
export class StoreBackendEditComponent {

  productDisponibility = ProductDisponibility;
  productDisponibilityKeys = Object.keys(this.productDisponibility);
  productCategory = ProductCategory;
  productCategoryKeys = Object.keys(this.productCategory);

  mode: string = "edit"
  selectedFiles?: File[];

  product?: Product;
  physicalStore?: PhysicalStore;
  productMark?: ProductMark;
  productReview?: ProductReview;
  shipmentUser?: any;

  users?: User[];
  productMarks?: ProductMark[];
  physicalStores?: PhysicalStore[];

  constructor(private route: ActivatedRoute, 
    private http: HttpClient,
    private router: Router) { }
  
  ngOnInit()
  {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; //force refresh component

    this.getAllXXX(API.getAllProductMarks, 'productMarks');
    this.getAllXXX(API.getAllPhysicalStores, 'physicalStores');
    this.getAllXXX(API.getAllUsers, 'users');

    this.route.url.subscribe(segments => {
      const path = segments[0].path;
      if (path === 'store-backend-edit') {
        this.mode = 'edit';
      } else if (path === 'store-backend-new') {
        this.mode = 'new';
      }
      
      if(this.mode == 'edit')
      {
        this.route.params.subscribe(params => {
          const type = params['type'];
          const id = params['id'];
          console.log('editing ' + type + ':', id);
          this.beginEdit(type, id)
        });
      }
      
      if(this.mode == 'new')
      {
        this.route.params.subscribe(params => {
          const type = params['type'];
          console.log('creating new ' + type);
          this.beginCreate(type)
        });
      }

    });
  }

  onSubmit()
  {
    var updateProductImages = this.updateProductImages.bind(this);
    if(this.mode == 'edit')
    {
      if(this.product) this.updateXXXById(API.updateProduct, this.product.productId, this.product, updateProductImages);
      if(this.physicalStore) this.updateXXXById(API.updatePhysicalStore, this.physicalStore.physicalStoreId, this.physicalStore);
      if(this.productMark) this.updateXXXById(API.updateProductMark, this.productMark.productMarkId, this.productMark);
      if(this.productReview) this.updateXXXById(API.updateProductReview, this.productReview.productReviewId, this.productReview);
      if(this.shipmentUser) this.updateXXXById(API.updateShipmentUser, this.shipmentUser.shipmentUserId, this.shipmentUser);
    }
    if(this.mode == 'new')
    {
      if(this.product)this.createXXX(API.createProduct, this.product, (response: any)=>{ this.product=response; updateProductImages() });
      if(this.physicalStore)this.createXXX(API.createPhysicalStore, this.physicalStore);
      if(this.productMark)this.createXXX(API.createProductMark, this.productMark);
      if(this.shipmentUser)this.createXXX(API.createShipmentUser, this.shipmentUser);
    }
  }

  onImagesChange(event: any)
  {
    console.log('img change: ', event)
    this.selectedFiles = event.target.files
  }

  beginCreate(type:string)
  {
    if(type == 'product') this.product = new Product();
    if(type == 'store') this.physicalStore = new PhysicalStore();
    if(type == 'mark') this.productMark = new ProductMark();
    if(type == 'shipment-user') this.shipmentUser = {};
  }

  beginEdit(type:string, id: number)
  {
    if(type == 'product') this.getXXXById(API.getProductById, id, 'product')
    if(type == 'mark') this.getXXXById(API.getProductMarkById, id, 'productMark')
    if(type == 'store') this.getXXXById(API.getPhysicalStoreById, id, 'physicalStore')
    if(type == 'review') this.getXXXById(API.getProductReviewById, id, 'productReview')
    if(type == 'shipment-user') this.getXXXById(API.getShipmentUserById, id, 'shipmentUser')
  }

  updateProductImages()
  {
    if(!this.selectedFiles){
      console.log("updateProductImages: no selected files.")
      return
    }

    const formData = new FormData();
    Array.from(this.selectedFiles).forEach(image => {
      formData.append('images', image);
    });
    this.http.put<Product>(API.updateProductImages + "/" + this.product?.productId, formData).subscribe(
      (response) => {
        console.log('Product images updated successfully', response);
      },
      (error) => {
        console.error('Failed to update product images', error);
      }
    )
  }

  createXXX(url: string, newObject: any, cb : any=null)
  {
    this.http.post<any>(url, newObject).subscribe(
      (response) => {
        console.log('new created successfully: ', newObject)
        if(cb) cb(response); else this.router.navigate(['/store']);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  updateXXXById(url: string, id: number, updatedObject: any, cb:any=null)
  {
    this.http.put<any>(url + '/' + id, updatedObject).subscribe(
      (response) => {
        console.log('updated successfully: ', updatedObject)
        if(cb) cb(); else this.router.navigate(['/store']);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getXXXById(url: string, id: number, target: any) 
  {
    function getValue<T, K extends keyof T>(data: T, key: K) {
      return data[key];
    }
    function setValue<T, K extends keyof T>(data: T, key: K, value:any) {
      data[key] = value;
    }

    const _url = url + `/${id}`;
    this.http.get<any>(_url).subscribe(
      (response) => {
        setValue(this, target, response);
        console.log('getById:', response);
      },
      (error) => {
        console.error(error);
      }
    );
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
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
