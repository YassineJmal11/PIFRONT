import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoalServiceService } from 'src/app/services/goal-service.service';
import { TaskServiceService } from 'src/app/services/task-service.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.css']
})
export class AddGoalComponent implements OnInit{
  userId!:number;
  currentUser: any;

  
  
  constructor(
    private gs: GoalServiceService,
    private ts: TaskServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private route: ActivatedRoute, 
    private router: Router,
    private userService: UsersService
  ) {}


  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.userService.getUserIdByUsername(this.currentUser.username).subscribe(
      (data) => {
        this.currentUser = data;
        this.userId = this.currentUser.userId; 
        console.log( this.currentUser)
        
      }
    );
   this.route.queryParams.subscribe(params => {
    const selectedStartDate = params['startDate'];
    const selectedDeadlineDate = params['deadline'];
    if (selectedStartDate) {
      // Convert the string to a Date object
      let startDate = new Date(selectedStartDate);
      startDate.setDate(startDate.getDate() + 1);
      // Convert Date object to a string in YYYY-MM-DD format
      const formattedStartDate = startDate.toISOString().split('T')[0];

      this.registerForm.patchValue({ startDate: formattedStartDate }); // Assign the formatted string
    }

    if (selectedDeadlineDate) {
      // Convert the string to a Date object
      let deadline = new Date(selectedDeadlineDate);
      deadline.setDate(deadline.getDate() + 1);

      // Convert Date object to a string in YYYY-MM-DD format
      const formattedDeadlineDate = deadline.toISOString().split('T')[0];

      this.registerForm.patchValue({ deadline: formattedDeadlineDate }); // Assign the formatted string
    }
  });
  }
  registerForm=new FormGroup({
    title:new FormControl('',[Validators.required,Validators.minLength(5)]),
    description:new FormControl('',[Validators.required,Validators.minLength(5)]),
    startDate:new FormControl('',[Validators.required]),
    deadline:new FormControl('',[Validators.required])
  })

  save(){
    this.gs.createGoalAndSetUser(this.registerForm.value as any,this.userId).subscribe(
      ()=>{this.router.navigateByUrl('/allgoals')}
     )
  }
  reset(){
    this.registerForm.reset()
  }
}
