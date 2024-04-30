import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';
import { CommunityServiceService } from '../services/community-service.service';
import { PostServiceService } from '../services/post-service.service';
import { VoteServiceService } from '../services/vote-service.service';
import { Post } from '../../model/Post';
import { VoteType } from '../../model/VoteType';
import { CommentServiceService } from '../services/comment-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import { Comment } from '../../model/Comment';
import { CommentLikeServiceService } from '../services/comment-like-service.service';
import BadWords from 'bad-words'; 


@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  postId: any;
  post!: Post;
  timeSinceCreation!: string;
  userId!: number;
  showReplyInput: boolean = false;
  comments: any[] = []; 
  showReplyInputForCommentId: number | null = null;
  currentUser!:any;
  profanityFilter = new BadWords(); 



  constructor(
    private cs: CommunityServiceService,
    private ps: PostServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private router: Router,
    private act: ActivatedRoute,
    private vs: VoteServiceService,
    private cdr: ChangeDetectorRef,
    private commentService: CommentServiceService ,
    private commentLikeService: CommentLikeServiceService ,
    private userService: UsersService


  ) {}

  commentForm = new FormGroup({
    content: new FormControl('', [Validators.required]),
  });

  replyForm = new FormGroup({
    content: new FormControl('', [Validators.required])
  });


  
  toggleReplyInput(commentId: number) {
    if (this.showReplyInputForCommentId === commentId) {
      this.showReplyInputForCommentId = null; // Hide reply input if already shown
    } else {
      this.showReplyInputForCommentId = commentId; // Show reply input for the clicked comment
    }
  }
  
  createComment() {
    let sanitizedContent :string="" ;
    if (this.commentForm.valid) {
       sanitizedContent = this.replaceBadWords(this.commentForm.value.content); 

      if (this.containsProfanity(this.commentForm.value.content)) {
        console.log("bad words detected")
        this.usersService.updateUserBadWordsCount(this.userId).subscribe(
          (action:number) => {
            if(action===1){
              console.log("yetbana")
              this.token.signOut();
              this.router.navigate(['/home']);
            }
            console.log('Bad words count updated successfully');
            // Do something after successful update
           // this.submitPost(sanitizedTextContent);
          },
        );
      } else {
        //this.submitPost(sanitizedTextContent);
      }
    } else {
      console.log('Form is invalid');
    }
      
        const comment: Comment = {
          commentId: 0,
          content: sanitizedContent,
          user: this.currentUser,
          createdAt: new Date(),
          updatedAt: new Date(),
          post:this.post,
          replies:[],
          reply:false,
          commentLikes:[],
          commentLikesCount:0,
          liked:false

        };
        this.commentService.createComment(comment, this.userId, this.postId).subscribe(() => {

       
        this.fetchPostAndComments();
        this.commentForm.reset(); // Reset the comment form
      });
    } 

   

    createReply(comment: any) {
      let sanitizedContent :string="" ;

    
      if (this.replyForm.valid && comment !== null) {
         sanitizedContent = this.replaceBadWords(this.replyForm.value.content); 
         if (this.containsProfanity(this.replyForm.value.content)) {
          console.log("bad words detected")
          this.usersService.updateUserBadWordsCount(this.userId).subscribe(
            (action:number) => { 
              if(action===1){
              console.log("yetbana")
              this.token.signOut();
              this.router.navigate(['/home']);
            }
            
              console.log('Bad words count updated successfully');
            },

          );
        }

        const reply: Comment = {
          commentId: 0,
          content: sanitizedContent,
          user: this.currentUser,
          createdAt: new Date(),
          updatedAt: new Date(),
          post:this.post,
          replies:[],
          reply:true,
          commentLikes:[],
          commentLikesCount:0,
          liked:false

        };

        this.commentService.createReply(comment.commentId, this.userId, reply).subscribe(() => {
          this.fetchPostAndComments();
          this.replyForm.reset();
          this.showReplyInputForCommentId = null; // Reset to hide reply input
        });
      } else {
        console.error('Selected comment is null or reply form is invalid.');
      }
    }
    
  
    cancelReply() {
     
      this.showReplyInput = false;
      this.replyForm.reset();
    }

  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.userService.getUserIdByUsername(this.currentUser.username).subscribe(
      (data) => {
        this.currentUser = data;
        this.userId = this.currentUser.userId; 
        console.log( this.currentUser)

        this.act.params.subscribe(params => {
          this.postId = params['id'];
          this.fetchPostAndComments();
        });
        
      }
    );



   
  }

  deletePost(postId:number): void {
    this.ps.deletePost(postId)
      .subscribe(() => {
        console.log('Post deleted successfully');
        this.router.navigate(['/feed']);
        
      }, error => {
        console.error('Error deleting post:', error);

      });
  }

  deleteComment(commentId:number): void {
    this.commentService.deleteComment(commentId)
      .subscribe(() => {
        console.log('comment deleted successfully');
        this.fetchPostAndComments();
        
      }, error => {
        console.error('Error deleting comment:', error);

      });
  }

  

  fetchPostAndComments() {
    // Fetch the post details
    this.ps.getPostById(this.postId).subscribe({
      next: (post) => {
        this.post = post;
        this.timeSinceCreation=this.calculateTimeSinceCreation(this.post.createdAt);
        this.fetchVotes();
        this.fetchCommentsForPost();
      },
      error: (error) => console.log(error),
      complete: () => console.log('Post fetched successfully')
    });
  }

  fetchCommentsForPost() {
    // Fetch comments for the post
    this.commentService.getCommentsByPostId(this.postId).subscribe({
        next: (comments) => {
            this.comments = comments;
            // Iterate through each comment to fetch the comment likes count and user's like status
            this.comments.forEach((comment) => {

              console.log(comment.replies.length)
                // Fetch comment likes count
                this.commentLikeService.findByComment_CommentId(comment.commentId).subscribe((commentLikes) => {
                    comment.commentLikesCount = commentLikes.length;
                });

                // Check if the current user has liked the comment
                this.commentLikeService.findByUserUserIdAndComment_CommentId(this.userId, comment.commentId).subscribe((userLike) => {
                    
                  console.log('User like for comment', comment.commentId, 'is:', userLike);
                  if (userLike) {
                        comment.liked = true;
                        console.log("comment liked")
                    } else {
                        comment.liked = false;
                        console.log("comment is not liked")
                    }

                    // Iterate through each reply to fetch the likes count and user's like status
                    comment.replies.forEach((reply: any) => {
                        // Fetch reply likes count
                        this.commentLikeService.findByComment_CommentId(reply.commentId).subscribe((replyLikes) => {
                            reply.commentLikesCount = replyLikes.length;
                        });

                        // Check if the current user has liked the reply
                        this.commentLikeService.findByUserUserIdAndComment_CommentId(this.userId, reply.commentId).subscribe((userLike) => {
                            
                          console.log('User like for comment', reply.commentId, 'is:', userLike);
                          if (userLike) {
                                reply.liked = true;
                                console.log("reply liked")
                            } else {
                                reply.liked = false;
                                console.log("reply is not liked")
                            }
                        });
                    });
                });
            });
            // After updating comment and reply objects, trigger change detection manually
            this.cdr.detectChanges();
        },
        error: (error) => console.log(error),
        complete: () => console.log('Comments fetched successfully')
    });
}






  fetchVotes() {
    // Fetch upvote count
    this.vs.findByPostIdAndVoteTypeUpvote(this.post.postId).subscribe(upvotes => {
      this.post.upvoteCount = upvotes.length;
    });

    // Fetch downvote count
    this.vs.findByPostPostIdAndVoteTypeDownvote(this.post.postId).subscribe(downvotes => {
      this.post.downvoteCount = downvotes.length;
    });

    // Fetch user's vote
    this.vs.findByPostIdAndUserId(this.post.postId, this.userId).subscribe(vote => {
      if (vote) {
        if (vote.voteType === VoteType.Type1) {
          this.post.upvoted = true;
        } else if (vote.voteType === VoteType.Type2) {
          this.post.downvoted = true;
        }
      }
    });
  }


  replaceBadWords(text: any): string {
    return this.profanityFilter.clean(text); // Replace bad words with asterisks
  }

  containsProfanity(text: any): boolean {
    const isProfane = this.profanityFilter.isProfane(text);
    console.log('Text:', text);
    console.log('Is Profane:', isProfane);
    return isProfane;
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
      this.fetchPostAndComments();
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
        this.fetchPostAndComments();
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
        this.fetchPostAndComments();
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

  toggleCommentLike(commentId: number) {
    // Assuming you have a method in the service to toggle the like
    this.commentLikeService.createOrUpdateCommentLikeAndSetUserAndComment(commentId,this.userId).subscribe(() => {
      // Update the UI after successful toggle
      const commentIndex = this.comments.findIndex(comment => comment.commentId === commentId);
      if (commentIndex !== -1) {
        this.comments[commentIndex].liked = !this.comments[commentIndex].liked;
      }
      this.fetchPostAndComments();
    });
  }
  
}
