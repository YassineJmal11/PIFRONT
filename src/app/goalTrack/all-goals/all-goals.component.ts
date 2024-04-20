import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Goal } from '../model/Goal';
import { Task } from '../model/Task';
import { NgIfContext } from '@angular/common';
import { GoalServiceService } from 'src/app/services/goal-service.service';
import { TaskServiceService } from 'src/app/services/task-service.service';
import { forkJoin } from 'rxjs';
import { Chart } from 'chart.js';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/user/users.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Import interaction plugin

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-all-goals',
  templateUrl: './all-goals.component.html',
  styleUrls: ['./all-goals.component.css']
})
export class AllGoalsComponent implements OnInit {
  listGoals: Goal[] = [];
  listTasks: Task[] = [];
  beforeDeadlineTasksComplete: Task[] = [];
  AfterDeadlineTasksIncomplete: Task[] = [];
  beforeDeadlineGoalsComplete:Goal[]=[];
  afterDeadlineGoalsIncomplete:Goal[]=[];
  listIncompleteTasks: Task[] = [];
  listIncompleteGoals: Goal[] = [];
  listCompleteGoals: Goal[] = [];
  listCompleteTasks: Task[] = [];
  showDropdown: boolean = false;
  chartDisplayMap: { [goalId: number]: boolean } = {};
  chart: any;
  ctx: any;
  averageProgress: number = 0;
  selectedSortingOption: string = ''; 
  selectedSortingOrder: string = 'asc'; // Default sorting order
  searchText: string = '';
  filteredGoals: Goal[] = []; // Property to store filtered goals
  currentUser: any;
  userId!:number;
  calendarEvents: any[] = []; // Array to store calendar events
  startDate!: Date  ;
  endDate!: Date  ;
  selectedStartDate!: Date|null;
  selectedEndDate!: Date|null;
  @ViewChild('emptySearch') emptySearch!: TemplateRef<NgIfContext<boolean>>;
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('goalCompletionChart') goalCompletionChart!: ElementRef;
  @ViewChild('taskStatusPieChart') taskStatusPieChart!: ElementRef;
  @ViewChild('goalStatusPieChart') goalStatusPieChart!: ElementRef;

  chartElements = {
    'canvas': this.canvas,
    'goalCompletionChart': this.goalCompletionChart,
    'taskStatusPieChart': this.taskStatusPieChart,
    'goalStatusPieChart': this.goalStatusPieChart
  };




  constructor(
    private gs: GoalServiceService,
    private ts: TaskServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private router : Router,
    private userService: UsersService
  ) {}

  handleDateClick(info: any) {
    console.log('Clicked date:', info.date);
    if (!this.selectedStartDate) {
      // If start date is not selected, save the clicked date as start date
      this.selectedStartDate = info.date;
      console.log('Selected start date:', this.selectedStartDate);
    } else {
      // If start date is selected, save the clicked date as end date
      this.selectedEndDate = info.date!;
      console.log('Selected deadline:', this.selectedEndDate);
      
      // Redirect to add-goal page with selected dates
      this.router.navigate(['/addGoal'], {
        queryParams: {
          startDate: this.selectedStartDate!.toISOString(),
          deadline: this.selectedEndDate!.toISOString()
        }
      });
  
      // Reset selected start and end dates for future selections
      this.selectedStartDate = null;
      this.selectedEndDate = null;
    }
  }
  
  
  

  exportChartToPDF(chartId: string) {
    const chartCanvas = document.getElementById(chartId) as HTMLCanvasElement;

    html2canvas(chartCanvas).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 208;
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(imgData, 0, 0, imgWidth, imgHeight);
      pdf.save('chart.pdf');
    });
  }



  exportAllChartsToPDF() {
    const pdf = new jsPDF();
  
    const options = { background: 'white', scale: 3 };
  
    const chartIds = ['canvas', 'goalCompletionChart', 'taskStatusPieChart', 'goalStatusPieChart'];
  
    let posY = 0;
    let remainingHeight = pdf.internal.pageSize.getHeight(); // Initialize remaining height for the first page
  
    chartIds.forEach(chartId => {
      const chartCanvas = document.getElementById(chartId) as HTMLCanvasElement;
  
      html2canvas(chartCanvas, options).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = (canvas.height * 210) / canvas.width; // Scale width to fit A4 size
  
        if (imgHeight > remainingHeight) {
          pdf.addPage(); // Add new page if the chart doesn't fit on the current page
          posY = 0; // Reset posY for the new page
          remainingHeight = pdf.internal.pageSize.getHeight(); // Reset remainingHeight for the new page
        }
  
        pdf.addImage(imgData, 'PNG', 0, posY, 210, imgHeight);
        posY += imgHeight;
        remainingHeight -= imgHeight;
  
        if (chartId === chartIds[chartIds.length - 1]) {
          pdf.save('all_charts.pdf');
        }
      });
    });
  }
  


  
  
  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.userService.getUserIdByUsername(this.currentUser.username).subscribe(
      (data) => {
        this.currentUser = data;
        this.userId = this.currentUser.userId; 
        console.log( this.currentUser)
        this.fetchData(); 
      }
    );
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin], // Include interaction plugin
    // Add any other options as needed
    dateClick: this.handleDateClick.bind(this) // Bind the dateClick event to your method
  };
  


  fetchCalendarEvents() {

    this.calendarEvents = [];
  
    // Format events for tasks
    this.listIncompleteTasks.forEach(task => {
      // For start date
      this.calendarEvents.push({
        title: task.description,
        start: task.startDate,
        color: 'green' ,
      });
  
      // For deadline date
      this.calendarEvents.push({
        title: task.description,
        start: task.deadline,
        color: 'red' ,
      });
    });
  
    
    this.listIncompleteGoals.forEach(goal => {
      // For start date
      this.calendarEvents.push({
        title: goal.title,
        start: goal.startDate,
        color: 'green' ,

      });
  
      // For deadline date
      this.calendarEvents.push({
        title: goal.title,
        start: goal.deadline,
        color: 'red' 
      });
    });
  }
  
  

  fetchData() {
    forkJoin([
      this.getGoalsWithSorting(this.userId, this.selectedSortingOption, this.selectedSortingOrder), // Pass selected sorting order
      this.ts.findByUserUserId(this.userId),
      this.ts.findCompletedByUserUserIdBeforeDeadline(this.userId),
      this.gs.findCompletedByUserIdBeforeDeadline(this.userId),

    ]).subscribe({
      next: ([goals, tasks, beforeDeadlineTasks, beforeDeadlineGoals, ]) => {
        this.listGoals = goals;
        this.listTasks = tasks;
        this.beforeDeadlineTasksComplete = beforeDeadlineTasks;
        this.beforeDeadlineGoalsComplete = beforeDeadlineGoals;

        
        this.processData();
        this.setupTaskStatusPieChart();
        this.setupGoalStatusPieChart();
        this.calculateAverageProgress();
        this.filterGoals();
        this.fetchCalendarEvents();
      },
      error: (error) => console.log(error),
      complete: () => console.log('Data fetched successfully')
    });
  }

  processData() {
    this.getAllCompleteGoals();
    this.getAllInCompleteGoals();
    this.getAllIncompleteTasks();
    this.getAllCompleteTasks();
    this.setupTaskCompletionChart();
    this.setupGoalCompletionChart();
    this.checkGoalCompletion();
    this.getAllIncompleteTasksAfterDeadline();
    this.getAllIncompleteGoalsAfterDeadline();
  }
  setupTaskCompletionChart() {
    let completed: number = Math.floor((this.listCompleteTasks.length / this.listTasks.length) * 100);
    let not_completed: number = Math.floor((this.listIncompleteTasks.length / this.listTasks.length) * 100);
    this.chart = new Chart('canvas', {
      type: 'doughnut',
      data: {
        labels: ['Not Completed', 'Completed'],
        datasets: [
          {
            data: [not_completed, completed],
            backgroundColor: ['rgba(220,53,69)', 'rgba(28,200,138)'],
          },
        ]
      },
    });
  }

  setupGoalCompletionChart() {
    let completedGoalsCount = this.listCompleteGoals.length;
    let incompleteGoalsCount = this.listIncompleteGoals.length;
    let totalGoalsCount = this.listGoals.length;

    let completed = Math.floor((completedGoalsCount / totalGoalsCount) * 100);
    let not_completed = Math.floor((incompleteGoalsCount / totalGoalsCount) * 100);

    let goalCompletionChart = new Chart('goalCompletionChart', {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Not Completed'],
            datasets: [{
                data: [completed, not_completed],
                backgroundColor: ['rgba(28,200,138)', 'rgba(220,53,69)'],
            }]
        },
    });
}

setupTaskStatusPieChart() {
  const completedBeforeDeadline = this.beforeDeadlineTasksComplete.length;
  const completedAfterDeadline = this.listCompleteTasks.length - completedBeforeDeadline;
  const notCompletedBeforeDeadline = this.listIncompleteTasks.length - this.AfterDeadlineTasksIncomplete.length;
  const notCompletedAfterDeadline = this.AfterDeadlineTasksIncomplete.length;

  this.chart = new Chart('taskStatusPieChart', {
    type: 'pie',
    data: {
      labels: ['Completed Before Deadline', 'Completed After Deadline', 'Not Completed Before Deadline', 'Not Completed After Deadline'],
      datasets: [{
        data: [completedBeforeDeadline, completedAfterDeadline, notCompletedBeforeDeadline, notCompletedAfterDeadline],
        backgroundColor: ['rgba(28,200,138)', 'rgba(220,53,69)', 'rgba(255,193,7)', 'rgba(0,123,255)'],
      }]
    },
  });
}

setupGoalStatusPieChart() {
  const completedBeforeDeadline = this.beforeDeadlineGoalsComplete.length;
  const completedAfterDeadline = this.listCompleteGoals.length - completedBeforeDeadline;
  const notCompletedBeforeDeadline = this.listIncompleteGoals.length - this.afterDeadlineGoalsIncomplete.length;
  const notCompletedAfterDeadline = this.afterDeadlineGoalsIncomplete.length;

  this.chart = new Chart('goalStatusPieChart', {
    type: 'pie',
    data: {
      labels: ['Completed Before Deadline', 'Completed After Deadline', 'Not Completed Before Deadline', 'Not Completed After Deadline'],
      datasets: [{
        data: [completedBeforeDeadline, completedAfterDeadline, notCompletedBeforeDeadline, notCompletedAfterDeadline],
        backgroundColor: ['rgba(28,200,138)', 'rgba(220,53,69)', 'rgba(255,193,7)', 'rgba(0,123,255)'],
      }]
    },
  });
}


  checkGoalCompletion() {
    this.listGoals.forEach((goal) => {
      const goalTasks = this.listTasks.filter(task => task.goal.goalId === goal.goalId);
      const completedTasksCount = goalTasks.filter(task => task.completed).length;
      const totalTasksCount = goalTasks.length;
      if (totalTasksCount > 0) {
        const progress = (completedTasksCount / totalTasksCount) * 100;
        goal.progress = progress;
      } else {
        goal.progress = 0; 
      }

    
      const allTasksCompleted = goalTasks.every(task => task.completed);

      if (allTasksCompleted) {
        goal.completed = true;
        goal.completionDate = new Date(); 
      } else {
        goal.completed = false;
        goal.completionDate = null;
      }

      this.gs.updateGoal(goal).subscribe(
        () => console.log('Goal updated successfully'),
        (error) => console.log('Error updating goal:', error)
      );
    });
  }

  getAllIncompleteTasks(): Task[] {
    return this.listIncompleteTasks = this.listTasks.filter(task => !task.completed);
  }

  getAllIncompleteTasksAfterDeadline(): Task[] {
    const currentDate = new Date();
    return this.AfterDeadlineTasksIncomplete = this.listIncompleteTasks.filter(task => new Date(task.deadline) < currentDate);
  }

  getAllIncompleteGoalsAfterDeadline(): Goal[] {
    const currentDate = new Date();
    return this.afterDeadlineGoalsIncomplete = this.listIncompleteGoals.filter(goal => new Date(goal.deadline) < currentDate);
  }
  

  getAllCompleteTasks(): Task[] {
    return this.listCompleteTasks = this.listTasks.filter(task => task.completed);
  }
  getAllCompleteGoals(): Goal[] {
    return this.listCompleteGoals = this.listGoals.filter(goal => goal.completed);
  }
  getAllInCompleteGoals(): Goal[] {
    return this.listIncompleteGoals = this.listGoals.filter(goal => !goal.completed);
  }

  hasIncompleteTasks(): boolean {
    return this.listTasks.some(task => !task.completed);
  }

  // Toggle the dropdown
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  showChart(goal: Goal): void {
    // Toggle the display status of the chart for the specific goal
    this.chartDisplayMap[goal.goalId] = !this.chartDisplayMap[goal.goalId];
  }

  isChartDisplayed(goalId: number): boolean {
    // Check if the chart is displayed for the specific goal
    return !!this.chartDisplayMap[goalId];
  }

  supp(id: number) {
    this.gs.DeleteGoal(id).subscribe(
      () => this.fetchData()
    );
  }

  calculateAverageProgress() {
    if (this.listGoals.length > 0) {
        const totalProgress = this.listGoals.reduce((acc, curr) => acc + curr.progress, 0);
        this.averageProgress = totalProgress / this.listGoals.length;
    } else {
        this.averageProgress = 0;
    }}

    getGoalsWithSorting(userId: number, sortBy: string, sortOrder: string) {
      switch(sortBy) {
        case 'progress':
          return sortOrder === 'asc' ? this.gs.findByUserUserIdOrderByProgressAsc(userId) : this.gs.findByUserUserIdOrderByProgressDesc(userId);
        case 'deadline':
          return sortOrder === 'asc' ? this.gs.findByUserUserIdOrderByDeadlineAsc(userId) : this.gs.findByUserUserIdOrderByDeadlineDesc(userId);
        default:
          return this.gs.getGoalsByUserId(userId);
      }
    }
    
    onSortingOptionChange() {
      this.fetchData(); // Fetch data whenever the sorting option changes
    }
    
    onSortingOrderChange() {
      this.fetchData(); // Fetch data whenever the sorting order changes
    }
  
 filterGoals() {
  if (this.searchText.trim() === '') {
    // If search text is empty, reset filtered goals to all goals
    this.filteredGoals = [...this.listGoals];
  } else {
    // Filter the goals based on search text
    this.filteredGoals = this.listGoals.filter(goal =>
      goal.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      goal.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}







    onSearch() {
      if (this.searchText.trim() === '') {
        // If search text is empty, reset filtered goals to all goals
        this.filteredGoals = [...this.listGoals];
      } else {
        // Call the search method from the GoalServiceService to fetch filtered goals
        this.gs.search(this.userId, this.searchText.trim()).subscribe({
          next: (filteredGoals) => {
            this.filteredGoals = filteredGoals;
          },
          error: (error) => {
            console.error('Error fetching filtered goals:', error);
          }
        });
      }
    }

    dismissAlert(task: Task) {
      console.log("Dismiss alert called for task:", task);
      const index = this.listIncompleteTasks.findIndex(t => t.taskId === task.taskId);
      if (index !== -1) {
          this.listIncompleteTasks.splice(index, 1);
      }
  }
  
}
