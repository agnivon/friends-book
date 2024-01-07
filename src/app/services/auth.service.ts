import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthUser, UserLoginCredentials, UserRegistrationData } from '../models/auth.model';
import { User } from '../models/user.model';
import { AlertService } from './alert.service';
import { UserService } from './user.service';
import { AlertMessageType } from '../models/alert.model';
import { Store } from '@ngrx/store';
import * as AuthActions from '../state/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseApiUrl = `http://3.17.216.66:3000`;
  private authenticatedUser: AuthUser | User | null;
  private authenticationToken: string | null;
  private lastAuthTime: number | null = null;
  private authTimeLimit = 300;

  constructor(private http: HttpClient, private alertService: AlertService,
    private userService: UserService, private router: Router, private store: Store) {
    const authUser = localStorage.getItem('authUser');
    this.authenticatedUser = authUser ? JSON.parse(authUser) : null;
    const authToken = localStorage.getItem('authToken');
    this.authenticationToken = authToken || null;
  }

  handleError(observable: Observable<any>) {
    return observable.pipe(catchError((err: HttpErrorResponse) => {
      this.alertService.createErrorAlert(err.message);
      return of(null);
    }));
  }

  registerUser(userRegistrationData: UserRegistrationData) {
    const url = `${this.baseApiUrl}/users/register`;
    return this.handleError(this.http.post<{ message: string }>(url, userRegistrationData));
  }

  authenticateUser(userLoginCredentials: UserLoginCredentials) {

    this.store.dispatch(AuthActions.authenticateUser({ userLoginCredentials }));

    const url = `${this.baseApiUrl}/users/authenticate`;
    return this.handleError(this.http.post<AuthUser>(url, userLoginCredentials).pipe(tap((user: AuthUser) => {
      localStorage.setItem('authToken', user.token);
      localStorage.setItem('authUser', JSON.stringify(user));

      this.authenticationToken = user.token;
      this.authenticatedUser = user;
      this.lastAuthTime = Math.floor(Date.now() / 1000);

    })));
  }

  logoutUser(message = 'Logged out successfully', type: AlertMessageType = 'success') {

    this.store.dispatch(AuthActions.logoutUser({ message, messageType: type }));

    localStorage.setItem('authToken', '');
    localStorage.setItem('authUser', '');

    this.authenticatedUser = null;
    this.authenticationToken = null;
    this.lastAuthTime = null;

    //this.alertService.createAlert(message, type);
  }

  checkTokenValidity(): Observable<User | null> {
    return this.userService.getUserById(this.getAuthenticatedUserId());
  }

  getAuthStatus() {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLimitCrossed = this.lastAuthTime ? (currentTime - this.lastAuthTime) > this.authTimeLimit : true;
    //console.log(this.authenticatedUser);
    if (timeLimitCrossed) {
      return this.refreshAuthStatus();
    } else {
      return this.authenticatedUser ? of(true) : of(false);
    }
  }

  refreshAuthStatus(): Observable<boolean> {
    if (this.authenticatedUser && this.authenticationToken) {
      return this.checkTokenValidity().pipe(map((user: User | null) => {
        if (user) {
          this.authenticatedUser = user;
          return true;
        }
        else {
          this.logoutUser('Token Expired. Please login again');
          return false;
        }
      }));
    } else {
      return of(false);
    }
  }

  getAuthenticatedUserId() {
    return this.authenticatedUser?._id;
  }

  getAuthenticationToken() {
    return this.authenticationToken;
  }
}
