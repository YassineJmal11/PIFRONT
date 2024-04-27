import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  loginAttempts = 0; // Ajouter un compteur pour les tentatives de connexion

  constructor(
    private authService: AuthService, 
    private tokenStorage: TokenStorageService,
    private router: Router,
    private usersservice:UsersService
      
    
  ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.signin(username, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;

        // Rediriger vers les routes spécifiques en fonction du rôle
        if (this.roles.includes('ADMIN')) {
          this.router.navigate(['/homeadmin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.loginAttempts++; // Incrémenter le compteur de tentatives de connexion
        if (this.loginAttempts >= 3) {
          this.banAccount(username); // Si trois tentatives de connexion infructueuses, bannir le compte
        }
      }
    );
  }
  banMessage: string = '';

  banAccount(username: string): void {
    this.usersservice.banUser(username).subscribe(
      () => {
        this.banMessage = 'Votre compte a été banni.';
        console.log('Compte banni :', username);
        // Vous pouvez ajouter ici une logique pour informer l'utilisateur que son compte est banni
      },
      error => {
        console.error('Erreur lors du bannissement du compte:', error);
        // Gérer les erreurs de bannissement du compte ici
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }
}
