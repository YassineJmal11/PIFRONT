import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './user/signup/signup.component';
import { HomeAComponent } from './Frontend/home-a/home-a.component';
import { SigninComponent } from './user/signin/signin.component';
import { EditComponent } from './user/edituser/edituser.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { ProfileComponent } from './user/profile/profile.component';
import { TemplateBackComponent } from './BackOffice/template-back/template-back.component';
import { AlluserComponent } from './user/alluser/alluser.component';
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { VerifyComponent } from './user/verify/verify.component';
import { ImplicitReceiver } from '@angular/compiler';
import { SignupadminComponent } from './user/signupadmin/signupadmin.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeAComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'edit', component: EditComponent },
  { path: 'profile', component: ProfileComponent },
  
  { path: 'homeadmin', component: TemplateBackComponent },
  { path: 'ALL', component: AlluserComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'add', component: SignupadminComponent },
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
