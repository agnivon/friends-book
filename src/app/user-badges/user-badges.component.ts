import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-badges',
  templateUrl: './user-badges.component.html',
  styleUrls: ['./user-badges.component.css']
})
export class UserBadgesComponent implements OnInit {

  @Input() isAdmin: boolean | undefined;
  @Input() isFriend: boolean | undefined;
  @Input() isActive: boolean | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
