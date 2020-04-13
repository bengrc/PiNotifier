import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Microsoft */
import { MsalModule } from '@azure/msal-angular';
import { OAuthMicrosoftSettings } from '../oauth_microsoft';

/* Components */
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './alerts/alerts.component';
import { NavBarComponent } from './navbar/navbar.component';

/* Material */
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    AlertsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    HttpClientModule,
    MsalModule.forRoot({
      auth: {
        clientId: OAuthMicrosoftSettings.appId
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
