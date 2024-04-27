import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
//import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppRoutingModule } from './app-routing.module';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';


import { AppComponent } from './app.component';
import { StoreComponent } from './store/store/store.component';
import { ProductCardComponent } from './store/product-card/product-card.component';
import { ProductViewComponent } from './store/product-view/product-view.component';
import { ProductReviewComponent } from './store/product-review/product-review.component';
import { HttpClientModule } from '@angular/common/http';
import { ShoppingCartComponent } from './store/shopping-cart/shopping-cart.component';
import { StoreBackendComponent } from './store/store-backend/store-backend.component';
import { StoreBackendEditComponent } from './store/store-backend-edit/store-backend-edit.component';
import { StoreBackendTableviewerComponent } from './store/store-backend-tableviewer/store-backend-tableviewer.component';

@NgModule({
  declarations: [
    AppComponent,
    StoreComponent,
    ProductCardComponent,
    ProductViewComponent,
    ProductReviewComponent,
    ShoppingCartComponent,
    StoreBackendComponent,
    StoreBackendEditComponent,
    StoreBackendTableviewerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AutocompleteLibModule
    //NgxChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
