import { Component } from '@angular/core';
import { RelaxationExercise } from '../model/RelaxationExercise';
import { RelaxationExerciseServiceService } from '../wservices/relaxation-exercise-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import { FullCalendarModule } from '@fullcalendar/angular';
import { Notes } from '../model/Notes';

import { NotesService } from '../wservices/notes.service';

@Component({
  selector: 'app-customer-exercise',
  templateUrl: './customer-exercise.component.html',
  styleUrls: ['./customer-exercise.component.css']
})
export class CustomerExerciseComponent {
  exercises: RelaxationExercise[] = [];
  userId !: number;
  notename: string = 'new note';
  notes: Notes[]=[];
  constructor(
    private route: ActivatedRoute,
    private relaxationExerciseService: RelaxationExerciseServiceService,
    private router : Router,
    private notesservice : NotesService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
      this.loadExercises();
      this.loadNotes();
      this.initCalendarOptions();
    });
  }

  initCalendarOptions(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: this.handleDateClick.bind(this),
      events: this.notes 
    };
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    events: this.notes // Set the events array
  };

  handleDateClick(info: any) {
    const noteName = prompt('Enter the Note name:', this.notename); // Prompt user for note name
    console.log('Note name entered:', noteName); // Log the note name
    if (noteName !== null && noteName.trim() !== '') { // Check if note name is provided
        // Create a new note object with the provided name and date
        const note: Notes = {
            notename: noteName.trim(),
            notedate: info.date.toISOString() // Convert date to ISO string format
        };
        
        // Call the note service method to add the note
        this.notesservice.addNoteWithUser(note, this.userId).subscribe(
            (createdNote: Notes) => {
                console.log('Note created successfully:', createdNote);
                // Provide feedback to the user, such as displaying a success message
            },
            (error: any) => {
                console.error('Error creating note:', error);
                // Handle the error and provide feedback to the user
            }
        );
    }
}

  loadNotes(): void {
    this.notesservice.getNotesByUserId(this.userId)
      .subscribe(
        (notes: Notes[]) => {
          this.notes = notes; 
          
          this.calendarOptions.events = this.notes.map(note => ({
            title: note.notename, // Set the session name as the title
            date: new Date(note.notedate) // Convert date string to Date object
          }));
        },
        (error: any) => {
          console.error('Error loading Notes:', error);
        }
      );
  }






  loadExercises(): void {
    if (this.userId) {
      this.relaxationExerciseService.getRelaxationExercisesForUser(this.userId).subscribe(
        (exercises: RelaxationExercise[]) => {
          this.exercises = exercises;
        },
        error => {
          console.log('Erreur lors du chargement des exercices de relaxation:', error);
        }
      );
    } else {
      console.log('ID de l\'utilisateur non trouvé.');
    }
  }
  deleteExercise(id: number): void {
    this.relaxationExerciseService.deleteExercise(id).subscribe(() => {
      this.loadExercises();
    });
  }

  updateExercise(exercise: RelaxationExercise): void {
    this.router.navigate(['/relaxation-exercise-update', exercise.relaxationExerciceId]); // Redirection avec l'ID de l'exercice
  }
}
