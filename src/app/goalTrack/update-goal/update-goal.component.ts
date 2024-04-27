import { Component } from '@angular/core';
import { Goal } from '../model/Goal';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalServiceService } from 'src/app/services/goal-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/user/user';
import { UsersService } from 'src/app/user/users.service';

@Component({
  selector: 'app-update-goal',
  templateUrl: './update-goal.component.html',
  styleUrls: ['./update-goal.component.css']
})
export class UpdateGoalComponent {
  goalId!:number
  userId!:number;
  p!:Goal
  constructor(private route:Router , private gs :GoalServiceService , private act : ActivatedRoute,    private userService: UsersService
  ){}
  registerForm=new FormGroup({
    title:new FormControl('',[Validators.required,Validators.minLength(5)]),
    description:new FormControl('',[Validators.required,Validators.minLength(5)]),
    startDate:new FormControl('',[Validators.required]),
    deadline:new FormControl('',[Validators.required])
  })

  ngOnInit() {
    this.goalId = this.act.snapshot.params['id'];
   
    this.gs.getGoalById(this.goalId).subscribe(
      (data) => {
        this.p = data;
        this.userId = this.p.user.userId;
        if (this.p) {
          // Convert string dates to Date objects
          this.p.startDate = new Date(this.p.startDate);
          this.p.deadline = new Date(this.p.deadline);
          // Convert dates to string format
          const startDateString = this.p.startDate.toISOString().substring(0, 10);
          const deadlineString = this.p.deadline.toISOString().substring(0, 10);
          // Patch the form
          this.registerForm.patchValue({
            title: this.p.title,
            description: this.p.description,
            startDate: startDateString,
            deadline: deadlineString
          });
        }
      }
    );
  }
  save() {
    const updatedGoal : any = { ...this.registerForm.value, goalId: this.goalId , user:{userId:this.userId}}; // Include the ID in the updated goal object
    this.gs.updateGoal(updatedGoal).subscribe(
      () => {
        this.route.navigateByUrl('/allgoals');
      }
    );
  }
  
}
