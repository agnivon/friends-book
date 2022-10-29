import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getPosts } from '../state/post/post.actions';
import { getFriendRequests, getUsers } from '../state/user/user.actions';

@Component({
  selector: 'app-friends-page',
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.css']
})
export class FriendsPageComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(getUsers());
    this.store.dispatch(getPosts());
    this.store.dispatch(getFriendRequests());
  }

}
