import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterPageComponent } from '../register-page/register-page.component';
import { SharedModule } from '../shared/shared.module';
import { LoginPageComponent } from '../login-page/login-page.component';
import { ForgotPasswordPageComponent } from '../forgot-password-page/forgot-password-page.component';



@NgModule({
  declarations: [
    RegisterPageComponent,
    LoginPageComponent,
    ForgotPasswordPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AuthModule { }
