import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Community } from '../../model/Community';
import { CommunityServiceService } from '../services/community-service.service';
import { UsersService } from 'src/app/user/users.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { Router } from '@angular/router';
import { User } from 'src/app/user/user';
import { PostServiceService } from '../services/post-service.service';
import { Post } from '../../model/Post';
import { Vote } from '../../model/Vote';
import { VoteServiceService } from '../services/vote-service.service';
import { VoteType } from '../../model/VoteType';
import { map, Observable } from 'rxjs';
import { CommentServiceService } from '../services/comment-service.service';
import annyang from 'annyang';


@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent  {
  joinedCommunities: any;
  createdCommunities: any;
  popularCommunities: any;
  currentUser!: User;
  userId!:number;
  showConfirmation: boolean[] = [];
  posts: Post[] = [];
  popularPosts: Post[] = [];
  timeSinceCreation!: string;
  upVote = VoteType.Type1;
  downVote = VoteType.Type2;
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number =5; 
  searchText: string = '';
  searchSuggestions: string[] = [];

  constructor(
    private cs: CommunityServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private router : Router,
    private ps : PostServiceService,
    private vs: VoteServiceService ,
    private cdr: ChangeDetectorRef ,
    private userService: UsersService,
    private commentService:CommentServiceService

  ) {}

  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.userService.getUserIdByUsername(this.currentUser.username).subscribe(
      (data) => {
        this.currentUser = data;
        this.userId = this.currentUser.userId; 
        console.log( this.currentUser)
        this.fetchCommunities();
        this.fetchPosts();
        this.fetchPopularPosts();
        
      }
    );
    
  }

  getSearchSuggestions() {
    if (this.searchText.trim() !== '') {
      this.ps.getSearchSuggestions(this.searchText).subscribe({
        next: (data) => {
          this.searchSuggestions = data;
        },
        error: (error) => console.log(error)
      });
    } else {
      this.searchSuggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchText = suggestion;
    this.searchSuggestions = []; // Clear suggestions after selecting
    this.search(); // Perform search based on the selected suggestion
  }


  // Inside your component class
  startVoiceRecognition() {
    if (annyang) {
      const commands = {
        'search *query': (query: string) => {
          this.searchText = query;
          this.search();
        },
        'stop listening': () => {
          (<any>annyang).abort(); // Stop annyang from listening
        }
      };
  
      (<any>annyang).addCommands(commands);
      (<any>annyang).start();
    } else {
      console.error('Annyang not supported');
    }
  }
  



  search() {
    // Clear existing posts
    this.posts = [];
    
    // Fetch posts based on search text
    this.ps.findByTextContentContaining(this.searchText).subscribe({
      next: (data) => {
        const newPosts: Post[] = data.map(post => {
          return {
            ...post,
            timeSinceCreation: this.calculateTimeSinceCreation(post.createdAt),
            upvoteCount: 0,
            downvoteCount: 0,
            totalVotes: 0,
            comments: [] // Initialize an empty array for comments
          };
        });
        this.posts = newPosts;
      //  this.posts = this.posts.concat(newPosts);

        // Track the number of vote count fetch operations
        let voteCountFetchOperations = 0;

        // Fetch upvote and downvote counts for each new post
        this.posts.slice(-5).forEach(post => { // Fetch only the last 5 posts
            this.vs.findByPostIdAndVoteTypeUpvote(post.postId).subscribe(upvotes => {
                post.upvoteCount = upvotes.length;
                post.totalVotes += upvotes.length; // Add upvotes to total votes count
                // Increment the count of vote count fetch operations
                voteCountFetchOperations++;
            });

            this.vs.findByPostPostIdAndVoteTypeDownvote(post.postId).subscribe(downvotes => {
                post.downvoteCount = downvotes.length;
                post.totalVotes -= downvotes.length; // Subtract downvotes from total votes count
                // Increment the count of vote count fetch operations
                voteCountFetchOperations++;
            });

            this.vs.findByPostIdAndUserId(post.postId, this.userId).subscribe(vote => {
                if (vote.voteType.match(VoteType.Type1)) {
                    post.upvoted = true;
                    post.downvoted = false;
                } else if (vote.voteType.match(VoteType.Type2)) {
                    post.upvoted = false;
                    post.downvoted = true;
                } else {
                    post.upvoted = false;
                    post.downvoted = false;
                }
            });

            // Fetch comments for each post
            this.commentService.getCommentsByPostId(post.postId).subscribe(comments => {
                post.comments = comments; 
               
            });
        });
    },
      error: (error) => console.log(error),
      complete: () => console.log('Search completed')
    });

    
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
  
  fetchPopularPosts() {
    this.ps.findTop50ByOrderByVotesDesc(this.currentPage, this.pageSize).subscribe({
        next: (data) => {
            const newPosts = data.content.map(post => {
                return {
                    ...post,
                    timeSinceCreation: this.calculateTimeSinceCreation(post.createdAt),
                    upvoteCount: 0,
                    downvoteCount: 0,
                    totalVotes: 0,
                    comments: [] // Initialize an empty array for comments
                };
            });

            // Append new posts to the existing array
            this.popularPosts = this.popularPosts.concat(newPosts);

            // Track the number of vote count fetch operations
            let voteCountFetchOperations = 0;

            // Fetch upvote and downvote counts for each new post
            this.popularPosts.slice(-5).forEach(post => { // Fetch only the last 5 posts
                this.vs.findByPostIdAndVoteTypeUpvote(post.postId).subscribe(upvotes => {
                    post.upvoteCount = upvotes.length;
                    post.totalVotes += upvotes.length; // Add upvotes to total votes count
                    // Increment the count of vote count fetch operations
                    voteCountFetchOperations++;
                });

                this.vs.findByPostPostIdAndVoteTypeDownvote(post.postId).subscribe(downvotes => {
                    post.downvoteCount = downvotes.length;
                    post.totalVotes -= downvotes.length; // Subtract downvotes from total votes count
                    // Increment the count of vote count fetch operations
                    voteCountFetchOperations++;
                });

                this.vs.findByPostIdAndUserId(post.postId, this.userId).subscribe(vote => {
                    if (vote.voteType.match(VoteType.Type1)) {
                        post.upvoted = true;
                        post.downvoted = false;
                    } else if (vote.voteType.match(VoteType.Type2)) {
                        post.upvoted = false;
                        post.downvoted = true;
                    } else {
                        post.upvoted = false;
                        post.downvoted = false;
                    }
                });

                // Fetch comments for each post
                this.commentService.getCommentsByPostId(post.postId).subscribe(comments => {
                    post.comments = comments; 
                   
                });
            });
        },
        error: (error) => console.log(error),
        complete: () => {
            this.loading = false;
            console.log('Posts fetched successfully');
        }
    });
}

  fetchPosts() {
    this.ps.findByUserJoinedCommunitiesPaginated(this.userId, this.currentPage, this.pageSize).subscribe({
        next: (data) => {
            const newPosts = data.content.map(post => {
                return {
                    ...post,
                    timeSinceCreation: this.calculateTimeSinceCreation(post.createdAt),
                    upvoteCount: 0,
                    downvoteCount: 0,
                    totalVotes: 0,
                    comments: [] // Initialize an empty array for comments
                };
            });

            // Append new posts to the existing array
            this.posts = this.posts.concat(newPosts);

            // Track the number of vote count fetch operations
            let voteCountFetchOperations = 0;

            // Fetch upvote and downvote counts for each new post
            this.posts.slice(-5).forEach(post => { // Fetch only the last 5 posts
                this.vs.findByPostIdAndVoteTypeUpvote(post.postId).subscribe(upvotes => {
                    post.upvoteCount = upvotes.length;
                    post.totalVotes += upvotes.length; // Add upvotes to total votes count
                    // Increment the count of vote count fetch operations
                    voteCountFetchOperations++;
                });

                this.vs.findByPostPostIdAndVoteTypeDownvote(post.postId).subscribe(downvotes => {
                    post.downvoteCount = downvotes.length;
                    post.totalVotes -= downvotes.length; // Subtract downvotes from total votes count
                    // Increment the count of vote count fetch operations
                    voteCountFetchOperations++;
                });

                this.vs.findByPostIdAndUserId(post.postId, this.userId).subscribe(vote => {
                    if (vote.voteType.match(VoteType.Type1)) {
                        post.upvoted = true;
                        post.downvoted = false;
                    } else if (vote.voteType.match(VoteType.Type2)) {
                        post.upvoted = false;
                        post.downvoted = true;
                    } else {
                        post.upvoted = false;
                        post.downvoted = false;
                    }
                });

                // Fetch comments for each post
                this.commentService.getCommentsByPostId(post.postId).subscribe(comments => {
                    post.comments = comments; 
                   
                });
            });
        },
        error: (error) => console.log(error),
        complete: () => {
            this.loading = false;
            console.log('Posts fetched successfully');
        }
    });
}

  

onScrollDown() {
  // Increment the current page and fetch more posts
  this.currentPage++;
  this.fetchPosts();
}

onScroll() {
  // Detect when user has scrolled to the bottom of the page
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.onScrollDown();
  }
}


  
  // Helper method to sort posts based on the selected sort order

  
  
  


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

    this.cs.getCommunitiesOrderByMembers().subscribe({
      next: (data) => this.popularCommunities = data,
      error: (error) => console.log(error),
      complete: () => console.log('created communities fetched successfully')
    });
  }

  toggleConfirmation(index: number) {
    this.showConfirmation[index] = !this.showConfirmation[index];
  }

  delete(communityId: number) {
    this.cs.deleteCommunity(communityId).subscribe(() => {
      console.log('Community deleted successfully');
      this.fetchCommunities();
    });
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
            post.upvoted=false
            post.downvoted=false
            post.upvoteCount--;
          } else {
            // User downvoted or voted differently, update to upvote
            this.createOrUpdateVote(post, VoteType.Type1);
            post.upvoted=true
            post.downvoted=false
            post.upvoteCount++;
            post.downvoteCount--
          }
        } else {
          // User hasn't voted, add an upvote
          this.createOrUpdateVote(post, VoteType.Type1);
          post.upvoted=true
          post.upvoteCount++
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
            post.downvoted=false
            post.upvoted=false
            post.downvoteCount--;
          } else {
            // User upvoted or voted differently, update to downvote
            this.createOrUpdateVote(post, VoteType.Type2);

            post.upvoted=false
            post.downvoted=true
            post.upvoteCount--
            post.downvoteCount++
          }
        } else {
          // User hasn't voted, add a downvote
          this.createOrUpdateVote(post, VoteType.Type2);
          post.downvoted=true
          post.downvoteCount++;
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
     // this.fetchPosts();
      // Trigger change detection to update the view
      this.cdr.detectChanges();
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
      //  this.fetchPosts();
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
      //  this.fetchPosts();
        // Trigger change detection
        this.cdr.detectChanges();
      });
    }
  }
  
  
  

  deleteVote(post: Post) {
    
      this.vs.deleteVoteByUserAndPost(post.postId,this.userId).subscribe(() => {
        console.log('Vote deleted successfully');
        // Update the post after deleting the vote
        this.fetchPosts();
       
      });
    
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
