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

  userAuthenticated: boolean = false;
  componentChanging: boolean = true;

  constructor(private router: Router, protected auth: AuthService, private store: Store) { }

  checkIfAuthenticated() {
    this.componentChanging = true;
    /* this.auth.getAuthStatus().subscribe((isAuthenticated) => {
      this.userAuthenticated = isAuthenticated;
      this.componentChanging = false;
    }); */
    this.store.select(selectAuthUser).subscribe(authUser => {
      this.userAuthenticated = authUser ? true : false;
      this.componentChanging = false;
    })
  }

  handleLogout() {
    this.store.dispatch(logoutUser({}));
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.checkIfAuthenticated();
      }
    });
  }

}
