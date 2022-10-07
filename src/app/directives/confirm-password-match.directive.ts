import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const confirmPasswordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && confirmPassword.value && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
};
