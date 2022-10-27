import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DisplayPost, Post } from '../models/post.model';
import { AlertService } from '../services/alert.service';
import { PostService } from '../services/post.service';

import { selectAuthUser } from '../state/auth/auth.selectors';
import { deletePostById } from '../state/post/post.actions';
import { UpdatePostDialogComponent } from '../update-post-dialog/update-post-dialog.component';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent implements OnInit {

  @Input() post: DisplayPost | undefined;
  user$ = this.store.select(selectAuthUser);
  /* @Output() postsUpdated = new EventEmitter(); */

  constructor(private postService: PostService, private alertService: AlertService, private store: Store, public dialog: MatDialog,) { }

  getPlaceholder(dimensions: number) {
    return `https://via.placeholder.com/${dimensions}`;
  }

  /* handleDeletePost(postId: string) {
    this.postService.deletePostById(postId).subscribe((deleted: any | null) => {
      if(deleted != null) {
        this.alertService.createAlert("Post successfully deleted");
        this.postsUpdated.emit();
      }
    })
  } */

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

  ngOnInit(): void {
  }

}
