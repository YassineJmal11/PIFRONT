import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../entities';
import API from '../api';
import { UsersService } from 'src/app/user/users.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent {
  products: Product[] = [];
  marks: any[] = [];
  
  suggestions: any;
  suggestions_keyword= 'name';
  filterName: any;
  filterMark: any;
  filterPriceMin: any;
  filterPriceMax: any;

  constructor(private router: Router, private http: HttpClient, 
    private usersService: UsersService, private tokenService: TokenStorageService) {}

  ngOnInit() {
    // Initialize products here if needed
    this.getAllProducts();
    this.getAllProductMarks();

    this.usersService.getUserIdByUsername(this.tokenService.getUser().username).subscribe(
      (data) => {
        localStorage.setItem("userId", data.userId.toString());
      }
    );
  }

  getAllProductMarks() {
    const url = API.getAllProductMarks;
    this.http.get<string[]>(url).subscribe(
      (response) => {
        this.marks = response;
        console.log("all marks: ", this.marks)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getAllProducts() {
    const url = API.getAllProducts;
    this.http.get<Product[]>(url).subscribe(
      (response) => {
        this.products = response; // Assign the response to products
        console.log("all products: ", this.products)
        this.suggestions = this.products.map(x => { return {id: x.productId, name: x.name} });
        console.log('suggestions: ', this.suggestions)
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onProductClicked(product: Product) {
    console.log('Product clicked:', product);
    this.router.navigate(['/product-view', product.productId]);
  }

  @ViewChild('searchInput') searchInput: any;

  onKeyUp(event: any) {
    //const inputValue = this.searchInput.nativeElement.value;
    //this.filterName = inputValue;
    this.filterName=event;
    this.searchProducts(this.filterName, this.filterPriceMin, 
      this.filterPriceMax, null, this.filterMark, null);
  }

  onMarkSelected(event:any)
  {
    console.log("mark: ", event.target.value);
    this.filterMark = event.target.value
    this.searchProducts(this.filterName, this.filterPriceMin, 
      this.filterPriceMax, null, this.filterMark, null);
  }

  onPriceFilterChange() {
    const minPriceInput = (document.querySelector('input[placeholder="min?"]') as HTMLInputElement).value;
    const maxPriceInput = (document.querySelector('input[placeholder="max?"]') as HTMLInputElement).value;
    
    const minPrice = minPriceInput ? parseInt(minPriceInput) : null;
    const maxPrice = maxPriceInput ? parseInt(maxPriceInput) : null;
  
    this.filterPriceMin = minPrice;
    this.filterPriceMax = maxPrice;

    this.searchProducts(this.filterName, this.filterPriceMin, 
      this.filterPriceMax, null, this.filterMark, null);
  }

  searchProducts(name: any, minPrice: any, maxPrice: any, 
    categoryName: any, markName: any, userName: any) {

    const url = API.searchProducts;
    let params = new HttpParams()
      .set('name', typeof name == 'string' ? name : '')
      .set('minPrice', typeof minPrice == 'number' ? minPrice.toString() : '0')
      .set('maxPrice', typeof maxPrice == 'number' ? maxPrice.toString() : '9999999')
      .set('categoryName', categoryName !== null ? categoryName : '')
      .set('markName', typeof markName == 'string' ? markName : '')
      .set('userName', typeof userName == 'string' ? userName : '');

    this.http.get<Product[]>(url, { params }).subscribe(
      (response) => {
        console.log(response, "srch");
        this.products = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
