import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthUser, UserLoginCredentials, UserRegistrationData } from '../models/auth.model';
import { User } from '../models/user.model';
import { AlertService } from './alert.service';
import { UserService } from './user.service';
import { AlertMessageType } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseApiUrl = `https://nodejs-fb-app.herokuapp.com`;
  authenticatedUser: AuthUser | User | null;
  authenticationToken: string | null;/* = {
    "isAdmin": false,
    "isActive": true,
    "firstName": "Agnivo",
    "lastName": "Neogi",
    "email": "agnivon@gmail.com",
    "dob": "1996-02-28T18:30:00.000Z",
    "gender": "Male",
    "photoId": "632b328a4e4fb600042c6399",
    "createdDate": "2022-09-21T15:49:30.448Z",
    "_id": "632b328a4e4fb600042c639a",
    "token": ""
  }; */
  lastAuthTime: number | null = null;
  authTimeLimit = 300;

  constructor(private http: HttpClient, private alertService: AlertService, private userService: UserService, private router: Router) {
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
    return this.http.post<{ message: string }>(url, userRegistrationData).pipe(map((response: { message: string }) => {
      this.alertService.createAlert(response.message);
      return response;
    }), catchError((err: HttpErrorResponse) => {
      this.alertService.createErrorAlert(err.message);
      return of(null);
    }));
  }

  authenticateUser(userLoginCredentials: UserLoginCredentials) {
    const url = `${this.baseApiUrl}/users/authenticate`;
    return this.http.post<AuthUser>(url, userLoginCredentials).pipe(map((user: AuthUser) => {
      localStorage.setItem('authToken', user.token);
      localStorage.setItem('authUser', JSON.stringify(user));
      this.authenticationToken = user.token;
      this.authenticatedUser = user;
      this.lastAuthTime = Math.floor(Date.now() / 1000);

      this.alertService.createAlert(`${user.firstName} ${user.lastName}:${user.email} ${user._id} successfully logged in`);
      return user;
    }), catchError((err: HttpErrorResponse) => {
      this.alertService.createErrorAlert(err.message);
      return of(null);
    }));
  }

  logoutUser(message = 'Logged out successfully', type: AlertMessageType = 'success') {
    this.authenticatedUser = null;
    this.authenticationToken = null;
    this.lastAuthTime = null;
    localStorage.setItem('authToken', '');
    localStorage.setItem('authUser', '');
    this.alertService.createAlert(message, type);
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
