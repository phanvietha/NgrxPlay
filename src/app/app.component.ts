import {Component, OnInit} from '@angular/core';
import { Store } from "@ngrx/store";
import {Observable} from "rxjs";
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import { AppState } from './reducers';
import { isLoggedIn, isLoggedOut } from './auth/auth.selectors';
import { logout, login } from './auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    loading = true;

    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;

    constructor(
      private router: Router,
      private store: Store<AppState>) {

    }

    ngOnInit() {
      const userInfo = localStorage.getItem('user');
      this.store.dispatch(login({user: JSON.parse(userInfo)}));

      this.isLoggedIn$ = this.store.select(isLoggedIn);
      this.isLoggedOut$ = this.store.select(isLoggedOut);

      this.router.events.subscribe(event  => {
        switch (true) {
          case event instanceof NavigationStart: {
            this.loading = true;
            break;
          }

          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this.loading = false;
            break;
          }
          default: {
            break;
          }
        }
      });

    }

    logout() {
      this.store.dispatch(logout());
    }

}
