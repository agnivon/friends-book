import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordPageComponent } from './forgot-password-page/forgot-password-page.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthResolver } from './guards/auth.resolver';
import { NoAuthGuard } from './guards/noauth.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NetworkPageComponent } from './network-page/network-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

const routes: Routes = [
  { path: 'register', component: RegisterPageComponent, canActivate: [NoAuthGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [NoAuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordPageComponent, canActivate: [NoAuthGuard] },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard], resolve: { isAuthenticated: AuthResolver } },
  { path: 'network', component: NetworkPageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
