import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TaskServiceService } from 'src/app/services/task-service.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';
import { Exercice } from '../model/Exercice';
import { ExerciceService } from '../serviceworkout/exercice.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import { Session } from '../model/Session';
import { SessionService } from '../serviceworkout/session.service';


@Component({
  selector: 'app-my-profile-workout',
  templateUrl: './my-profile-workout.component.html',
  styleUrls: ['./my-profile-workout.component.css']
})
export class MyProfileWorkoutComponent {
  userId: number = 0;
  exercices: Exercice[] = [];
  sessions: Session[] = [];
  sessionName: string = 'New Session';


    
  constructor(
    
    private exerciceService: ExerciceService,
    private tokenService: TokenStorageService,
    private usersService: UsersService,
    private route: ActivatedRoute, 
    private userService: UsersService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.loadUserId();
   
    
  }

  loadUserId(): void {
    // Get current user from token storage
    const currentUser = this.tokenService.getUser();

    // Get user ID by username
    this.userService.getUserIdByUsername(currentUser.username).subscribe(
      (data: any) => {
        this.userId = data.userId;
        this.loadExercises();
        this.loadSessions();
      },
      (error: any) => {
        console.error('Error loading user ID:', error);
      }
    );
  }
  loadExercises(): void {
    this.exerciceService.getExercisesByUserId(this.userId)
      .subscribe(
        (exercises: Exercice[]) => {
          this.exercices = exercises;
        },
        (error: any) => {
          console.error('Error loading exercises:', error);
        }
      );
  }
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    events: this.sessions // Set the events array to the sessions
  };

  initCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: this.handleDateClick.bind(this),
      events: this.sessions 
    };
  }
  loadSessions(): void {
    this.sessionService.getSessionsByUserId(this.userId)
      .subscribe(
        (sessions: Session[]) => {
          this.sessions = sessions; // Assign sessions directly
          
          // Map sessions to objects with title property
          this.calendarOptions.events = this.sessions.map(session => ({
            title: session.sessionName, // Set the session name as the title
            date: new Date(session.date) // Convert date string to Date object
          }));
        },
        (error: any) => {
          console.error('Error loading sessions:', error);
        }
      );
  }

  handleDateClick(info: any) {
    const sessionName = prompt('Enter the session name:', this.sessionName); // Prompt user for session name
    if (sessionName !== null && sessionName.trim() !== '') { // Check if session name is provided
      console.log('Clicked date:', info.date);
      
      // Create a new session object with the provided session name
      const session: Session = {
        sessionName: sessionName.trim(),
        date: info.date.toISOString() // Convert date to ISO string format
      };
    
      // Call the session service method to create a new session and associate it with the user
      this.sessionService.addSessionWithUser(session, this.userId).subscribe(
        (createdSession: Session) => {
          console.log('Session created successfully:', createdSession);
          // Provide feedback to the user, such as displaying a success message
        },
        (error: any) => {
          console.error('Error creating session:', error);
          // Handle the error and provide feedback to the user
        }
      );
    }
  }
}
