import { Component } from '@angular/core';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      const roles = user.roles;
      this.showAdminBoard = roles.includes('ADMIN');
      this.showModeratorBoard = roles.includes('CUSTOMER') || roles.includes('NUTRITIONIST') || 
                                roles.includes('PSYCHOLOGIST') || roles.includes('COACH');
      this.username = user.username;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/home']); // Redirige vers la page d'accueil après la déconnexion
  }
}

