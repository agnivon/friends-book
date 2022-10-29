import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, EMPTY, map, mergeMap, tap } from "rxjs";
import { AlertService } from "src/app/services/alert.service";
import { PostService } from "src/app/services/post.service";
import { makeAction } from "../custom.action";
import { noAction } from "../no.actions";

import * as PostActions from "./post.actions";


@Injectable()
export class PostEffects {

    createPost$ = createEffect(() => this.actions$.pipe(
        ofType(PostActions.createPost),
        mergeMap(action => this.postService.createPost(action.newPost).pipe(
            map((response) => {
                if (response) {
                    this.alertService.createAlert("Post successfully created");
                    return PostActions.getPosts();
                } else {
                    this.alertService.createAlert("Post creation failed", "failure");
                    return makeAction("Post creation failed");
                }
            }),
            catchError(err => this.handleError(err))
        ))
    ));

    getPosts$ = createEffect(() => this.actions$.pipe(
        ofType(PostActions.getPosts),
        mergeMap(() => this.postService.getPosts()
            .pipe(
                map(posts => PostActions.setPosts({ posts })),
                catchError(err => this.handleError(err))
            ))
    ));

    updatePostById$ = createEffect(() => this.actions$.pipe(
        ofType(PostActions.updatePostById),
        mergeMap(action => this.postService.updatePostById(action.postId, action.updatedPost).pipe(
            map((response) => {
                this.alertService.createAlert("Post successfully updated");
                return PostActions.getPosts();
            }),
            catchError(err => this.handleError(err))
        ))
    ));

    updateManyPoststByUserId$ = createEffect(() => this.actions$.pipe(
        ofType(PostActions.updateManyPostsByUserId),
        mergeMap(action => this.postService.updateManyPostsByUserId(action.userId, action.photoId).pipe(
            map((response) => {
                this.alertService.createAlert("Posts successfully updated");
                return PostActions.getPosts();
            }),
            catchError(err => this.handleError(err))
        ))
    ));

    deletePostById$ = createEffect(() => this.actions$.pipe(
        ofType(PostActions.deletePostById),
        mergeMap((action) => this.postService.deletePostById(action.postId).pipe(
            map(() => {
                this.alertService.createAlert("Post successfully deleted");
                return PostActions.getPosts();
            })
        ))
    ));

    /* getPostsByUserId$ = createEffect(() => this.actions$.pipe(
        ofType(PostActions.getPostsByUserId),
        mergeMap((action) => this.postService.getPostsByUserId(action.userId)
            .pipe(map(userPosts => {
                if(userPosts) return PostActions.setPostsByUserId({ userPosts })
                else return noAction();
            })))
    )); */

    handleError(err: HttpErrorResponse) {
        this.alertService.createErrorAlert(err.message);
        return EMPTY;
    }


    constructor(private actions$: Actions, private postService: PostService, private alertService: AlertService) { }
}