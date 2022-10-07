import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { confirmPasswordMatchValidator } from '../directives/confirm-password-match.directive';

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
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css'],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ForgotPasswordPageComponent implements OnInit {

  currentDate = new Date();
  userAuthenticated: boolean = false;

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    dob: [null, [Validators.required]],
  });

  resetPasswordForm = this.fb.group({
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: confirmPasswordMatchValidator });

  errorMatcher = new ConfirmPasswordErrorMatcher();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  handleForgotPasswordFormSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log(this.forgotPasswordForm.value);
    }
  }

  handleResetPasswordFormSubmit() {
    if (this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm.value);
    }
  }

  get email(): FormControl {
    return this.forgotPasswordForm.get('email') as FormControl;
  }

  get dob(): FormControl {
    return this.forgotPasswordForm.get('dob') as FormControl;
  }

  get password(): FormControl {
    return this.resetPasswordForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.resetPasswordForm.get('confirmPassword') as FormControl;
  }

}
