import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './user/signup/signup.component';
import { HomeAComponent } from './Frontend/home-a/home-a.component';
import { SigninComponent } from './user/signin/signin.component';
import { EditComponent } from './user/edituser/edituser.component';

import { ProfileComponent } from './user/profile/profile.component';
import { TemplateBackComponent } from './BackOffice/template-back/template-back.component';
import { Adminguard } from '../app/user/Admingard';
import { AuthGuard } from '../app/user/Authgard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeAComponent },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SigninComponent },
  { path: 'edit', component: EditComponent},

  { path: 'profile', component: ProfileComponent },
  { path: 'homeadmin', component: TemplateBackComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
