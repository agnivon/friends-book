import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DisplayUser, User } from '../models/user.model';
import { getFileById } from '../state/file/file.actions';
import { selectFileById } from '../state/file/file.selectors';
import { selectAuthUserFriends } from '../state/user/user.selectors';
import { bodyScrollEndEvent, paginatedListGenerator } from '../utils';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {

  constructor(private store: Store) { }

  authUserFriends$ = this.store.select(selectAuthUserFriends);
  displayUsers: DisplayUser[] = [];
  userListGenerator: Generator<User[], void, unknown> | undefined;
  scrollEndSubscription: Subscription | undefined;

  fetchUserImages(user: DisplayUser) {
    const { photoId } = user;
    if (photoId) {
      this.store.dispatch(getFileById({ fileId: user.photoId }));
      user.photoUrl = this.store.select(selectFileById(photoId));
    }
  }

  setDisplayUsers() {
    const newUsers = this.userListGenerator?.next().value;
    if(newUsers) {
      newUsers.forEach(user => {
        this.fetchUserImages(user);
      });
      this.displayUsers = this.displayUsers!.concat(newUsers);
    }
  }
  
  /* handleScrollEnd() {
    
  } */

  ngOnInit(): void {
    this.scrollEndSubscription = bodyScrollEndEvent.subscribe((scrollEnd) => {
      if(scrollEnd) this.setDisplayUsers();
    });
    this.authUserFriends$.subscribe(users => {
      this.userListGenerator = paginatedListGenerator<User>(users, 20, this.displayUsers.length);
      this.displayUsers = [];
      this.setDisplayUsers();
    })
  }

  ngOnDestroy(): void {
    this.scrollEndSubscription?.unsubscribe();
  }

}
