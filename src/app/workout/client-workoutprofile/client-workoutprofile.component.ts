import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/diet/model/User';
import { Exercice } from '../model/Exercice';
import { ExerciceService } from '../serviceworkout/exercice.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import { Session } from '../model/Session';
import { SessionService } from '../serviceworkout/session.service';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-client-workoutprofile',
  templateUrl: './client-workoutprofile.component.html',
  styleUrls: ['./client-workoutprofile.component.css']
})
export class ClientWorkoutprofileComponent {
  userId: number = 0;
  exercices: Exercice[] = [];
  sessionName: string = 'New Session';
  sessions: Session[] = [];


  constructor(private route: ActivatedRoute, 
              private router: Router,
              private exerciceService: ExerciceService,
              private sessionService: SessionService)
              {
                this.calendarOptions.dateClick = this.handleDateClick.bind(this); // Move the dateClick binding to the constructor
              }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      this.loadExercises();
      this.loadSessions();
      this.initCalendarOptions();
    });
  }
  initCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: this.handleDateClick.bind(this),
      events: this.sessions 
    };
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
}