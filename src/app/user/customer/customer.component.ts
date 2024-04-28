import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/chat/chat.service';
import { Chat } from 'src/app/chat/chat';
import { TokenStorageService } from '../token-storage.service';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {
  Customers: User[] = [];

  constructor(
    private userService: UsersService, 
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.userService.getCustomers().subscribe(customers => {
      this.Customers = customers;
    });
  }

  goToChat(selectedUsername: string) {
    const currentUsername = this.tokenStorageService.getUser().username;

    const chatObj: Chat = new Chat();
    chatObj.firstUserName = currentUsername;
    chatObj.secondUserName = selectedUsername; // Utilisez le nom d'utilisateur sélectionné

    this.chatService.createChatRoom(chatObj).subscribe(
      (data: any) => {
        const chatId = data.chatId;
        sessionStorage.setItem("chatId", String(chatId));
        this.router.navigateByUrl('/chat');
      },
      (error) => {
        console.log("Error occurred while creating chat room:", error);
      }
    );
  }
}


