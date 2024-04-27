import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreComponent } from './store/store/store.component'; 
import { ProductViewComponent } from './store/product-view/product-view.component';
import { ShoppingCartComponent } from './store/shopping-cart/shopping-cart.component';
import { StoreBackendTableviewerComponent } from './store/store-backend-tableviewer/store-backend-tableviewer.component';
import { StoreBackendEditComponent } from './store/store-backend-edit/store-backend-edit.component';

const routes: Routes = [
  {path: 'store', component: StoreComponent},
  {path: 'product-view/:id', component: ProductViewComponent},
  {path: 'shopping-cart/:userId', component: ShoppingCartComponent},
  {path: 'store-backend-tableviewer/:type', component: StoreBackendTableviewerComponent},
  {path: 'store-backend-edit/:type/:id', component: StoreBackendEditComponent},
  {path: 'store-backend-new/:type', component: StoreBackendEditComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
