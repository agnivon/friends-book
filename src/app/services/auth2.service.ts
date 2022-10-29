import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, Observable, of, single, take, tap } from 'rxjs';
import { AlertMessageType } from '../models/alert.model';
import { AuthUser, UserLoginCredentials, UserRegistrationData } from '../models/auth.model';

import * as AuthActions from '../state/auth/auth.actions';
import { AuthState } from '../state/auth/auth.reducer';
import * as AuthSelectors from '../state/auth/auth.selectors';
import { AlertService } from './alert.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class Auth2Service {

  private baseApiUrl = `https://nodejs-fb-app.herokuapp.com`;
  private authTokenValidityDuration = 300 * 1000;

  constructor(private http: HttpClient, private store: Store, private alertService: AlertService, private userService: UserService) { }

  handleError(observable: Observable<any>) {
    return observable.pipe(catchError((err: HttpErrorResponse) => {
      this.alertService.createErrorAlert(err.message);
      return of(null);
    }));
  }

  registerUser(userRegistrationData: UserRegistrationData): Observable<{ message: string }> {
    const url = `${this.baseApiUrl}/users/register`;
    return this.http.post<{ message: string }>(url, userRegistrationData);
  }

  authenticateUser(userLoginCredentials: UserLoginCredentials): Observable<AuthUser> {
    const url = `${this.baseApiUrl}/users/authenticate`;
    return this.http.post<AuthUser>(url, userLoginCredentials);
  }

  checkTokenValidity(userId: string, authToken: string): Observable<boolean> {
    const url = `${this.baseApiUrl}/users/${userId}`;
    return this.http.get<AuthUser>(url, {
      headers: {
        "Authorization": `Bearer ${authToken}`
      }
    }).pipe(map(user => {
      //console.log(user)
      return user ? true : false;
    }), catchError(() => of(false)));
  }

  checkStoredAuthStatus(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectAuthSlice).pipe(
      take(1),
      mergeMap((authState: AuthState) => {
        const { authUser, authToken, lastAuthTime } = authState;
        const timeElapsedSinceLastAuth = lastAuthTime ? Date.now() - lastAuthTime : null;
        if (authUser && authToken) {
          if (timeElapsedSinceLastAuth === null || timeElapsedSinceLastAuth > this.authTokenValidityDuration) {
            return this.checkTokenValidity(authUser?._id, authToken).pipe(tap(isA => {
              if (isA) this.store.dispatch(AuthActions.setLastAuthTime());
              else {
                this.store.dispatch(AuthActions.logoutUser({ message: "Token Expired. Please login again" }));
              }
            }));
          } else {
            return of(true);
          }
        } else {
          this.store.dispatch(AuthActions.logoutUser({ message: "Token Expired. Please login again" }));
          return of(false);
        }
      })
    )
  };

  checkPassedAuthStatus(authUser: AuthUser, authToken: string): Observable<boolean> {
    return this.checkTokenValidity(authUser._id, authToken).pipe(
      map(user => user ? true : false),
    )
  }
}
