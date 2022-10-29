import { Component, OnInit } from '@angular/core';
import { NavigationStart, ResolveStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import { logoutUser } from '../state/auth/auth.actions';
import { selectAuthUser } from '../state/auth/auth.selectors';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  authUser$ = this.store.select(selectAuthUser);

  constructor(private router: Router, protected auth: AuthService, private store: Store) { }

  handleLogout() {
    this.store.dispatch(logoutUser({}));
  }

  ngOnInit(): void {
  }

}
