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

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  joinedCommunities: any[] = [];
  currentUser!: User;
  userId: number = 1;
  postForm!: FormGroup;
  attachments: any;
  selectedCommunity: any = {}; // Initialize with an empty object
  postTypes = Object.values(PostType);

  constructor(
    private cs: CommunityServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private router: Router,
    private postService : PostServiceService,
    private route : ActivatedRoute,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef

  ) {}

  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.initForm();
  
    this.route.queryParams.subscribe(params => {
      console.log(params); // Log the entire queryParams object
      const id = params['id'];
      
      this.fetchCommunities();

      if (id) {
        console.log(id);
        this.fetchCommunity(id);
      }
    });

  }
  

  initForm() {
    this.postForm = new FormGroup({
      textContent: new FormControl('', [Validators.required, Validators.minLength(4)]),
      community: new FormControl('', Validators.required),
      postType: new FormControl('', Validators.required)
    });
  }
  
  fetchCommunity(communityId: number) {
    this.cs.getByCommunityId(communityId).subscribe({
      next: (data) => {
        this.selectedCommunity = data;
        console.log('Selected community:', this.selectedCommunity);
        this.postForm.patchValue({ community: this.selectedCommunity });
        console.log('Form value after patching:', this.postForm.value);

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
  

  onSubmit() {
    if (this.postForm.valid) {
      const userId = this.userId;
      const communityId = this.postForm.value.community.communityId;
      const post: Post = {
        postId: 0,
        textContent: this.postForm.value.textContent,
        user: this.currentUser,
        attachment: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        community: this.postForm.value.community,
        postType: this.postForm.value.postType
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
    } else {
      console.log('Form is invalid');
    }
  }

  onFileChange(event: any) {
    console.log(event.target.files);
    this.attachments = event.target.files;
  }

  isSelected(community: any): boolean {
    // Check if the selectedCommunity is initialized and if the community ID matches
    return this.selectedCommunity && community.communityId === this.selectedCommunity.communityId;
  }
  
  
}
