import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../services/alerts.service';
import { Alert } from '../alert';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  constructor(private alertsService: AlertsService, private snackbar: MatSnackBar) { }
  alerts: Alert[] = [];

  ngOnInit() {
  }

  ngOnChange() {
  
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
    });
  }

  close(alert: Alert) {
    this.alertsService.remove(alert);
  }
}