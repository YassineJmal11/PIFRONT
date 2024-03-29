import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoalServiceService } from 'src/app/services/goal-service.service';
import { TaskServiceService } from 'src/app/services/task-service.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.css']
})
export class AddGoalComponent implements OnInit{
  userId:number=1;
  currentUser: any;

  ngOnInit() {
    this.currentUser = this.token.getUser();
   // this.userId=this.currentUser.id;
  }
  constructor(
    private gs: GoalServiceService,
    private ts: TaskServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private route : Router
  ) {}
  registerForm=new FormGroup({
    title:new FormControl('',[Validators.required,Validators.minLength(5)]),
    description:new FormControl('',[Validators.required,Validators.minLength(5)]),
    startDate:new FormControl('',[Validators.required]),
    deadline:new FormControl('',[Validators.required])
  })

  save(){
    this.gs.createGoalAndSetUser(this.registerForm.value as any,this.userId).subscribe(
      ()=>{this.route.navigateByUrl('/allgoals')}
     )
  }
  reset(){
    this.registerForm.reset()
  }
}
