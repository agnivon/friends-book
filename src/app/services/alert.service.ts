import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertMessageType } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private _snackBar: MatSnackBar) { }

  snackbarClasses = {
    success: 'snackbar-success',
    failure: 'snackbar-failure'
  }

  createAlert(message: string, type: AlertMessageType = 'success') {
    this._snackBar.open(message, 'Dismiss', {
      duration: 3000,
      panelClass: [this.snackbarClasses[type]],
      verticalPosition: 'top'
    });
  }

  createErrorAlert(message: string) {
    this._snackBar.open(message, 'Dismiss', {
      panelClass: ['snackbar-failure'],
      verticalPosition: 'top'
    });
  }
}
