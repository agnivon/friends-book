import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { ForgotPasswordPageComponent } from './forgot-password-page/forgot-password-page.component';
import { FriendsPageComponent } from './friends-page/friends-page.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { AuthResolver } from './guards/auth.resolver';
import { NoAuthGuard } from './guards/noauth.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NetworkPageComponent } from './network-page/network-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: "full"
  },
  {
    path: 'register', component: RegisterPageComponent, canActivate: [NoAuthGuard]
  },
  {
    path: 'login', component: LoginPageComponent, canActivate: [NoAuthGuard]
  },
  {
    path: 'forgot-password', component: ForgotPasswordPageComponent, canActivate: [NoAuthGuard]
  },
  {
    path: 'home', component: HomePageComponent, canActivate: [AuthGuard], resolve: { isAuthenticated: AuthResolver }
  },
  {
    path: 'network', component: NetworkPageComponent, canActivate: [AuthGuard], resolve: { isAuthenticated: AuthResolver },
  },
  {
    path: 'friends', component: FriendsPageComponent, canActivate: [AuthGuard], resolve: { isAuthenticated: AuthResolver }
  },
  {
    path: 'settings', component: SettingsPageComponent, canActivate: [AuthGuard], resolve: { isAuthenticated: AuthResolver }
  },
  {
    path: 'admin', component: AdminPageComponent, canActivate: [AdminGuard], resolve: { isAuthenticated: AuthResolver }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
