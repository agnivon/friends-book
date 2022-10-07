import { Component, OnInit } from '@angular/core';
import { NavigationStart, ResolveStart, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  userAuthenticated: boolean = false;
  componentChanging: boolean = true;

  constructor(private router: Router, protected auth: AuthService) { }

  checkIfAuthenticated() {
    this.componentChanging = true;
    this.auth.getAuthStatus().subscribe((isAuthenticated) => {
      this.userAuthenticated = isAuthenticated;
      this.componentChanging = false;
    });
  }

  handleLogout() {
    this.auth.logoutUser();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.checkIfAuthenticated();
      }
    });
  }

}
