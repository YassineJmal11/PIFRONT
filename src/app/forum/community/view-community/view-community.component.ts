import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user/user';
import { CommunityServiceService } from '../services/community-service.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Community } from '../../model/Community';
import { Post } from '../../model/Post';
import { PostServiceService } from '../services/post-service.service';

@Component({
  selector: 'app-view-community',
  templateUrl: './view-community.component.html',
  styleUrls: ['./view-community.component.css']
})
export class ViewCommunityComponent implements OnInit {
  community!: any;
  posts: Post[] = [];
  currentUser!: User;
  userId: number = 1;
  communityId!: number;
  isInCommunity!: boolean;
  timeSinceCreation!: string;
  sortOrder: 'newest' | 'oldest' = 'newest'; // Default sort order is 'newest'

  constructor(
    private cs: CommunityServiceService,
    private ps: PostServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private router: Router,
    private act: ActivatedRoute
  ) {}

  ngOnInit() {
    this.act.params.subscribe(params => {
      this.communityId = params['id'];
      this.fetchCommunity();
    });
  }

  fetchCommunity() {
    this.cs.getByCommunityId(this.communityId).subscribe({
      next: (data) => {
        this.community = data;
        this.checkIfUserInCommunity();
        this.fetchPosts();
      },
      error: (error) => console.log(error),
      complete: () => console.log('Community fetched successfully')
    });
  }

  fetchPosts() {
    this.ps.findByCommunityCommunityId(this.communityId).subscribe({
      next: (data) => {
        this.posts = data.map(post => {
          return {
            ...post,
            timeSinceCreation: this.calculateTimeSinceCreation(post.createdAt) // Calculate time since post creation
          };
        });

        // Sort posts based on the selected sort order
        if (this.sortOrder === 'newest') {
          this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else {
          this.posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
      },
      error: (error) => console.log(error),
      complete: () => console.log('Posts fetched successfully')
    });
  }

  calculateTimeSinceCreation(createdAt: Date) {
    const now = new Date();
    const diff = Math.abs(now.getTime() - new Date(createdAt).getTime());
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      this.timeSinceCreation= `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      this.timeSinceCreation= `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      this.timeSinceCreation= `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      this.timeSinceCreation= 'just now';
    }
  }
  

  checkIfUserInCommunity() {
    if (this.community && this.community.members) {
      for (const member of this.community.members) {
        if (member.userId === this.userId) {
          this.isInCommunity = true;
          return;
        }
      }
    }
    this.isInCommunity = false;
  }

  joinCommunity() {
    if (this.userId) {
      this.cs.addUserToCommunity(this.communityId, this.userId).subscribe({
        next: (response) => {
          this.community = response;
          this.isInCommunity = true;
        },
        error: (error) => console.log(error),
        complete: () => console.log('User joined community successfully')
      });
    }
  }

  createPost() {
    this.router.navigate(['/addPost'], {
      queryParams: {
        id: this.communityId
      }
    });
  }

  // Method to handle sort order change
  onSortOrderChange() {
    // Re-fetch posts to apply sorting
    this.fetchPosts();
  }
}
