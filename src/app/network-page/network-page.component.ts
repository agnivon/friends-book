import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post.model';
import { FriendRequest, User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-network-page',
  templateUrl: './network-page.component.html',
  styleUrls: ['./network-page.component.css']
})
export class NetworkPageComponent implements OnInit {

  user: User | null | undefined;
  users: User[] | null | undefined;
  friendRequests: FriendRequest[] | null | undefined;
  userPosts: Post[] | null | undefined;

  constructor(private userService: UserService, private auth: AuthService, private postService: PostService) { }

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

  getUsers() {
    this.userService.getUsers().subscribe((users: User[] | null) => {
      if(users) {
        this.users = users;
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

  getUserPosts() {
    this.postService.getPostsByUserId(this.user!.id).subscribe((posts: Post[] | null) => {
      if (posts) {
        this.userPosts = posts;
      }
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.getUsers();
    this.getFriendRequests();
  }

}
