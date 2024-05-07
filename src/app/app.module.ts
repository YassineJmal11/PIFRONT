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



import { AlluserComponent } from './user/alluser/alluser.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { VerifyComponent } from './user/verify/verify.component';
import { SignupadminComponent } from './user/signupadmin/signupadmin.component';

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
import { AddCommunityComponent } from './forum/community/add-community/add-community.component';
import { FeedComponent } from './forum/community/feed/feed.component';
import { ViewCommunityComponent } from './forum/community/view-community/view-community.component';
import { CreatePostComponent } from './forum/community/post/create-post/create-post.component';
import { ViewPostComponent } from './forum/community/view-post/view-post.component';
import dayGridPlugin from '@fullcalendar/daygrid'; // DayGrid plugin
import { ForgotPasswordComponent } from './user/forgot-password/forgot-password.component';
import { ChatComponent } from './chat/chat/chat.component';

import { MeetComponent } from './chat/meet/meet.component';
import { ProductCardComponent } from './store/product-card/product-card.component';
import { ProductReviewComponent } from './store/product-review/product-review.component';
import { ProductViewComponent } from './store/product-view/product-view.component';
import { ShoppingCartComponent } from './store/shopping-cart/shopping-cart.component';
import { StoreBackendEditComponent } from './store/store-backend-edit/store-backend-edit.component';
import { StoreBackendTableviewerComponent } from './store/store-backend-tableviewer/store-backend-tableviewer.component';
import { StoreShipmentComponent } from './store/store-shipment/store-shipment.component';
import { StoreComponent } from './store/store/store.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ListExerciceComponent } from './workout/list-exercice/list-exercice.component';
import { ClientWorkoutprofileComponent } from './workout/client-workoutprofile/client-workoutprofile.component';
import { AllFoodsComponent } from './diet/all-foods/all-foods.component';
import { ListmealsComponent } from './diet/listmeals/listmeals.component';
import { ClientProfileComponent } from './diet/client-profile/client-profile.component';
import { AddMealComponent } from './diet/add-meal/add-meal.component';
import { WorkoutclientComponent } from './workout/workoutclient/workoutclient.component';
import { AddWorkoutComponent } from './workout/add-workout/add-workout.component';
import { MyProfileWorkoutComponent } from './workout/my-profile-workout/my-profile-workout.component';
import { MyProfileDietComponent } from './diet/my-profile-diet/my-profile-diet.component';


////Wellbeing////
import { RelaxationExerciseAddComponent } from './wellbeing/addexercise/relaxation-exercise-add/relaxation-exercise-add.component';
import { RelaxationExerciseListComponent } from './wellbeing/allexercise/relaxation-exercise-list/relaxation-exercise-list.component';
import { RelaxationExerciseUpdateComponent } from './wellbeing/updateexercise/relaxation-exercise-update/relaxation-exercise-update.component';
import { TipComponent } from './wellbeing/tip/tip/tip.component';
import { ProfessionalComponent } from './wellbeing/professional/professional.component';
import { PsyCustomersComponent } from './wellbeing/psy-customers/psy-customers.component';
import { CustomerExerciseComponent } from './wellbeing/customer-exercise/customer-exercise.component';
import { ListExerciseCustomerComponent } from './wellbeing/list-exercise-customer/list-exercise-customer.component';
import { RatingComponent } from './rating/rating.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
////////

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
    ForgotPasswordComponent,
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
   ViewPostComponent,
   EditComponent,
   AlluserComponent,
   ResetPasswordComponent,
   VerifyComponent,
   SignupadminComponent,
   AfterLoginComponent,
   ChatComponent,
 
   MeetComponent,
   AllFoodsComponent,
   ListmealsComponent,
   ClientProfileComponent,
   AddMealComponent,
   WorkoutclientComponent,
   AddWorkoutComponent,
   ListExerciceComponent,
   ClientWorkoutprofileComponent,
   
   StoreComponent,
   ProductCardComponent,
   ProductViewComponent,
   ProductReviewComponent,
   ShoppingCartComponent,
   StoreBackendEditComponent,
   StoreBackendTableviewerComponent,
   StoreShipmentComponent,


   RelaxationExerciseAddComponent,
   RelaxationExerciseListComponent,
   RelaxationExerciseUpdateComponent,
   TipComponent,
   ProfessionalComponent,
   PsyCustomersComponent,
   CustomerExerciseComponent,
   ListExerciseCustomerComponent,

   MyProfileWorkoutComponent,
   MyProfileDietComponent,
   RatingComponent,

  

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartjsModule,
    FullCalendarModule , 
    AutocompleteLibModule, NgbModule,

    
  ],
  providers: [ authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
