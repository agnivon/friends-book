import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthUser } from '../models/auth.model';
import { DisplayPost } from '../models/post.model';
import { selectAuthUser } from '../state/auth/auth.selectors';

@Pipe({
  name: 'visibleposts'
})
export class VisiblePostsPipe implements PipeTransform {

  authUser$ = this.store.select(selectAuthUser);
  authUser: AuthUser | null = null;

  constructor(private store: Store) { 
    this.authUser$.subscribe(authUser => this.authUser = authUser);
  }

  transform(value: DisplayPost[], ...args: unknown[]): DisplayPost[] {
    return value.filter(post => (post.userId === this.authUser?._id || post.isActive));
  }
}
