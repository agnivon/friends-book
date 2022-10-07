import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthUser } from '../models/auth.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loginResponsePending: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  handleFormSubmit() {
    if(this.loginForm.valid) {
      const formValue = this.loginForm.value;
      this.loginResponsePending = true;
      this.auth.authenticateUser({
        email: formValue.email!,
        password: formValue.password!
      }).subscribe((user: AuthUser | null) => {
        this.loginResponsePending = false;
        if(user) {
          this.router.navigate(['/home']);
        }
      });
    }
  }

  get email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

}
