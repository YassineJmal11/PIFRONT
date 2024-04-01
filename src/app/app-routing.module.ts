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
import { AllGoalsComponent } from './goalTrack/all-goals/all-goals.component';
import { AllTasksComponent } from './goalTrack/all-tasks/all-tasks.component';
import { AddGoalComponent } from './goalTrack/add-goal/add-goal.component';
import { AddTaskComponent } from './goalTrack/add-task/add-task.component';
import { UpdateGoalComponent } from './goalTrack/update-goal/update-goal.component';
import { UpdateTaskComponent } from './goalTrack/update-task/update-task.component';
import { AfterLoginComponent } from './after-login/after-login.component';
import { AddMealComponent } from './diet/add-meal/add-meal.component';
import { ListmealsComponent } from './diet/listmeals/listmeals.component';
import { AllFoodsComponent } from './diet/all-foods/all-foods.component';
import { ClientProfileComponent } from './diet/client-profile/client-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeAComponent },
  { path: 'allgoals', component: AllGoalsComponent},
  { path: 'client-profile/:userId', component: ClientProfileComponent },
  {
    path:"alltasks/:idGoal",
    component:AllTasksComponent
  },
  { path: 'user/:userId/meals', component: ClientProfileComponent },
  {
    path:"addGoal",
    component:AddGoalComponent
  },
  {
    path:'updateGoal/:id',
  component:UpdateGoalComponent
  },
  {
    path:'addTask/:idGoal',
  component:AddTaskComponent
  },

  {
    path:'updateTask/:id',
  component:UpdateTaskComponent
  },
  {
    path:"addmeal",
    component:AddMealComponent
  },
  {
    path:"allmeals",
    component:ListmealsComponent
  },
  {
    path:"allfoods",
    component:AllFoodsComponent
  },
  
  {
    path:'afterlogin',
  component:AfterLoginComponent
  },
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
