import { Component } from '@angular/core';
import { Task } from '../model/Task';
import { Goal } from '../model/Goal';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskServiceService } from 'src/app/services/task-service.service';
import { GoalServiceService } from 'src/app/services/goal-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent {
  goalId!:number;
  id!:number
  task!:Task
  goal!:Goal
  constructor(private route:Router , private ts :TaskServiceService, private act : ActivatedRoute, private gs : GoalServiceService){}
  registerForm=new FormGroup({
    description:new FormControl('',[Validators.required,Validators.minLength(5)]),
    startDate:new FormControl('',[Validators.required]),
    deadline:new FormControl('',[Validators.required])
  })

  ngOnInit() {
    this.id = this.act.snapshot.params['id'];
    this.goalId=this.ts.getGoalId();
    this.ts.getTaskById(this.id).subscribe(
      (data) => {
        this.task = data;
        if (this.task) {
          // Convert string dates to Date objects
          this.task.startDate = new Date(this.task.startDate);
          this.task.deadline = new Date(this.task.deadline);
          // Convert dates to string format
          const startDateString = this.task.startDate.toISOString().substring(0, 10);
          const deadlineString = this.task.deadline.toISOString().substring(0, 10);
          // Patch the form
          this.registerForm.patchValue({
            description: this.task.description,
            startDate: startDateString,
            deadline: deadlineString
          });
        }
      }
    );
  }
  
  save() {
    // Fetch the goal by ID
    this.gs.getGoalById(this.goalId).subscribe(
      (goalData) => {
        // Assign the fetched goal to the local goal variable
        this.goal = goalData;
        
        // Create the updated task object
        const updatedTask: any = { 
          ...this.registerForm.value, 
          taskId: this.id, 
          goal: this.goal 
        };
        
        // Update the task
        this.ts.updateTask(updatedTask).subscribe(
          () => {
            this.route.navigateByUrl('alltasks/' + this.goalId);
          }
        );
      }
    );
  }
}
