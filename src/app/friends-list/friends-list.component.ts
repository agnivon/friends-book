import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {

  @Input() users: User[] | null | undefined;
  displayUsers: User[] | null | undefined;
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.displayUsers = this.users?.slice(0, 10);
  }

}
