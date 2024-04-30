import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from 'src/app/user/user';
import { CommunityServiceService } from '../../services/community-service.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostServiceService } from '../../services/post-service.service';
import { Post } from 'src/app/forum/model/Post';
import { PostType } from 'src/app/forum/model/PostType';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { catchError, throwError } from 'rxjs';
import BadWords from 'bad-words';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  joinedCommunities: any[] = [];
  currentUser!: User;
  userId!: number;
  postForm!: FormGroup;
  attachments: any;
  selectedCommunity: any = {}; // Initialize with an empty object
  postTypes = Object.values(PostType);
  profanityError: boolean = false;
  profanityFilter = new BadWords();

  constructor(
    private cs: CommunityServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private router: Router,
    private postService: PostServiceService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.usersService.getUserIdByUsername(this.currentUser.username).subscribe(
      (data) => {
        this.currentUser = data;
        this.userId = this.currentUser.userId;

        this.route.queryParams.subscribe(params => {
          const id = params['id'];
          this.fetchCommunities();
          if (id) {
            this.fetchCommunity(id);
          }
        });

        this.initForm();
      }
    );
  }

  initForm() {
    this.postForm = new FormGroup({
      textContent: new FormControl('', []),
      text: new FormControl('', [Validators.required, Validators.minLength(4)]),
      community: new FormControl('', Validators.required),
      postType: new FormControl('', Validators.required)
    });
  }

  fetchCommunity(communityId: number) {
    this.cs.getByCommunityId(communityId).subscribe({
      next: (data) => {
        this.selectedCommunity = data;
        this.postForm.patchValue({ community: this.selectedCommunity });

        // Trigger change detection manually
        this.cdr.detectChanges();
      },
      error: (error) => console.log(error),
      complete: () => console.log('Community fetched successfully')
    });
  }

  fetchCommunities() {
    this.cs.getJoinedByUserId(this.userId).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.joinedCommunities = data;
        } else {
          console.error('Invalid data format for joinedCommunities:', data);
        }
      },
      error: (error) => console.log(error),
      complete: () => console.log('Joined communities fetched successfully')
    });
  }

  containsProfanity(text: string): boolean {
    const isProfane = this.profanityFilter.isProfane(text);
    console.log('Text:', text);
    console.log('Is Profane:', isProfane);
    return isProfane;
  }

  onSubmit() {
    if (this.postForm.valid) {
      const sanitizedTextContent = this.replaceBadWords(this.postForm.value.text);
  
      if (this.containsProfanity(this.postForm.value.text)) {
        console.log("bad words detected");
        this.usersService.updateUserBadWordsCount(this.userId).subscribe(
          (action: number) => {
            console.log(action)
            console.log('Bad words count updated successfully');
            if (action === 1) {
              console.log("yetbana")
              this.token.signOut();
              this.router.navigate(['/home']);
            }
            if (action === 2) {
              this.submitPost(sanitizedTextContent);
            }
          },
        );
      } else {
        this.submitPost(sanitizedTextContent);
      }
    } else {
      console.log('Form is invalid');
    }
  }
  
  submitPost(sanitizedTextContent: string) {
    const userId = this.userId;
    const communityId = this.postForm.value.community.communityId;
  
    const post: Post = {
      postId: 0,
      textContent: sanitizedTextContent,
      user: this.currentUser,
      attachment: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      community: this.postForm.value.community,
      postType: this.postForm.value.postType,
      votes: [],
      upvoteCount: 0,
      downvoteCount: 0,
      downvoted: false,
      upvoted: false,
      totalVotes: 0,
      comments:[]
    };

    const attachment = this.attachments ? this.attachments[0] : undefined;

    this.postService.createPost(userId, communityId, attachment, post).subscribe({
      next: (response) => {
        console.log('Post created successfully:', response);
        this.router.navigate(['/community', communityId]);
      },
      error: (error) => {
        console.error('Error creating post:', error);
      }
    });
  }
  
  replaceBadWords(text: string): string {
    return this.profanityFilter.clean(text); // Replace bad words with asterisks
  }

  onFileChange(event: any) {
    console.log(event.target.files);
    this.attachments = event.target.files;
  }

  isSelected(community: any): boolean {
    return this.selectedCommunity && community.communityId === this.selectedCommunity.communityId;
  }
}
