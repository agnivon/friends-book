import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { FileService } from '../services/file.service';
import { Store } from '@ngrx/store';

import * as FileActions from '../state/file/file.actions';
import * as AuthSelectors from '../state/auth/auth.selectors';
import * as PostSelectors from '../state/post/post.selectors';
import * as UserSelectors from '../state/user/user.selectors';
import * as FileSelectors from '../state/file/file.selectors';
import { AuthUser } from '../models/auth.model';
import { Observable } from 'rxjs';
import { getPosts, updateManyPostsByUserId } from '../state/post/post.actions';
import { getFriendRequests, updateAuthUser, updateUserById } from '../state/user/user.actions';
import { HttpEventType } from '@angular/common/http';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {

  authUser$ = this.store.select(AuthSelectors.selectAuthUser);
  userPosts$ = this.store.select(PostSelectors.selectUserPosts);
  friendRequests$ = this.store.select(UserSelectors.selectAcceptedAuthUserFriendRequests);
  profilePhotoUrl$: Observable<SafeUrl> | undefined;

  authUser: AuthUser | undefined;

  constructor(private file: FileService, private store: Store, private alert: AlertService) { }

  getPlaceholder(dimensions: number) {
    return `https://via.placeholder.com/${dimensions}`;
  }

  handlePhotoUpload(event: any) {
    const photo: File = event.target.files[0];
    if (photo) {
      const formData = new FormData();
      formData.append("picture", photo);
      const upload$ = this.file.uploadFile(formData).subscribe((event) => {
        if (event.type == HttpEventType.Response) {
          if (event.status == 200) {
            this.alert.createAlert("Profile photo uploaded successfully");
            const photoId: string = event.body.uploadId;
            this.store.dispatch(updateAuthUser({
              updatedUser: { photoId },
              actionMessage: "Profile photo updated successfully"
            }));
            this.store.dispatch(updateManyPostsByUserId({
              userId: this.authUser!._id,
              photoId,
            }));
          }
          else {
            this.alert.createAlert("Upload failed", "failure");
          }
        }
      })
    }
  }
  /* if (event.status == 200) {
    const photoId = event.body.uploadId;
    this.store.dispatch(updateUserById({
      userId: this.authUser!._id,
      updatedUser: { photoId }
    }));
  }
  else {
    this.alert.createAlert("Upload failed", "failure");
  } */

  ngOnInit(): void {
    this.authUser$.subscribe(authUser => {
      if (authUser) {
        this.authUser = authUser
        this.store.dispatch(FileActions.getFileById({ fileId: authUser.photoId }));
        this.profilePhotoUrl$ = this.store.select(FileSelectors.selectFileById(authUser.photoId));
        //this.getProfilePhoto();
      }
    });
    this.store.dispatch(getPosts());
    this.store.dispatch(getFriendRequests());
  }
}
