import { Component } from '@angular/core';
import { Task } from '../model/Task';
import { Goal } from '../model/Goal';
import { TaskServiceService } from 'src/app/services/task-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalServiceService } from 'src/app/services/goal-service.service';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.component.html',
  styleUrls: ['./all-tasks.component.css']
})
export class AllTasksComponent {
  listTasks: Task[] = [];
  idGoal!: number;
  task: Task | null = null;
  goal: Goal | null = null;

  constructor(
    private ts: TaskServiceService,
    private route: Router,
    private act: ActivatedRoute,
    private gs:GoalServiceService

  ) {}

  ngOnInit() {
    this.idGoal = +this.act.snapshot.params['idGoal']; // Parse to number
    this.ts.setGoalId(this.idGoal);
    this.fetchTasks(); // Fetch tasks when component initializes
    this.checkGoalCompletion();
  }

  fetchTasks() {
    this.ts.getTasksByGoalId(this.idGoal).subscribe({
      next: (data) => this.listTasks = data,
      error: (error) => console.log(error),
      complete: () => console.log('Tasks fetched successfully')
    });
  }

  supp(id: number) {
    this.ts.DeleteTask(id).subscribe(
      () => this.fetchTasks() // Refresh tasks after deletion
    );
  }

  completed(taskId: number) {
    this.ts.getTaskById(taskId).subscribe(
      (task) => {
        if (task) {
          task.completed = true;
          task.completionDate = new Date(); // Set completion date to current date and time
          this.ts.updateTask(task).subscribe(
            (updatedTask) => {
              this.task = updatedTask as Task;
              console.log('Task updated:', updatedTask);
              this.fetchTasks(); // Refresh tasks after completion
              this.checkGoalCompletion(); // Check and update goal completion status
            },
            (error) => console.log('Error updating task:', error)
          );
        }
      },
      (error) => console.log('Error fetching task:', error)
    );
  }
  
  
  checkGoalCompletion() {
    this.ts.getTasksByGoalId(this.idGoal).subscribe({
      next: (tasks) => {
        const incompleteTasks = tasks.filter(task => !task.completed);
        if (incompleteTasks.length === 0) {
          this.gs.getGoalById(this.idGoal).subscribe(
            (goal) => {
              if (goal) {
                goal.completed = true; // Update completion status of the goal
                this.gs.updateGoal(goal).subscribe(
                  () => console.log('Goal updated successfully'),
                  (error) => console.log('Error updating goal:', error)
                );
              }
            },
            (error) => console.log('Error fetching goal:', error)
          );
        }
        else {
          this.gs.getGoalById(this.idGoal).subscribe(
            (goal) => {
              if (goal) {
                goal.completed = false; // Update completion status of the goal
                this.gs.updateGoal(goal).subscribe(
                  () => console.log('Goal updated successfully'),
                  (error) => console.log('Error updating goal:', error)
                );
              }
            },
            (error) => console.log('Error fetching goal:', error)
          );
        }
       
      },
      error: (error) => console.log(error)
    });
  }
}
