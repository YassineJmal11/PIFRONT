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
import { AddCommunityComponent } from './forum/community/add-community/add-community.component';
import { FeedComponent } from './forum/community/feed/feed.component';
import { ViewCommunityComponent } from './forum/community/view-community/view-community.component';
import { CreatePostComponent } from './forum/community/post/create-post/create-post.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeAComponent },
  { path: 'allgoals', component: AllGoalsComponent},
  {
    path:"alltasks/:idGoal",
    component:AllTasksComponent
  },
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
    path:'community/:id',
    component:ViewCommunityComponent

  },
  {
    path:"addCommunity",
    component:AddCommunityComponent
  },
  { path: "addPost", component: CreatePostComponent },

  {
    path:"feed",
    component:FeedComponent
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
