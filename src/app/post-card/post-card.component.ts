import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DisplayPost, Post } from '../models/post.model';
import { User } from '../models/user.model';
import { AlertService } from '../services/alert.service';
import { PostService } from '../services/post.service';

import { selectAuthUser } from '../state/auth/auth.selectors';
import { deletePostById, updatePostById } from '../state/post/post.actions';
import { selectPostByUserId } from '../state/post/post.selectors';
import { selectUserById } from '../state/user/user.selectors';
import { UpdatePostDialogComponent } from '../update-post-dialog/update-post-dialog.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {

  @Input() post: DisplayPost | undefined;
  authUser$ = this.store.select(selectAuthUser);
  postUser$: Observable<User | undefined> | undefined;

  constructor(private postService: PostService, private alertService: AlertService, private store: Store, public dialog: MatDialog,) { }

  getPlaceholder(dimensions: number) {
    return `https://via.placeholder.com/${dimensions}`;
  }

  handleUpdatePost(postId: string) {
    const dialogRef = this.dialog.open(UpdatePostDialogComponent, {
      data: { postId },
      width: '80vw'
    });

    dialogRef.afterClosed().subscribe(postUpdated => {
      if (postUpdated) {
        //this.handlePostsUpdated();
      }
    });
  }

  handleDeletePost(postId: string) {
    this.store.dispatch(deletePostById({ postId }));
  }

  handleTogglePostVisibility(postId: string) {
    this.store.dispatch(updatePostById({ postId, updatedPost: { isActive: !this.post?.isActive } }))
  }

  ngOnInit(): void {
    if (this.post) {
      this.postUser$ = this.store.select(selectUserById(this.post.userId));
    }
  }

}
