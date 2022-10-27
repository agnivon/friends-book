import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { confirmPasswordMatchValidator } from '../directives/confirm-password-match.directive';
import { UserLoginCredentials, UserRegistrationData } from '../models/auth.model';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

export class ConfirmPasswordErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && (control.invalid || form?.hasError('passwordMismatch')) && (control.dirty || control.touched || isSubmitted));
  }
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class RegisterPageComponent implements OnInit {

  currentDate = new Date();

  registerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    dob: [null, [Validators.required]],
    gender: ['male', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: confirmPasswordMatchValidator });

  registerResponsePending: boolean = false;

  errorMatcher = new ConfirmPasswordErrorMatcher();

  constructor(private fb: FormBuilder, private auth: AuthService, private alertService: AlertService) { }

  ngOnInit(): void {
  }

  handleFormSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      this.registerResponsePending = true;
      this.auth.registerUser({
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        email: formValue.email!,
        dob: formValue.dob!,
        gender: formValue.gender!,
        password: formValue.password!
      }).subscribe((response) => {
        this.registerResponsePending = false;
        if (response) {
          this.alertService.createAlert(response.message);
        }
      });
    }
  }

  get firstName(): FormControl {
    return this.registerForm.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.registerForm.get('lastName') as FormControl;
  }

  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get dob(): FormControl {
    return this.registerForm.get('dob') as FormControl;
  }

  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.registerForm.get('confirmPassword') as FormControl;
  }

}
