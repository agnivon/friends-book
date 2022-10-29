import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { confirmPasswordMatchValidator } from '../directives/confirm-password-match.directive';
import { selectAuthUser } from '../state/auth/auth.selectors';
import { updateAuthUser } from '../state/user/user.actions';

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
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css'],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class SettingsPageComponent implements OnInit {

  authUser$ = this.store.select(selectAuthUser);
  currentDate = new Date();

  updateForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: [{ value: '', disabled: true}, [Validators.required, Validators.email]],
    dob: ['', [Validators.required]],
    gender: ['male', [Validators.required]],
    phone: ['', [Validators.pattern(/^(\+?\d{1,2})?\d{10}$/)]],
    city: ['', []],
    state: ['', []],
    country: ['', []],
    pincode: ['', [Validators.pattern(/^\d{5,10}$/)]],
    profession: ['', []]
  }, { validators: confirmPasswordMatchValidator });

  updateResponsePending: boolean = false;

  constructor(private store: Store, private fb: FormBuilder) { }

  handleFormSubmit() {
    if (this.updateForm.valid) {
      const formValue = this.updateForm.value;
      this.updateResponsePending = true;
      const updatedUser = {
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        email: formValue.email!,
        dob: formValue.dob!,
        gender: formValue.gender!,
        phone: formValue.phone!,
        city: formValue.city!,
        state: formValue.state!,
        country: formValue.country!,
        pincode: formValue.pincode!,
        profession: formValue.profession!
      }
      this.store.dispatch(updateAuthUser({ updatedUser }));
      this.updateResponsePending = false;
    }
  }

  get firstName(): FormControl {
    return this.updateForm.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.updateForm.get('lastName') as FormControl;
  }

  get email(): FormControl {
    return this.updateForm.get('email') as FormControl;
  }

  get dob(): FormControl {
    return this.updateForm.get('dob') as FormControl;
  }

  get gender(): FormControl {
    return this.updateForm.get('gender') as FormControl;
  }

  get phone(): FormControl {
    return this.updateForm.get('phone') as FormControl;
  }

  get city(): FormControl {
    return this.updateForm.get('city') as FormControl;
  }

  get state(): FormControl {
    return this.updateForm.get('state') as FormControl;
  }

  get country(): FormControl {
    return this.updateForm.get('country') as FormControl;
  }
  get pincode(): FormControl {
    return this.updateForm.get('pincode') as FormControl;
  }

  ngOnInit(): void {
    this.authUser$.subscribe(authUser => {
      if (authUser) {
        this.updateForm.patchValue(authUser);
      }
    })
  }

}
