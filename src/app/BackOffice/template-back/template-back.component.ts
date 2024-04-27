import { Component } from '@angular/core';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-template-back',
  templateUrl: './template-back.component.html',
  styleUrls: ['./template-back.component.css']
})
export class TemplateBackComponent {
  constructor( private route:Router,private tokenStorageService:TokenStorageService) {}
  
  //Sidebar toggle show hide function
  status = false;
  addToggle()
  {
    this.status = !this.status;       
  }
  logout(): void {
    this.tokenStorageService.signOut(); // Utilisez tokenStorageService pour la déconnexion
    this.route.navigate(['/signin']); // Utilisez route pour la navigation
  }
  }

