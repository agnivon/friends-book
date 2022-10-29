import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, exhaustMap, take } from 'rxjs/operators';
import { AuthUser } from 'src/app/models/auth.model';
import { AlertService } from 'src/app/services/alert.service';
import { Auth2Service } from 'src/app/services/auth2.service';

import * as AuthActions from './auth.actions';
import { makeAction } from '../custom.action';
import { selectAuthSlice } from './auth.selectors';

@Injectable()
export class AuthEffects {

    registerUser$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.registerUser),
        exhaustMap(action => this.auth.registerUser(action.userRegistrationData)
            .pipe(
                map((response) => {
                    if (response.message) {
                        this.alertService.createAlert(response.message);
                        return EMPTY;
                    } else {
                        this.alertService.createErrorAlert("Registration failed");
                        return EMPTY;
                    }
                }),
                catchError((err) => this.handleError(err))
            ))
    ), { dispatch: false });

    authenticateUser$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.authenticateUser),
        exhaustMap(action => this.auth.authenticateUser(action.userLoginCredentials)
            .pipe(
                map((authUser) => {
                    if (authUser.isActive) {
                        this.setAuthDataInLS(authUser, authUser.token);
                        this.alertService.createAlert(`${authUser.firstName} ${authUser.lastName}:${authUser.email} ${authUser._id} successfully logged in`);
                        this.router.navigate(['/home']);
                        return AuthActions.storeAuthUser({
                            authUser,
                            authToken: authUser.token,
                            lastAuthTime: Date.now()
                        })
                    } else {
                        this.alertService.createAlert("You are blocked from accessing this platform.", "failure");
                        return makeAction('[Auth] User is blocked');
                    }
                }),
                catchError((err) => this.handleError(err))
            ))
    ));

    $logoutUser = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.logoutUser),
        map(action => {
            this.setAuthDataInLS();
            this.alertService.createAlert(
                action.message || "Logged out successfully",
                action.messageType
            );
            this.router.navigate(['/login']);
            return AuthActions.deleteAuthUser();
        })
    ));

    /* checkAuthStatus$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.checkAuthStatus),
        mergeMap(() => this.auth.checkStoredAuthStatus()
            .pipe(
                map((isAuthenticated) => {
                    if (!isAuthenticated) {
                        return AuthActions.logoutUser({
                            message: "Token Expired. Please login again"
                        });
                    } else {
                        return AuthActions.setLastAuthTime();
                    }
                }),
                catchError((err) => this.handleError(err))
            ))
    )); */

    /* hydrateUser$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.hydrateUser),
        mergeMap(() => {
            const [authUser, authToken] = this.getAuthDataFromLS();
            if (authUser && authToken) {
                return this.auth.checkPassedAuthStatus(authUser, authToken).pipe(
                    map(isAuthenticated => {
                        if (isAuthenticated) {
                            return AuthActions.storeAuthUser({
                                authUser,
                                authToken,
                                lastAuthTime: Date.now(),
                                hydrated: true
                            })
                        } else {
                            return makeAction("[Auth] Hydrated user token expired")
                        }
                    })
                )
            } else {
                return of(makeAction("[Auth] No user stored"));
            }
        })
    )); */

    hydrateUser$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.hydrateUser),
        map(() => {
            const [authUser, authToken] = this.getAuthDataFromLS();
            if (authUser && authToken) {
                return AuthActions.storeAuthUser({
                    authUser,
                    authToken,
                    hydrated: true
                })
            } else {
                return makeAction("[Auth] No user stored");
            }
        })
    ));

    updateStoredAuthUser$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.updateStoredAuthUser),
        mergeMap(() => this.store.select(selectAuthSlice).pipe(
            take(1),
            map(authSlice => {
                this.setAuthDataInLS(authSlice.authUser!, authSlice.authToken!);
                return makeAction("Stored LS Auth Data updated")
            })
        )),
        catchError((err) => this.handleError(err))
    ))

    getAuthDataFromLS(): [AuthUser | null, string | null] {
        const lsAuthUser = localStorage.getItem('authUser');
        const authUser: AuthUser = lsAuthUser ? JSON.parse(lsAuthUser) : null;
        const laAuthToken = localStorage.getItem('authToken');
        const authToken = laAuthToken || null;
        return [authUser, authToken];
    }

    setAuthDataInLS(authUser?: AuthUser, authToken?: string) {
        if (authUser !== undefined) {
            localStorage.setItem('authUser', JSON.stringify(authUser));
        } else {
            localStorage.removeItem('authUser');
        }
        if (authToken !== undefined) {
            localStorage.setItem('authToken', authToken);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    handleError(err: HttpErrorResponse) {
        this.alertService.createErrorAlert(err.message);
        return EMPTY;
    }

    constructor(private actions$: Actions,
        private auth: Auth2Service, private alertService: AlertService, private router: Router, private store: Store) { }

}