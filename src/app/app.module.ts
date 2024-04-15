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
import { AllGoalsComponent } from './goalTrack/all-goals/all-goals.component';
import { AllTasksComponent } from './goalTrack/all-tasks/all-tasks.component';
import { AddGoalComponent } from './goalTrack/add-goal/add-goal.component';
import { NgChartjsModule } from 'ng-chartjs';
import { AddTaskComponent } from './goalTrack/add-task/add-task.component';
import { UpdateTaskComponent } from './goalTrack/update-task/update-task.component';
import { UpdateGoalComponent } from './goalTrack/update-goal/update-goal.component';
import { AfterLoginComponent } from './after-login/after-login.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // FullCalendar module
import dayGridPlugin from '@fullcalendar/daygrid';
import { AddCommunityComponent } from './forum/community/add-community/add-community.component';
import { FeedComponent } from './forum/community/feed/feed.component';
import { ViewCommunityComponent } from './forum/community/view-community/view-community.component';
import { CreatePostComponent } from './forum/community/post/create-post/create-post.component';

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
   EditComponent,
   AllGoalsComponent,
   AllTasksComponent,
   AddGoalComponent,
   AddTaskComponent,
   UpdateTaskComponent,
   UpdateGoalComponent,
   AfterLoginComponent,
   AddCommunityComponent,
   FeedComponent,
   ViewCommunityComponent,
   CreatePostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartjsModule,
    FullCalendarModule  
    
  ],
  providers: [ authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
