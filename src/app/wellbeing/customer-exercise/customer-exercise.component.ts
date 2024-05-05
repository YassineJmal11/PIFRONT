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
  notes: Notes[] = [];

  constructor(
    private route: ActivatedRoute,
    private relaxationExerciseService: RelaxationExerciseServiceService,
    private router: Router,
    private notesservice: NotesService
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
    const noteName = prompt('Enter the Note name:', this.notename);
    if (noteName !== null && noteName.trim() !== '') {
      const note: Notes = {
        notename: noteName.trim(),
        notedate: info.date.toISOString()
      };
      
      this.notesservice.addNoteWithUser(note, this.userId).subscribe(
        (createdNote: Notes) => {
          console.log('Note created successfully:', createdNote);
          this.notes.push(createdNote); // Ajouter la nouvelle note à la liste locale
          this.updateCalendarEvents(); // Mettre à jour les événements du calendrier
        },
        (error: any) => {
          console.error('Error creating note:', error);
          // Gérer l'erreur
        }
      );
    }
  }

  loadNotes(): void {
    this.notesservice.getNotesByUserId(this.userId)
      .subscribe(
        (notes: Notes[]) => {
          this.notes = notes; 
          this.updateCalendarEvents(); // Mettre à jour les événements du calendrier avec les notes récupérées
        },
        (error: any) => {
          console.error('Error loading Notes:', error);
        }
      );
  }

  updateCalendarEvents(): void {
    this.calendarOptions.events = this.notes.map(note => ({
      title: note.notename,
      date: new Date(note.notedate)
    }));
  }

  loadExercises(): void {
    if (this.userId) {
      const userExercises = localStorage.getItem('userExercises');
      if (userExercises) {
        this.exercises = JSON.parse(userExercises);
      } else {
        this.relaxationExerciseService.getRelaxationExercisesForUser(this.userId).subscribe(
          (exercises: RelaxationExercise[]) => {
            this.exercises = exercises;
            localStorage.setItem('userExercises', JSON.stringify(exercises));
          },
          error => {
            console.log('Erreur lors du chargement des exercices de relaxation:', error);
          }
        );
      }
    } else {
      console.log('ID de l\'utilisateur non trouvé.');
    }
  }

  deleteExercise(id: number): void {
    this.relaxationExerciseService.deleteExerciceAndUserProgress(id).subscribe(() => {
      this.loadExercises();
    });
  }

  updateExercise(exercise: RelaxationExercise): void {
    this.router.navigate(['/relaxation-exercise-update', exercise.relaxationExerciceId]);
  }
}
