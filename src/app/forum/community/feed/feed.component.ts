import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Community } from '../../model/Community';
import { CommunityServiceService } from '../services/community-service.service';
import { UsersService } from 'src/app/user/users.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { Router } from '@angular/router';
import { User } from 'src/app/user/user';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent  {
  joinedCommunities: any;
  createdCommunities: any;
  currentUser!: User;
  userId:number=1;
  showConfirmation: boolean[] = [];



  constructor(
    private cs: CommunityServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private router : Router
  ) {}


  ngOnInit() {
    this.currentUser = this.token.getUser();
   // this.userId=this.currentUser.id;

   this.fetchCommunities()
  }

  fetchCommunities() {
    this.cs.getJoinedByUserId(this.userId).subscribe({
      next: (data) => this.joinedCommunities = data,
      error: (error) => console.log(error),
      complete: () => console.log('joined communities fetched successfully')
    });

    this.cs.getByCreatorId(this.userId).subscribe({
      next: (data) => this.createdCommunities = data,
      error: (error) => console.log(error),
      complete: () => console.log('created communities fetched successfully')
    });
  }

  toggleConfirmation(index: number) {
    // Toggle the value of showConfirmation at the specified index
    this.showConfirmation[index] = !this.showConfirmation[index];
  }

  delete(communityId: number) {

    this.cs.deleteCommunity(communityId).subscribe(() => {
      console.log('Community deleted successfully');
      // Refresh communities after deletion
      this.fetchCommunities();
    });
  }



 



  
}
