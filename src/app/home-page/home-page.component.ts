import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Post } from '../models/post.model';
import { FriendRequest, User } from '../models/user.model';
import { NewPostDialogComponent } from '../new-post-dialog/new-post-dialog.component';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  user: User | null | undefined;
  friendRequests: FriendRequest[] | null | undefined;
  posts: Post[] | null | undefined;
  userPosts: Post[] | null | undefined;

  constructor(private userService: UserService, private auth: AuthService, private postService: PostService, public dialog: MatDialog) { }

  getUser() {
    const userId = this.auth.getAuthenticatedUserId();
    this.userService.getUserById(userId).subscribe((user: User | null) => {
      if (user) {
        this.user = user;
        this.getUserPosts();
        //console.log(user);
      }
    });
  }

  getFriendRequests() {
    this.userService.getFriendRequests().subscribe((requests: FriendRequest[] | null) => {
      if (requests) {
        this.friendRequests = requests;
      }
    });
  }

  getPosts() {
    this.postService.getPosts().subscribe((posts: Post[] | null) => {
      if (posts) {
        this.posts = posts;
      }
    });
  }

  getUserPosts() {
    this.postService.getPostsByUserId(this.user?.id).subscribe((posts: Post[] | null) => {
      if (posts) {
        this.userPosts = posts;
      }
    });
  }

  handlePostsUpdated() {
    this.getPosts();
    this.getUserPosts();
  }

  handleNewPost() {
    const dialogRef = this.dialog.open(NewPostDialogComponent, {
      width: '80vw',
      data: { user: this.user },
    });

    dialogRef.afterClosed().subscribe(postCreated => {
      if (postCreated) {
        this.handlePostsUpdated();
      }
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.getPosts();
    this.getFriendRequests();
  }

}