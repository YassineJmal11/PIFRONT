import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Meal } from '../model/Meal';
import { MealService } from '../services/meal.service';
import { Food } from '../model/Food';
import { User } from '../model/User';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import dayGridPlugin from '@fullcalendar/daygrid'; // Import DayGridPlugin

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.css'],
})
export class ClientProfileComponent implements OnInit, OnDestroy {
  userId: number = 0;
  userMeals: Meal[] = [];
  user: User | undefined;
  mealFoods: { [mealId: number]: Food[] } = {};
  expandedMeals: { [mealId: number]: boolean } = {};
  isLoading: boolean = true; // Flag to indicate data loading state
  private routeSub: Subscription | undefined;
  listMeals: Meal[] = []; // Define listMeals property
  totalProtein: number = 0;
  totalProteinNeeded: number = 0;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    {
      title: 'Event 1',
      start: new Date(),
      color: { primary: '#e3bc08', secondary: '#FDF1BA' }
    },
    // Add more events as needed
  ];

  constructor(
    private route: ActivatedRoute,
    private mealService: MealService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.userId = +params.get('userId')! || 0;
      this.fetchUserDetails(); // Fetch user details based on the ID
      this.fetchUserMeals(); // Fetch meals associated with the user
      this.fetchTotalProteinForUser();
    });

    // Animation code
    this.animateBars();
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  animateBars(): void {
    // Get the bars using ElementRef
    const intakeBar: HTMLElement = this.elementRef.nativeElement.querySelector('.intake-bar');
    const neededBar: HTMLElement = this.elementRef.nativeElement.querySelector('.needed-bar');

    // Set initial heights to 0px
    intakeBar.style.height = '0px';
    neededBar.style.height = '0px';

    // Animate the bars to their actual heights after a delay
    setTimeout(() => {
      intakeBar.style.height = this.totalProtein + 'px';
      neededBar.style.height = this.totalProteinNeeded + 'px';
    }, 100); // Adjust the delay as needed
  }

  fetchUserDetails(): void {
    this.mealService.getUserById(this.userId).subscribe(
      (user: User) => {
        this.user = user; // Assign the fetched user details
        this.isLoading = false; // Data loading completed
        this.fetchTotalProteinForUser();
      },
      (error) => {
        console.error('Error fetching user details:', error);
        // Handle error (e.g., show error message)
        this.isLoading = false; // Data loading completed (even if it failed)
      }
    );
  }

  fetchUserMeals(): void {
    this.mealService.getUserMeals(this.userId).subscribe(
      (meals: Meal[]) => {
        this.userMeals = meals;
        this.listMeals = meals; // Assign user meals to listMeals property
        this.userMeals.forEach((meal) => {
          this.getFoodsForMeal(meal.mealId);
        });
      },
      (error) => {
        console.error('Error fetching user meals:', error);
        // Handle error (e.g., show error message)
      }
    );
  }

  toggleFoods(mealId: number): void {
    this.expandedMeals[mealId] = !this.expandedMeals[mealId];

    if (!this.mealFoods[mealId] && this.expandedMeals[mealId]) {
      this.getFoodsForMeal(mealId);
    }
  }

  isExpanded(mealId: number): boolean {
    return !!this.expandedMeals[mealId];
  }

  getFoodsForMeal(mealId: number): void {
    this.mealService.getAllFoodsForMeal(mealId).subscribe(
      (foods: Food[]) => {
        this.mealFoods[mealId] = foods;
      },
      (error) => {
        console.error(`Error fetching foods for meal ${mealId}:`, error);
        // Handle error (e.g., show error message)
      }
    );
  }
  fetchTotalProteinForUser(): void {
    this.mealService.calculateTotalProteinForUser(this.userId).subscribe(
      (totalProtein: number) => {
        this.totalProtein = totalProtein;
        this.totalProteinNeeded = this.calculateProteinNeeded(this.user!.weight); // Calculate protein needed
      },
      (error) => {
        console.error('Error fetching total protein for user:', error);
      }
    );
  }
  calculateProteinNeeded(weight: number): number {
    // Assuming the protein requirement is a percentage of the user's weight
    // You can adjust this formula based on your specific requirements or recommendations
    const proteinPercentage = 0.8; // For example, 0.8 represents 80% of the weight
    return weight * proteinPercentage;
  }
  dayModifier(day: Date): boolean {
    // Example of modifying the day (e.g., disable weekends)
    return day.getDay() !== 0 && day.getDay() !== 6;
  }

  handleEventClick(event: CalendarEvent): void {
    console.log('Clicked on event: ', event);
  }
  disassociateMealFromUser(mealId: number, userId: number): void {
    this.mealService.disassociateMealFromUser(mealId, userId).subscribe(
      () => {
        console.log('Meal disassociated successfully');
        // Optionally, you can refresh the meal list or handle success in other ways
        this.fetchUserMeals(); // Auto-refresh user meals
      },
      (error) => {
        console.error('Error disassociating meal:', error);
        // Handle error, if needed
      }
    );
  }
  
}
