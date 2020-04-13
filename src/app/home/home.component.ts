import { Component, OnInit } from '@angular/core';
import { MicrosoftAuthService } from '../services/microsoft_auth.service';
import { User } from '../user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;
  token: String;
  notificationsEnabled = false;

  constructor(public microsoftAuthService: MicrosoftAuthService, public snackbar: MatSnackBar) { }

  ngOnInit() {
  }

  getNotifications() {
    if (this.notificationsEnabled == false) {
      this.notificationsEnabled = true;
      /* start notifications */
    } else if (this.notificationsEnabled == true) {
      this.notificationsEnabled = false;
    }
    console.log(this.notificationsEnabled)
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }

  async signIn(): Promise<void> {
    await this.microsoftAuthService.signIn();
  }
  
  async login() {
    await this.microsoftAuthService.login();
  }

  // async signIn(): Promise<void> {
  //   let token = await this.microsoftAuthService.signIn();
  //   if (this.microsoftAuthService.logged == true) { 
  //     this.token = await this.microsoftAuthService.getAccessToken();
  //     this.openSnackBar("Microsoft Office365: Successfully logged", "close");
  //     console.log(this.token);
  //   }
  //   else {
  //     this.openSnackBar("Microsoft Office365: Login failed", "close");    
  //   }
  // }

  signOut(): void {
    this.microsoftAuthService.signOut();
  }
}