import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { Auth2Service } from '../services/auth2.service';
import { selectAuthUser } from '../state/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private auth: Auth2Service, private router: Router, private store: Store) {}

  isNotAuthenticated(): Observable<boolean | UrlTree> {
    return this.store.select(selectAuthUser).pipe(map((authUser) => {
      //console.log(isAuthenticated);
      if (authUser) {
        return this.router.parseUrl('/home');
      }
      return true;
    }));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isNotAuthenticated();
  }

  /* canLoad(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isNotAuthenticated();
  } */
  
}
