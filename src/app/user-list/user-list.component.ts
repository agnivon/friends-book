import { Component, Input, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { DisplayPost } from '../models/post.model';
import { DisplayUser, FriendIdRequestMap, FriendRequest, User } from '../models/user.model';
import { FileService } from '../services/file.service';

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
  displayUsers: DisplayUser[] | null | undefined;

  constructor(private fileService: FileService) { }

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
    const userSlice = this.users?.slice(this.users.length - 10);
    userSlice?.sort(this.userComparator);
    userSlice?.forEach(user => {
      this.fetchUserImages(user);
      this.setFriendRequestStatus(user);
    });
    this.displayUsers = userSlice;
  }

  setFriendIdMap() {
    this.friendRequests?.forEach(request => {
      const userId = this.user?.id
      if (userId === request.userId || userId === request.friendId) {
        this.friendIdRequestMap[request.friendId] = request;
      }
    });
  }

  getFriendRequestStatus(friendId: string): 0 | 1 | 2 | 3 {
    const userId = this.user?.id;
    if(userId && friendId) {
      if(friendId in this.friendIdRequestMap) {
        const request = this.friendIdRequestMap[friendId];
        if(request.status.toLowerCase().includes('pending')) {
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
    user.friendRequestStatus = this.getFriendRequestStatus(user.id);
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.setDisplayUsers();
    this.setFriendIdMap();
  }

}
