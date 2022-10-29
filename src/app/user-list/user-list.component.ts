import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthUser } from '../models/auth.model';
import { DisplayUser, FriendIdRequestMap, FriendRequest, User } from '../models/user.model';
import { AlertService } from '../services/alert.service';
import { FileService } from '../services/file.service';
import { ListService } from '../services/list.service';
import { UserService } from '../services/user.service';
import { selectAuthUser } from '../state/auth/auth.selectors';
import { getFileById } from '../state/file/file.actions';
import { selectFileById } from '../state/file/file.selectors';
import { createFriendRequest, updateFriendRequestById, updateUserById } from '../state/user/user.actions';
import { selectFriendRequests, selectUsers } from '../state/user/user.selectors';

import { arraySlice, bodyScrollEndEvent, listenToScrollEnd, paginatedListGenerator, unSubToScrollEnd } from '../utils';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  authUser$ = this.store.select(selectAuthUser);
  friendRequests$ = this.store.select(selectFriendRequests);
  users$ = this.store.select(selectUsers);

  authUser: AuthUser | undefined;
  //users: User[] = [];
  friendRequests: FriendRequest[] = [];
  friendIdRequestMap: FriendIdRequestMap = {};
  userListGenerator: Generator<User[], void, unknown> | undefined;
  displayUsers: DisplayUser[] = [];

  scrollEndSubscription: Subscription | undefined;
  //displayUsersUpdating = false;

  constructor(private fileService: FileService, private userService: UserService, private alertService: AlertService, private listService: ListService, private store: Store) { }

  fetchUserImages(user: DisplayUser) {
    const { photoId } = user;
    if (photoId) {
      this.store.dispatch(getFileById({ fileId: user.photoId }));
      user.photoUrl = this.store.select(selectFileById(photoId));
    }
  }

  fetchAllUserImages() {
    this.displayUsers.forEach(user => {
      this.fetchUserImages(user);
    })
  }

  setDisplayUsers(nextPage = true) {
    let newUsers = this.userListGenerator?.next().value;
    if (newUsers) {
      this.displayUsers = this.displayUsers.concat(newUsers);
      this.fetchAllUserImages();
      this.updateFriendRequestStatuses();
      //console.log(this.displayUsers);
    }
  }

  setFriendIdMap() {
    this.friendRequests?.forEach(request => {
      const userId = this.authUser?._id
      if (userId === request.userId) {
        this.friendIdRequestMap[request.friendId] = request;
      } else if (userId === request.friendId) {
        this.friendIdRequestMap[request.userId] = request;
      }
    });
    // console.log(this.user?.id, this.friendIdRequestMap);
    //console.log(this.displayUsers);
  }

  getFriendRequestStatus(friendId: string): 0 | 1 | 2 | 3 {
    const userId = this.authUser?._id;
    if (userId && friendId) {
      if (friendId in this.friendIdRequestMap) {
        const request = this.friendIdRequestMap[friendId];
        if (request.status.toLowerCase().includes('pending')) {
          return (userId === request.friendId) ? 2 : 1;
        } else {
          return 3;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }

  setFriendRequestStatus(user: DisplayUser) {
    // console.log(this.getFriendRequestStatus(user.id));
    user.friendRequestStatus = this.getFriendRequestStatus(user.id);
  }

  updateFriendRequestStatuses() {
    this.displayUsers.forEach(user => this.setFriendRequestStatus(user));
  }

  handleSendFriendRequest(friendId: string) {
    this.store.dispatch(createFriendRequest({ userId: this.authUser!._id, friendId }));
  }

  handleAcceptFriendRequest(friendId: string) {
    const requestId = this.friendIdRequestMap[friendId].id;
    this.store.dispatch(updateFriendRequestById({ userId: this.authUser!._id, friendId, requestId }));
  }

  handleUpdateUserStatus(userId: string, blocked: boolean) {
    this.store.dispatch(updateUserById({ userId, updatedUser: { isActive: !blocked } }));
  }

  ngOnInit(): void {
    this.scrollEndSubscription = bodyScrollEndEvent.subscribe((scrollEnd) => {
      if(scrollEnd) this.setDisplayUsers();
    });
    this.authUser$.subscribe(authUser => {
      if (authUser) {
        this.authUser = authUser;
      }
    });
    this.friendRequests$.subscribe(friendRequests => {
      this.friendRequests = friendRequests;
      this.setFriendIdMap();
      this.updateFriendRequestStatuses();
    });
    this.users$.subscribe(users => {
      this.userListGenerator = paginatedListGenerator<User>(users, 20, this.displayUsers.length);
      this.displayUsers = [];
      this.setDisplayUsers();
    });
  }

  ngOnDestroy(): void {
    this.scrollEndSubscription?.unsubscribe();
  }
}
