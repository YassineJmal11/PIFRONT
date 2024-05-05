import { Component, OnInit } from '@angular/core';
import { UsersService } from '../user/users.service';
import { User } from '../user/user';
import { TokenStorageService } from '../user/token-storage.service';
import { RatingserviceService } from './rating.service';
import { ProfessionalService } from '../wellbeing/wservices/professional.service';
import { ERole } from './Role';
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  coaches: User[] = [];
  nutritionists: User[] = [];
  psychologists: User[] = [];
  currentUser: any;
  ratingUserId!: number;
  ratedUserId!: number;
  RatedUserRole !: ERole;

  constructor(
    private userService: UsersService,
    private ratingService: RatingserviceService,
    private token: TokenStorageService,
    private professionalService : ProfessionalService,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.userService.getUserIdByUsername(this.currentUser.username).subscribe(
      (data) => {
        this.currentUser = data;
        this.ratingUserId = this.currentUser.userId;
        this.getCoaches();
        this.getNutritionists();
        this.getPsychologists();
      }
    );
  }

  followProfessional(professionalId: number, professionalRole: string) {
    const userId = this.currentUser.userId; // Récupérer l'ID de l'utilisateur connecté
    professionalId = this.ratedUserId;
    professionalRole=this.RatedUserRole;
    this.professionalService.isUserSubscribedToProfessionalRole(userId, professionalId, professionalRole)
      .subscribe(isSubscribed => {
        if (isSubscribed) {
          alert(`Vous êtes déjà abonné à un ${professionalRole}.`);
        } else {
          this.professionalService.assignPsychologistToCustomer(professionalId, userId)
            .subscribe(() => {
              // Gérer le succès de l'attribution du professionnel à l'utilisateur
              console.log('Professional assigned to customer successfully.');
            }, error => {
              // Gérer les erreurs
              console.error('Error assigning professional to customer:', error);
              alert('Une erreur est survenue lors de l\'attribution du professionnel. Veuillez réessayer.');
            });
        }
      });
  }

  getCoaches(): void {
    this.userService.getcoaches().subscribe(coaches => {
      this.coaches = coaches;
      this.getAverageRatingsForUsers(this.coaches);
    });
  }

  getNutritionists(): void {
    this.userService.getnutritionists().subscribe(nutritionists => {
      this.nutritionists = nutritionists;
      this.getAverageRatingsForUsers(this.nutritionists);
    });
  }

  getPsychologists(): void {
    this.userService.getpsychologists().subscribe(psychologists => {
      this.psychologists = psychologists;
      this.getAverageRatingsForUsers(this.psychologists);
    });
  }

  getAverageRatingsForUsers(users: User[]): void {
    users.forEach(user => {
      this.ratingService.getAverageRatingForUser(user.userId).subscribe(
        averageRating => {
          user.averageRating = averageRating; // Ajouter la propriété averageRating à l'utilisateur
        },
        error => {
          console.error(error);
        }
      );
    });
  }

  createRating(ratedUserId: number, ratingValue: number) {
    this.ratingService.createRating(ratedUserId, this.ratingUserId, ratingValue).subscribe(data => {
      console.log(data); // Afficher les données retournées
      // Rafraîchir les notes moyennes après avoir ajouté une nouvelle notation
      this.getCoaches();
      this.getNutritionists();
      this.getPsychologists();
    }, error => {
      console.error(error); // Afficher les erreurs s'il y en a
    });
  }

  selectUser(userId: number) {
    this.ratedUserId = userId;
    console.log(this.ratedUserId)
    // Appeler getUserRole pour récupérer le rôle à partir de userId
    this.userService.getUserRoleById(userId).subscribe(
      role => {
        console.log('Rôle de l\'utilisateur sélectionné:', role);
        this.RatedUserRole = role as ERole;       },
      error => {
        console.error('Erreur lors de la récupération du rôle de l\'utilisateur:', error);
      }
    );
  }

  rateChange(userId: number, ratingValue: number) {
    this.createRating(userId, ratingValue);
  }
}