import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { NewPostDialogComponent } from '../new-post-dialog/new-post-dialog.component';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

import * as PostActions from '../state/post/post.actions';
import * as UserActions from '../state/user/user.actions';
import * as AuthSelectors from '../state/auth/auth.selectors';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  user$ = this.store.select(AuthSelectors.selectAuthUser);

  constructor(private userService: UserService, private auth: AuthService, private postService: PostService, public dialog: MatDialog, private store: Store) { }

  handleNewPost() {
    const dialogRef = this.dialog.open(NewPostDialogComponent, {
      width: '80vw'
    });

    dialogRef.afterClosed().subscribe(postCreated => {
      if (postCreated) {
        //this.handlePostsUpdated();
        document.getElementsByTagName('body')[0].scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(PostActions.getPosts());
    this.store.dispatch(UserActions.getUsers());
    this.store.dispatch(UserActions.getFriendRequests());
  }
}
