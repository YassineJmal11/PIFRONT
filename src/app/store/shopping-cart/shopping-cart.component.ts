import { Component, Input } from '@angular/core';
import API from '../api';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  
  userId : number = -1;
  shoppingCart: any;
  
  constructor(private route: ActivatedRoute,
    private router: Router, 
    private http: HttpClient) {}

  ngOnInit() 
  {
    
    this.userId = parseInt(localStorage.getItem("userId") ?? "-1");
      this.getShoppingCart();

  }

  onCheckoutButtonClick()
  {
    const url = API.checkoutCart + "/" + this.userId
    this.http.get(url).subscribe(
      (response) => {
        alert("checkout was successful. please check your email.")
      },
      (error) =>
      {
        alert("there was an error processing your checkout request. \n or maybe there's no shipment available right now. \nplease try later.")
      }
    )
    console.log("checking out cart...")
  }

  getShoppingCart() {
    const url = API.getShoppingCartByUserId + "/" + this.userId;

    this.http.get<any>(url).subscribe(
      (response) => {
        this.shoppingCart = response;
        console.log("loaded cart: ", this.shoppingCart)
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
