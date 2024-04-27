import { ViewEncapsulation, AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Product } from '../entities';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import API from '../api';

declare function obj2htmlAngular(obj:any, target:any):void;

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css'],
  encapsulation: ViewEncapsulation.None //this to allow css on dynamic injected divs
})
export class ProductViewComponent implements AfterViewInit {

  product!: Product;
  @ViewChildren('productContainerInfoLeft') infoLeft!: QueryList<any>;
  currentImageIdx: number = 0;
  @ViewChildren('productTechnicalDescription') ref!: QueryList<any>;

  constructor(private route: ActivatedRoute, 
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router) { }

  ngAfterViewInit() 
  {
    this.infoLeft.changes.subscribe( (result) => 
    {
      const infoLeft = result.first.nativeElement;

      const nextButton = document.querySelector('.nextButton') as HTMLElement;
      const prevButton = document.querySelector('.prevButton') as HTMLElement;

      this.showProductImage(0, infoLeft)

      nextButton.addEventListener('click', () => this.showProductImage(1, infoLeft));
      prevButton.addEventListener('click', () => this.showProductImage(-1, infoLeft));
    })

    this.route.params.subscribe(params => {
      const productId = params['id']; // Get the product ID from the URL
      this.getProductById(productId); // Call method to get product by ID
    });

  }

  addToCartButtonClicked()
  {
    this.addProductToCart(2, this.product.productId); //hardcoded user id for now
  }

  addProductToCart(userId: number, productId: number): void {
    const url = API.addProductToCart + "/" + productId + "/" + userId;
    this.http.post(url, {})
      .subscribe(
        (response) => {
          // Handle successful response
          console.log('Product added to cart:', response);
          this.router.navigate(['/shopping-cart', userId]); 
        },
        (error) => {
          // Handle error
          console.error('Error adding product to cart:', error);
        }
      );
  }

  selectedStore!: string;
  getMapUrl() {
    var url = API.defaultGoogleMapLocation; // Default URL if no store selected or location not available
    if (this.selectedStore) {
      const selectedStore = this.product.stores.find(store => store.name === this.selectedStore);
      if (selectedStore && selectedStore.location) {
        url = url.replace("Tunisia", selectedStore.location);
      }
    }
    const safeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return safeUrl;
  }



  showProductImage(offset: number = 1, infoLeft: HTMLElement) 
  {
    this.currentImageIdx = (this.currentImageIdx + offset + this.product.images.length) % this.product.images.length;
    console.log(this.product.images[this.currentImageIdx]);

    // Setting background image using ViewChild
    const imgElement = infoLeft;
    imgElement.style.backgroundImage = `url('${this.product.images[this.currentImageIdx]}')`;
  }

  getProductById(productId: number) {
    const url = API.getProductById + `/${productId}`;
    this.http.get<Product>(url).subscribe(
      (response) => {
        this.product = response; // Assign the response to the product
        this.ref.changes.subscribe((result) => {
          obj2htmlAngular(this.product.technicalDescription, result.first.nativeElement);
        });  
        
      },
      (error) => {
        console.error(error);
      }
    );
  }

  submitComment(comment: string, rating: number) {
    const url = API.createProductReview;
    const newReview: any = { comment: comment, rating: rating, 
      productId: this.product.productId, userToken: 0 };
    this.http.post<any>(url, newReview).subscribe(
      (response) => {
        console.log('Review submitted successfully');
        // updating UI
        this.getProductById(this.product.productId);
      },
      (error) => {
        console.error('Error submitting review:', error);
      }
    );
  }
  
}
