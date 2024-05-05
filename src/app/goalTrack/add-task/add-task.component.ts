import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskServiceService } from 'src/app/services/task-service.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  idGoal!:number;
  constructor(private route:Router , private ts :TaskServiceService, private act : ActivatedRoute){}
  registerForm=new FormGroup({
    description:new FormControl('',[Validators.required,Validators.minLength(5)]),
    startDate:new FormControl('',[Validators.required]),
    deadline:new FormControl('',[Validators.required])
  })

  ngOnInit(){
    this.idGoal = this.act.snapshot.params['idGoal'];
 
     }

     save(){
      this.ts.AddTaskAndSetGoal(this.registerForm.value as any, this.idGoal).subscribe(
        () => {
          this.route.navigateByUrl('alltasks/'+this.idGoal); 
        }
      );
    }
    
  reset(){
    this.registerForm.reset()
  }
}
