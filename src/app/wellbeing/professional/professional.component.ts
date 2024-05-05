import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/user/users.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { User } from 'src/app/user/user';
import { ProfessionalService } from '../wservices/professional.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-professional',
  templateUrl: './professional.component.html',
  styleUrls: ['./professional.component.css']
})
export class ProfessionalComponent implements OnInit {

  psychologists: User[] = [];
  currentUser: any;
  proid!: number;
  actualuser: any;
  errorMessage !: string;
  actualuserid !: number;


  constructor(
    private professionalService: ProfessionalService,
    private userService: UsersService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPsychologists();
    this.actualuser = this.tokenStorageService.getUser();
    console.log('Actual User ID in ngOnInit:', this.actualuser ? this.actualuser.userId : 'No user found');
  }

  selectUser(userId: number) {
    this.proid = userId;
    console.log('Selected User ID:', this.proid);
  }

  unfollow(): void {
    if (this.proid !== undefined) {
      const currentUser = this.tokenStorageService.getUser();
      console.log('UserName:', currentUser.username);
      if (currentUser && currentUser.username) {
        this.userService.getUserIdByUsernames(currentUser.username).subscribe((customerId) => {
          console.log('Customer ID:', customerId);
          if (customerId) {
            this.professionalService.removePsychologistCustomerRelation(this.proid, customerId)
              .subscribe(
                () => {
                  console.log('Relation between psychologist and customer deleted successfully.');
                  // Update the display or perform other actions if necessary
                  location.reload(); // Reload the page
                },
                error => {
                  console.error('Failed to delete relation between psychologist and customer:', error);
                  this.errorMessage = 'Failed to delete relation between psychologist and customer.';
                  // Handle errors or display an error message to the user
                }
              );
          } else {
            this.errorMessage = 'Customer ID not found.';
            console.error(this.errorMessage);
          }
        }, (error) => {
          console.error('Error fetching customer ID by username:', error);
          this.errorMessage = 'Error fetching customer ID by username.';
        });
      } else {
        this.errorMessage = 'Current user or username not found.';
        console.error(this.errorMessage);
      }
    } else {
      this.errorMessage = 'No psychologist selected.';
      console.error(this.errorMessage);
    }
  }
  

  loadPsychologists(): void {
    const currentUser = this.tokenStorageService.getUser();
    console.log('UserName:', currentUser.username);
  
    if (currentUser && currentUser.username) {
      this.userService.getUserIdByUsernames(currentUser.username).subscribe((customerId) => { // Supprimer la spécification du type de paramètre
        console.log('Customer ID:', customerId);
  
        if (customerId) {
          this.userService.getAllPsychologistsForCustomer(customerId).subscribe((psychologists: User[]) => {
            console.log('Psychologists:', psychologists);
            this.psychologists = psychologists;
          }, (error) => {
            console.error('Error fetching psychologists:', error);
          });
        } else {
          console.error('Customer ID not found');
        }
      }, (error) => {
        console.error('Error fetching customer ID by username:', error);
      });
    } else {
      console.error('Current user or username not found');
    }
  }
  
  enlargedImage: string | null = null;

  // Fonction pour agrandir l'image
  enlargeImage(imageUrl: string) {
    this.enlargedImage = imageUrl;
  }

  // Fonction pour réduire l'image agrandie
  reduceImage() {
    this.enlargedImage = null;
  }

  redirectToCustomerExercises(userId: number): void {
    this.router.navigate(['/customerexercise', userId]);

  }

  }

