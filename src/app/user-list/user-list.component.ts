import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { DisplayUser, FriendIdRequestMap, FriendRequest, User } from '../models/user.model';
import { AlertService } from '../services/alert.service';
import { FileService } from '../services/file.service';
import { ListService } from '../services/list.service';
import { UserService } from '../services/user.service';

import { listenToScrollEnd, unSubToScrollEnd } from '../utils';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  @Input() user: User | null | undefined;
  @Input() users: User[] | null | undefined;
  @Input() friendRequests: FriendRequest[] | null | undefined;
  friendIdRequestMap: FriendIdRequestMap = {};
  displayUsers: DisplayUser[] | null | undefined = [];

  sliceSize = 20;
  slicePointer = this.sliceSize;
  scrollEndHandler: Function | undefined;
  displayUsersUpdating = false;

  constructor(private fileService: FileService, private userService: UserService, private alertService: AlertService, private listService: ListService) { }

  fetchUserImages(user: DisplayUser) {
    this.fileService.getFileById(user.photoId).subscribe((imageUrl: SafeUrl | null) => {
      if (imageUrl) {
        user.photoUrl = imageUrl;
      }
    });
  }

  userComparator(user1: DisplayUser, user2: DisplayUser) {
    const user1CreatedDate = Date.parse(user1.createdDate);
    const user2CreatedDate = Date.parse(user2.createdDate);
    return user1CreatedDate > user2CreatedDate ? -1 : 1;
  }

  setDisplayUsers() {
    if (this.users) {
      this.displayUsersUpdating = true;

      const sliceStart = this.users.length - this.slicePointer;
      const sliceEnd = sliceStart + this.sliceSize;
      const userSlice = this.users.slice(sliceStart, sliceEnd);

      userSlice.sort(this.userComparator);
      userSlice.forEach(user => {
        this.fetchUserImages(user);
        this.setFriendRequestStatus(user);
      });
      
      this.displayUsers = this.displayUsers?.concat(userSlice.filter(user => user.id != this.user?.id));
      this.displayUsersUpdating = false;
    }
  }

  setFriendIdMap() {
    this.friendRequests?.forEach(request => {
      const userId = this.user?.id
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
    const userId = this.user?.id;
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

  handleSendFriendRequest(friendId: string) {
    this.userService.createFriendRequest(this.user?.id, friendId)
      .subscribe(response => {
        if (response) {
          this.alertService.createAlert("Friend Request sent successfully");
        } else {
          this.alertService.createAlert("Error sending friend request");
        }
      });
  }

  handleAcceptFriendRequest(friendId: string) {
    const requestId = this.friendIdRequestMap[friendId].id;
    this.userService.updateFriendRequestById(requestId, this.user?.id, friendId)
      .subscribe(response => {
        if (response) {
          this.alertService.createAlert("You are now friends");
        } else {
          this.alertService.createAlert("Error accepting friend request");
        }
      })
  }

  handleScrollEnd() {
    if (!this.displayUsersUpdating) {
      this.slicePointer += 20;
      this.setDisplayUsers();
    }
  }

  ngOnInit(): void {
    this.scrollEndHandler = listenToScrollEnd(() => {
      this.handleScrollEnd();
    })
  }

  ngOnDestroy(): void {
    unSubToScrollEnd(this.scrollEndHandler);
  }

  ngOnChanges() {
    this.setFriendIdMap();
    this.setDisplayUsers();
  }

}
