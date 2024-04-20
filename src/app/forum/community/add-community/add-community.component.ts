import { Component, OnInit } from '@angular/core';
import { CommunityServiceService } from '../services/community-service.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.css']
})
export class AddCommunityComponent implements OnInit {
  userId: number = 1;
  currentUser: any;
  
  constructor(
    private gs: CommunityServiceService,
    private token: TokenStorageService,
    private usersService: UsersService,
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.token.getUser();
    // this.userId = this.currentUser.id;
  }

  communityForm = new FormGroup({
    communityName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    // Set initial value for createdAt to the current date/time
    createdAt: new FormControl(new Date().toISOString(), [Validators.required]),
  });

  save() {
    this.gs.createCommunityAndSetUser(this.communityForm.value as any, this.userId).subscribe(
      () => { this.router.navigateByUrl('/feed'); }
    );
  }

  reset() {
    this.communityForm.reset();
  }
}
