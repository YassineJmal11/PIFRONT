import { Component } from '@angular/core';
import { RelaxationExerciseServiceService } from '../../wservices/relaxation-exercise-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-relaxation-exercise-add',
  templateUrl: './relaxation-exercise-add.component.html',
  styleUrls: ['./relaxation-exercise-add.component.css']
})
export class RelaxationExerciseAddComponent {
  selectedFile: File | null = null;
  exerciseName = '';
  exerciseInstructions = '';
  exerciseDuration = 0;
  exerciseType = '';

  constructor(private relaxationExerciseService: RelaxationExerciseServiceService, private router: Router) { }
  
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  getVideoUrl(): string {
    if (this.selectedFile) {
      return URL.createObjectURL(this.selectedFile);
    }
    return ''; // Retourne une chaîne vide si aucun fichier n'est sélectionné
  }

  uploadExercise(): void {
    if (this.selectedFile && this.exerciseName && this.exerciseInstructions && this.exerciseDuration && this.exerciseType) {
      this.relaxationExerciseService.uploadExercise(this.selectedFile, this.exerciseName, this.exerciseInstructions, this.exerciseDuration, this.exerciseType).subscribe(() => {
        // Reset form fields after successful upload
        this.selectedFile = null;
        this.exerciseName = '';
        this.exerciseInstructions = '';
        this.exerciseDuration = 0;
        this.exerciseType = '';

        // Show success alert
        alert('Ajout avec succès');
        this.router.navigate(['/listexercises']);

      }, error => {
        // Handle error
        console.error('Une erreur s\'est produite lors de l\'ajout de l\'exercice : ', error);
        alert('Une erreur s\'est produite lors de l\'ajout de l\'exercice. Veuillez réessayer.');
        this.router.navigate(['/listexercises']); // Redirection même en cas d'erreur
      });
    } else {
      // Handle missing fields
      alert('Veuillez remplir tous les champs.');
      this.router.navigate(['/listexercises']); // Redirection même si des champs sont manquants
    }
  }
}
