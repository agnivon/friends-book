import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private alertService: AlertService, private router: Router) { }

  redirect(result: Observable<boolean>, url: string): Observable<boolean | UrlTree> {
    return result.pipe(map((result: boolean) => {
      console.log(result);
      if (!result) {
        //this.alertService.createErrorAlert('Access Denied. Please login');
        return this.router.parseUrl(url);
      }
      return result;
    }));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.redirect(this.auth.getAuthStatus(), '/login');
  }

  canLoad(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.redirect(this.auth.getAuthStatus(), '/login');
  }

}
