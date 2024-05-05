import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RelaxationExercise } from '../../model/RelaxationExercise';
import { RelaxationExerciseServiceService } from '../../wservices/relaxation-exercise-service.service';

@Component({
  selector: 'app-relaxation-exercise-update',
  templateUrl: './relaxation-exercise-update.component.html',
  styleUrls: ['./relaxation-exercise-update.component.css']
})
export class RelaxationExerciseUpdateComponent implements OnInit {
  exercise!: RelaxationExercise;
  selectedFile: File | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private relaxationExerciseService: RelaxationExerciseServiceService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    this.relaxationExerciseService.getExerciseById(id).subscribe(exercise => {
      this.exercise = exercise;
    });
  }

  updateExercise(): void {
    this.relaxationExerciseService.updateExercise(this.exercise).subscribe(
      () => {
        // Redirection vers la liste des exercices après une tentative de mise à jour
        this.router.navigate(['/PsyCustomers']);
      },
      error => {
        // Gestion des erreurs
        // Redirection vers la liste des exercices en cas d'erreur
        this.router.navigate(['/PsyCustomers']);
      }
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  getVideoUrl(): string {
    if (this.selectedFile) {
      return URL.createObjectURL(this.selectedFile);
    }
    return ''; // Retourne une chaîne vide si aucun fichier n'est sélectionné
  }
}
