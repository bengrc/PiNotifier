import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

import { AlertsService } from './alerts.service';
import { OAuthMicrosoftSettings } from '../../oauth_microsoft';
import { User } from '../user';
import { AuthenticationParameters } from 'msal';
import { Client } from '@microsoft/microsoft-graph-client';
import { threadId } from 'worker_threads';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MicrosoftAuthService {
  public authenticated: boolean;
  public user: User;
  public authenticationParameters: AuthenticationParameters
  public logged: boolean = true;
  public REST_API_SERVER = "http://localhost:4000/";


  constructor(
    private msalService: MsalService,
    private alertsService: AlertsService,
    private httpClient: HttpClient
    ) {
    
    //this.authenticated = false;
    this.authenticated = this.msalService.getAccount() != null;
    this.getUser().then((user) => {this.user = user});
  }

  async login() {
    return this.httpClient.get("http://localhost:4000/microsoftAuth/signin");
  }

  // Prompt the user to sign in and
  // grant consent to the requested permission scopes
  async signIn(): Promise<void> {
    let result = await this.msalService.loginPopup({scopes: OAuthMicrosoftSettings.scopes})
      .catch((reason) => {
        console.log("SignIn : login failed");
        this.alertsService.add('Login failed', JSON.stringify(reason, null, 2));
        this.authenticated = false;
        this.logged = false;
      });
      if (this.logged == false) {
        return;
      } else {
        this.logged == true;
        this.user = await this.getUser();
        let x = await this.getMails();
        console.log(this.user);
      }
  }

  // Sign out
  async signOut(): Promise<void> {
    this.user = null;
    this.authenticated = false;
    await this.msalService.logout();
  }

  // Silently request an access token
  async getAccessToken(): Promise<string> {
    let result = await this.msalService.acquireTokenSilent({scopes: OAuthMicrosoftSettings.scopes})
      .catch((reason) => {
        console.log("getAccessToken: Failed")
        return;
        // this.alertsService.add('Get token failed', JSON.stringify(reason, null, 2));
      });
    if (result) {
      console.log("getAccessToken: Succes")
      // this.alertsService.add('Token acquired', result.accessToken);
      this.authenticated = true;
      //this.user = await this.getUser();
      return result.accessToken;
    } else 
        return;
  }

  private async getUser(): Promise<User> {
    if (!this.logged) {
      console.log("la");
      return null;
    }
    console.log("ici");
    let graphClient = Client.init({
      // Initialize the Graph client with an auth
      // provider that requests the token from the
      // auth service
      authProvider: async(done) => {
        let token = await this.getAccessToken()
          .catch((reason) => {
            done(reason, null);
          });
  
        if (token)
        {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      }
    });
  
    // Get the user from Graph (GET /me)
    let graphUser = await graphClient.api('/me').get();

    var str2 = JSON.stringify(graphUser, null, 2);
    console.log("user -> ->" + str2);
    let user = new User();
    user.displayName = graphUser.displayName;

    // Prefer the mail property, but fall back to userPrincipalName
    user.email = graphUser.mail || graphUser.userPrincipalName;
  
    return user;
  }

  private async getMails(): Promise<string> {
    if (!this.logged) {
      console.log("la");
      return null;
    }
    console.log("ici");
    let graphClient = Client.init({
      // Initialize the Graph client with an auth
      // provider that requests the token from the
      // auth service
      authProvider: async(done) => {
        let token = await this.getAccessToken()
          .catch((reason) => {
            done(reason, null);
          });
  
        if (token)
        {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      }
    });
  
    console.log('unread mails = ');
    // Get the user from Graph (GET /me)
    let graphMails = await graphClient.api('/me/mailFolders/Inbox/messages?$filter=isRead ne true&count=true').get();

    var str = JSON.stringify(graphMails, null, 2);

    console.log("MAILS ->" + str);
    return "yes";
  }

}