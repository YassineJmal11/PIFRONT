import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from 'src/app/user/user';
import { CommunityServiceService } from '../services/community-service.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Community } from '../../model/Community';
import { Post } from '../../model/Post';
import { PostServiceService } from '../services/post-service.service';
import { VoteServiceService } from '../services/vote-service.service';
import { VoteType } from '../../model/VoteType';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-view-community',
  templateUrl: './view-community.component.html',
  styleUrls: ['./view-community.component.css']
})
export class ViewCommunityComponent implements OnInit {
  community!: any;
  posts: Post[] = [];
  currentUser!: User;
  userId!: number;
  communityId!: number;
  isInCommunity!: boolean;
  sortOrder: 'newest' | 'oldest' | 'mostUpvoted' = 'newest'; // Add 'mostUpvoted' option
  

  constructor(
    private cs: CommunityServiceService,
    private ps: PostServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private router: Router,
    private act: ActivatedRoute,
    private vs: VoteServiceService ,
    private cdr: ChangeDetectorRef ,
    private userService: UsersService

  ) {}

  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.userService.getUserIdByUsername(this.currentUser.username).subscribe(
      (data) => {
        this.currentUser = data;
        this.userId = this.currentUser.userId; 
        console.log( this.currentUser)
        this.act.params.subscribe(params => {
          this.communityId = params['id'];
          this.fetchCommunity();
        });
        
      }
    );
    
    
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
            timeSinceCreation: this.calculateTimeSinceCreation(post.createdAt),
            upvoteCount: 0,
            downvoteCount: 0,
            totalVotes: 0 // Add a property to store total votes
          };
        });
  
        // Track the number of vote count fetch operations
        let voteCountFetchOperations = 0;
  
        // Fetch upvote and downvote counts for each post
        this.posts.forEach(post => {
          this.vs.findByPostIdAndVoteTypeUpvote(post.postId).subscribe(upvotes => {
            post.upvoteCount = upvotes.length;
            post.totalVotes += upvotes.length; // Add upvotes to total votes count
            // Increment the count of vote count fetch operations
            voteCountFetchOperations++;
  
            // Once all vote count fetch operations are completed, sort the posts
            if (voteCountFetchOperations === 2 * this.posts.length) {
              this.sortPosts();
            }
          });
  
          this.vs.findByPostPostIdAndVoteTypeDownvote(post.postId).subscribe(downvotes => {
            post.downvoteCount = downvotes.length;
            post.totalVotes -= downvotes.length; // Subtract downvotes from total votes count
            // Increment the count of vote count fetch operations
            voteCountFetchOperations++;
  
            // Once all vote count fetch operations are completed, sort the posts
            if (voteCountFetchOperations === 2 * this.posts.length) {
              this.sortPosts();
            }
          });
  
          this.vs.findByPostIdAndUserId(post.postId, this.userId).subscribe(vote => {
            if (vote.voteType.match(VoteType.Type1)) {
              post.upvoted = true;
              post.downvoted = false;
            }
  
            if (vote.voteType.match(VoteType.Type2)) {
              post.upvoted = false;
              post.downvoted = true;
            }
          });
        });
      },
      error: (error) => console.log(error),
      complete: () => console.log('Posts fetched successfully')
    });
  }
  
  // Helper method to sort posts based on the selected sort order
  sortPosts() {
    if (this.sortOrder === 'newest') {
      this.posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.sortOrder === 'oldest') {
      this.posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (this.sortOrder === 'mostUpvoted') {
      this.posts.sort((a, b) => b.totalVotes - a.totalVotes);
    }
  }
  
  calculateTimeSinceCreation(createdAt: Date) {
    const now = new Date();
    const diff = Math.abs(now.getTime() - new Date(createdAt).getTime());
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'just now';
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



  upvote(post: Post) {
    // Call the service method to fetch the user's vote for this post
    this.vs.findByPostIdAndUserId(post.postId, this.userId).subscribe({
      next: (existingVote) => {
        if (existingVote) {
          // User already voted
          if (existingVote.voteType === VoteType.Type1) {
            // User upvoted again, delete the vote
            this.deleteVoteAndUpdate(post);
          } else {
            // User downvoted or voted differently, update to upvote
            this.createOrUpdateVote(post, VoteType.Type1);
          }
        } else {
          // User hasn't voted, add an upvote
          this.createOrUpdateVote(post, VoteType.Type1);
        }
      },
      error: (error) => console.log(error),
      complete: () => console.log('Fetch vote completed')
    });
  }
  
  
  downvote(post: Post) {
    // Call the service method to fetch the user's vote for this post
    this.vs.findByPostIdAndUserId(post.postId, this.userId).subscribe({
      next: (existingVote) => {
        if (existingVote) {
          // User already voted
          if (existingVote.voteType === VoteType.Type2) {
            // User downvoted again, delete the vote
            this.deleteVoteAndUpdate(post);
          } else {
            // User upvoted or voted differently, update to downvote
            this.createOrUpdateVote(post, VoteType.Type2);
          }
        } else {
          // User hasn't voted, add a downvote
          this.createOrUpdateVote(post, VoteType.Type2);
        }
      },
      error: (error) => console.log(error),
      complete: () => console.log('Fetch vote completed')
    });
  }
  

  deleteVoteAndUpdate(post: Post) {
    this.vs.deleteVoteByUserAndPost(post.postId, this.userId).subscribe(() => {
      console.log('Vote deleted successfully');
      // Update the post after deleting the vote
      this.fetchPosts();
    });
  }


  createOrUpdateVote(post: Post, voteType: VoteType) {
    console.log('Existing Vote:', post.votes);


    const existingVote = post.votes.find(vote => vote.user.userId === this.userId);
    console.log('Existing Vote for User:', existingVote);
  
    if (existingVote) {
      // If the user already voted on the post, update the existing vote
    //  existingVote.voteType = voteType;
      //this.vs.updateVote(existingVote).subscribe(() => {
        console.log('Vote updated successfully');
        // Update the post after voting
        this.fetchPosts();
        // Trigger change detection
        this.cdr.detectChanges();
     // });
    } else {
      // If the user hasn't voted on the post yet, create a new vote
      const vote: any = {
        voteType: voteType
      };
      this.vs.createOrUpdateVote(vote, post.postId, this.userId).subscribe(() => {
        console.log('Vote created successfully');
        // Update the post after voting
        this.fetchPosts();
        // Trigger change detection
        this.cdr.detectChanges();
      });
    }
  }

  speak(post:Post ) {
    // Check if speech synthesis is supported

    const text=post.user.firstName+'posted'+post.postType+post.textContent+"in the community"+post.community.communityName+
    this.calculateTimeSinceCreation(post.createdAt)
    console.log(text)
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = text;
      window.speechSynthesis.speak(speech);
    } else {
      console.error('Speech synthesis not supported');
    }
  }
  
}
