import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { FileService } from '../services/file.service';
import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { Store } from '@ngrx/store';

import * as FileActions from '../state/file/file.actions';
import * as AuthSelectors from '../state/auth/auth.selectors';
import * as PostSelectors from '../state/post/post.selectors';
import * as UserSelectors from '../state/user/user.selectors';
import * as FileSelectors from '../state/file/file.selectors';
import { FriendRequest, User } from '../models/user.model';
import { AuthUser } from '../models/auth.model';
import { Post } from '../models/post.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  /* @Input() user: User | AuthUser | undefined;
  @Input() userPosts: Post[] | undefined;
  @Input() friendRequests: FriendRequest[] | undefined = []; */

  user$ = this.store.select(AuthSelectors.selectAuthUser);
  userPosts$ = this.store.select(PostSelectors.selectUserPosts);
  friendRequests$ = this.store.select(UserSelectors.selectAcceptedUserFriendRequests);
  profilePhotoUrl$: Observable<SafeUrl> | undefined;

  /* user: AuthUser | undefined;
  friendRequests: FriendRequest[] = []; */

  /* profilePhotoUrl: string | SafeUrl | null | undefined;
  connections: number | null | undefined = 0;
  noOfUserPosts: number | null | undefined = 0; */

  constructor(private userService: UserService, private auth: AuthService, private file: FileService, private postService: PostService, private store: Store) { }

  getPlaceholder(dimensions: number) {
    return `https://via.placeholder.com/${dimensions}`;
  }

  /* getProfilePhoto() {
    this.file.getFileById(this.user!.photoId).subscribe((photoUrl: SafeUrl | null) => {
      if (photoUrl) {
        this.profilePhotoUrl = photoUrl;
      }
    });
  } */

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.store.dispatch(FileActions.getFileById({ fileId: user.photoId }));
        this.profilePhotoUrl$ = this.store.select(FileSelectors.selectFileById(user.photoId));
        //this.getProfilePhoto();
      }
    });
  }

  ngOnChanges() {
    /* this.connections = this.friendRequests?.filter(request => {
      return request.userId === this.user?.id && !request.status.toLowerCase().includes('pending');
    }).length || 0;

    this.noOfUserPosts = this.userPosts?.length || 0;

    this.file.getFileById(this.user?.photoId).subscribe((photoUrl: SafeUrl | null) => {
      if (photoUrl) {
        this.profilePhotoUrl = photoUrl;
      }
    }); */
  }
}
