import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { TokenStorageService } from 'src/app/user/token-storage.service';
import { UsersService } from 'src/app/user/users.service';

// Fonction pour générer un token
function generateToken(tokenServerUrl: string, userID: string) {
  return fetch(
    `${tokenServerUrl}/access_token?userID=${userID}&expired_ts=7200`,
    {
      method: 'GET',
    }
  ).then((res) => res.json());
}

// Fonction pour générer un ID aléatoire
function randomID(len: number) {
  let result = '';
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.css']
})
export class MeetComponent implements OnInit, OnDestroy {
  @ViewChild('root')
  root!: ElementRef;
  userID!: number;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const roomID = params['roomID'] || randomID(5);
      this.currentUser = this.tokenStorageService.getUser();
      this.usersService.getUserIdByUsername(this.currentUser.username).subscribe(
        (data) => {
          this.currentUser = data;
          this.userID = this.currentUser.userId;

          generateToken('https://nextjs-token.vercel.app/api', this.userID.toString()).then((res) => {
            const token = ZegoUIKitPrebuilt.generateKitTokenForProduction(
              1484647939,
              res.token,
              roomID,
              this.userID.toString(),
              this.currentUser.username
            );

            const zp = ZegoUIKitPrebuilt.create(token);

            zp.joinRoom({
              container: this.root.nativeElement,
              sharedLinks: [
                {
                  name: 'Personal link',
                  url: window.location.origin + window.location.pathname + '?roomID=' + roomID,
                },
              ],
              scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall,
              },
            });
          });
        });
    });
  }

  ngOnDestroy() {
    // Nettoyer les ressources lorsque le composant est détruit
    // Cela peut inclure la déconnexion de la réunion, etc.
  }
}
