import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';
import { AccountStatus } from '../AccountStatus';
import { TokenStorageService } from '../token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alluser',
  templateUrl: './alluser.component.html',
  styleUrls: ['./alluser.component.css']
})
export class AlluserComponent implements OnInit {
  users: User[] = [];
  selectedStatus: AccountStatus = AccountStatus.ACTIVE;

  constructor(private userService: UsersService,private route:Router,private tokenStorageService:TokenStorageService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  
   
  logout(): void {
    this.tokenStorageService.signOut(); // Utilisez tokenStorageService pour la déconnexion
    this.route.navigate(['/signin']); // Utilisez route pour la navigation
  }
  
  updateUserAccountStatus(userId: number, accountStatus: AccountStatus): void {
    this.userService.updateUserAccountStatus(userId, accountStatus).subscribe(
      () => {
        console.log(`User account status updated successfully`);
        // Mettez à jour la liste des utilisateurs après la mise à jour du statut du compte
        this.getAllUsers();
      },
      (error) => {
        console.error('Error updating user account status:', error);
      }
    );
  }
  status = false;
  addToggle()
  {
    this.status = !this.status;       
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        console.log(`User with ID ${userId} deleted successfully.`);
        // Rechargez la liste des utilisateurs après la suppression
        this.getAllUsers();
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }
}
