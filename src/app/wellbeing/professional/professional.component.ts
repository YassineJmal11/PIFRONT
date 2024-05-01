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

  constructor(
    private professionalService: ProfessionalService,
    private userService: UsersService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPsychologists();
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

