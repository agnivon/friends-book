import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { hydrateUser } from './state/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'friends-book';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(hydrateUser());
  }
}
