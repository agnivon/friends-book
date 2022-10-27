import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, EMPTY, map, mergeMap } from "rxjs";
import { AlertService } from "src/app/services/alert.service";
import { UserService } from "src/app/services/user.service";
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

    getFriendRequests$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.getFriendRequests),
        mergeMap(() => this.userService.getFriendRequests()
            .pipe(
                map(friendRequests => UserActions.setFriendRequests({ friendRequests })),
                catchError(err => this.handleError(err))
            )
        )
    ));

    handleError(err: HttpErrorResponse) {
        this.alertService.createErrorAlert(err.message);
        return EMPTY;
    }

    constructor(private actions$: Actions, private userService: UserService, private alertService: AlertService) { }
}