import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, map, mergeMap, take, tap } from "rxjs";
import { AlertService } from "src/app/services/alert.service";
import { UserService } from "src/app/services/user.service";
import { updateStoredAuthUser } from "../auth/auth.actions";
import { selectAuthUserId } from "../auth/auth.selectors";
import * as UserActions from "./user.actions";

@Injectable()
export class UserEffects {

    getUsers$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.getUsers),
        mergeMap(() => this.userService.getUsers()
            .pipe(
                map(users => UserActions.setUsers({ users })),
                catchError(err => this.handleError(err))
            )
        )
    ));

    updateUserById$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.updateUserById),
        mergeMap((action) => this.userService.updateUserById(action.userId, action.updatedUser).pipe(
            map(() => {
                this.alertService.createAlert("User modified successfully");
                return UserActions.getUsers();
            }),
            catchError(err => this.handleError(err))
        )),
    ));

    updateAuthUser$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.updateAuthUser),
        mergeMap((action) => this.store.select(selectAuthUserId).pipe(
            take(1),
            mergeMap((authUserId) => this.userService.updateUserById(authUserId!, action.updatedUser).pipe(
                map(() => {
                    this.alertService.createAlert(action.actionMessage || "Your information has been updated");
                    return updateStoredAuthUser({ updatedAuthUser: { ...action.updatedUser }})
                })
            )),
            catchError(err => this.handleError(err))
        ))
    ));

    getFriendRequests$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.getFriendRequests),
        mergeMap(() => this.userService.getFriendRequests()
            .pipe(
                map(friendRequests => UserActions.setFriendRequests({ friendRequests })),
                catchError(err => this.handleError(err))
            )
        )
    ));

    createFriendRequest$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.createFriendRequest),
        mergeMap((action) => this.userService.createFriendRequest(action.userId, action.friendId)
            .pipe(
                map(() => {
                    this.alertService.createAlert("Friend request created")
                    return UserActions.getFriendRequests();
                }),
                catchError(err => this.handleError(err))
            )
        )
    ));

    updateFriendRequestById$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.updateFriendRequestById),
        mergeMap((action) => this.userService.updateFriendRequestById(action.userId, action.friendId, action.requestId)
            .pipe(
                map(() => {
                    this.alertService.createAlert("Friend request accepted")
                    return UserActions.getFriendRequests();
                }),
                catchError(err => this.handleError(err))
            )
        )
    ));


    handleError(err: HttpErrorResponse) {
        this.alertService.createErrorAlert(err.message);
        return EMPTY;
    }

    constructor(private actions$: Actions, private userService: UserService, private alertService: AlertService, private store: Store) { }
}