import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './Frontend/header/header.component';
import { FooterComponent } from './Frontend/footer/footer.component';
import { AlltemplateComponent } from './Frontend/alltemplate/alltemplate.component';
import { ContactUsComponent } from './Frontend/contact-us/contact-us.component';
import { SignupComponent } from './user/signup/signup.component';
import { HomeAComponent } from './Frontend/home-a/home-a.component';
import { SigninComponent } from './user/signin/signin.component';

import { ProfileComponent } from './user/profile/profile.component';
import  { FooterBackComponent } from './BackOffice/footer-back/footer-back.component';
import { TemplateBackComponent } from './BackOffice/template-back/template-back.component';
import { HeaderBackComponent } from './BackOffice/header-back/header-back.component';
import { SidebarBackComponent } from './BackOffice/sidebar-back/sidebar-back.component';
import {AuthInterceptor, authInterceptorProviders } from './user/auto.inter';
import { EditComponent } from './user/edituser/edituser.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AlltemplateComponent,
    ContactUsComponent,
    SignupComponent,
    HomeAComponent,
    SigninComponent,
   
    ProfileComponent,
    FooterBackComponent,
    TemplateBackComponent,
    SidebarBackComponent ,
    HeaderBackComponent,
   EditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  providers: [ authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
