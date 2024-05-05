import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Chat } from '../chat';
import { Message } from '../message';
import { ChatService } from '../chat.service';
import { UsersService } from 'src/app/user/users.service';
import { TokenStorageService } from 'src/app/user/token-storage.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  chatForm: FormGroup;
  chatObj: Chat = new Chat();
  messageObj: Message = new Message();
  public messageList: any = [];
  public chatList: any = [];
  replymessage: string = "checking";
  public chatData: any;
  meetForm: FormGroup;
  chatId: string | null = null;
  color = "";
  secondUserName = "";
  firstUserName = ""; // Ajout de la propriété firstUserName
  public alluser: any = [];
  currentUser: any;
  refreshInterval: any; 
  constructor(
    private chatService: ChatService, 
    private router: Router, 
    private userService: UsersService,
    private tokenStorageService: TokenStorageService,
    private cdref: ChangeDetectorRef
  ) {
    this.chatForm = new FormGroup({
      replymessage: new FormControl()
    });
    this.meetForm = new FormGroup({
      meetingLink: new FormControl('')
    });
}

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.loadChatList();
    this.refreshInterval = setInterval(() => this.loadChatMessages(), 1000)
  }
  ngOnDestroy(): void {
    // Assurez-vous de nettoyer l'interval lorsque le composant est détruit
    clearInterval(this.refreshInterval);
  }

  loadChatList() {
    if (this.currentUser) {
      const currentUsername = this.currentUser.username;
      this.chatService.getChatByFirstUserNameOrSecondUserName(currentUsername).subscribe(data => {
        this.chatData = data;
        this.chatList = this.chatData;
      });
    }
  }

  loadChatByEmail(event: string, event1: string) {
    sessionStorage.removeItem("chatId");
    this.chatService.getChatByFirstUserNameAndSecondUserName(event, event1).subscribe(data => {
      this.chatData = data;
      this.chatId = this.chatData[0]?.chatId; // Using optional chaining to avoid null/undefined error
      if (this.chatId) {
        sessionStorage.setItem('chatId', this.chatId);
      }
      this.loadChatMessages();
    });
  }

  loadChatMessages() {
    if (this.chatId) {
      this.chatService.getChatById(this.chatId).subscribe(data => {
        this.chatData = data;
        this.secondUserName = this.chatData.secondUserName;
        this.firstUserName = this.chatData.firstUserName; // Assignation de la propriété firstUserName
        this.chatService.getAllMessagesByChatId(this.chatId).subscribe(data => {
          this.chatData = data;
          this.messageList = this.chatData;
        });
      });
    }
  }

  sendMessage() {
    if (this.chatId) {
      this.messageObj.replymessage = this.chatForm.value.replymessage;
      this.messageObj.senderEmail = this.currentUser.username;
      this.chatObj.chatId = parseInt(this.chatId) || 0;

      this.messageObj.chat = this.chatObj;
      this.chatService.addMessageToChatRoom(this.messageObj).subscribe(data => {
        this.chatForm.reset();
        this.loadChatMessages();
      });
    }
  }

  routeX() {
    sessionStorage.clear();
    this.router.navigateByUrl('');
  }

  routeHome() {
    this.router.navigateByUrl('');
  }

  goToChat(username: any) {
    if (this.currentUser) {
      const currentUsername = this.currentUser.username;
      this.chatService.getChatByFirstUserNameAndSecondUserName(username, currentUsername).subscribe(
        (data) => {
          this.chatId = data.chatId.toString();
          sessionStorage.setItem("chatId", this.chatId);
          this.loadChatMessages();
        },
        (error) => {
          if (error.status == 404) {
            this.chatObj.firstUserName = currentUsername;
            this.chatObj.secondUserName = username;
            this.chatService.createChatRoom(this.chatObj).subscribe(
              (data) => {
                this.chatData = data;
                this.chatId = this.chatData.chatId;
                sessionStorage.setItem("chatId", this.chatData.chatId);
                this.loadChatMessages();
              })
          }
        });
    }
  }
  startVideoMeeting() {
    if (this.chatId) {
      const link = `${window.location.origin}/meet?roomID=${this.chatId}`;
      const message = `Join the meeting: ${link}`;
      this.addMessageToChatRoom(message);
      window.open(link, '_blank');
    }
  }
  
  addMessageToChatRoom(message: string) {
    if (this.chatId) {
      this.messageObj.replymessage = message;
      this.messageObj.senderEmail = this.currentUser.username;
      this.chatObj.chatId = parseInt(this.chatId) || 0;
  
      this.messageObj.chat = this.chatObj;
      this.chatService.addMessageToChatRoom(this.messageObj).subscribe(data => {
        this.chatForm.reset();
        this.loadChatMessages();
      });
    }
  
  
      

  }
  startCustomMeeting() {
    const meetingLink = this.meetForm.get('meetingLink')?.value;
    if (meetingLink) {
      window.open(meetingLink, '_blank'); // Ouvre le lien dans un nouvel onglet
    } else {
      // Gérer le cas où le champ de saisie est vide
    }
}}