import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';
import { Auth2Service } from '../services/auth2.service';
import { selectAuthUser } from '../state/auth/auth.selectors';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth2Service, private store: Store, private router: Router) { }
  isAuthenticated(): Observable<boolean | UrlTree> {
    return this.store.select(selectAuthUser).pipe(map((authUser) => {
      //console.log(isAuthenticated);
      if (!authUser) {
        return this.router.parseUrl('/login');
      }
      return true;
    }));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthenticated();
  }
}
