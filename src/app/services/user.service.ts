import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { FriendRequest, UpdatedUser, User } from '../models/user.model';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseApiUrl = `http://3.17.216.66:3000`;

  constructor(private alertService: AlertService, private http: HttpClient, private router: Router) { }

  handleError(observable: Observable<any>) {
    return observable.pipe(catchError((err: HttpErrorResponse) => {
      this.alertService.createErrorAlert(err.message);
      if (err.status === 401) {
        this.router.navigate(['/login']);
      }
      return of(null);
    }));
  }

  getUsers(): Observable<User[]> {
    const url = `${this.baseApiUrl}/users`;
    return this.http.get<User[]>(url);
  }

  getUserById(userId: string | null | undefined): Observable<User | null> {
    if (userId) {
      const url = `${this.baseApiUrl}/users/${userId}`;
      return this.handleError(this.http.get<User>(url));
    }
    return of(null);
  }

  getUserByEmail(email: string | null): Observable<User | null> {
    if (email) {
      const url = `${this.baseApiUrl}/users/findusersbyemail`;
      return this.handleError(this.http.post<User>(url, { email: email }));
    }
    return of(null);
  }

  updateUserById(userId: string, updatedUser: UpdatedUser) {
    const url = `${this.baseApiUrl}/users/${userId}`;
    return this.http.put<{}>(url, updatedUser);
  }

  createFriendRequest(userId: string, friendId: string) {
    const url = `${this.baseApiUrl}/friends/createrequest`;
    const body = {
      userId,
      friendId,
      status: 'Request Pending'
    }
    return this.http.post<{ message: string }>(url, body);
  }

  updateFriendRequestById(userId: string, friendId: string, requestId: string) {
    const url = `${this.baseApiUrl}/friends/${requestId}`;
    const body = {
      userId,
      friendId,
      status: 'You are friends'
    }
    return this.http.put<{}>(url, body);
  }

  getFriendRequests() {
    const url = `${this.baseApiUrl}/friends`;
    return this.http.get<FriendRequest[]>(url);
  }

  getFriendRequestById(requestId: string | null) {
    if (requestId) {
      const url = `${this.baseApiUrl}/friends/${requestId}`;
      return this.handleError(this.http.get<FriendRequest>(url));
    }
    return of(null);
  }

}
