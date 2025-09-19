import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HotToastService } from '@ngxpert/hot-toast';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from '../../services/message/message.service';
import { clearAppState } from '../app.meta.reducer';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  register,
  registerFailure,
  registerSuccess,
} from './auth.actions';

export class AuthEffects {
  private readonly actions = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);

  login$ = createEffect(() =>
    this.actions.pipe(
      ofType(login),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((data) => loginSuccess({ data })),
          catchError((err) => {
            this.toast.close('logging-in');

            if (err.status === 0) {
              this.toast.error("Can't reach server, please try again later");

              return of(loginFailure({ error: 'Network error: server unreachable' }));
            }

            const error = err?.error?.message || 'Login failed';

            this.toast.error(error);

            return of(loginFailure({ error }));
          }),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(loginSuccess),
        tap(({ data }) => {
          // localStorage.setItem('accessToken', data.accessToken);
          // localStorage.setItem('refreshToken', data.refreshToken);

          this.toast.close('logging-in');

          this.toast.success('Login successful!');

          this.router.navigate(['/']);
        }),
      ),
    { dispatch: false },
  );

  register$ = createEffect(() =>
    this.actions.pipe(
      ofType(register),
      exhaustMap(({ payload }) =>
        this.authService.register(payload).pipe(
          map((data) => registerSuccess({ data })),
          catchError((err) => {
            this.toast.close('registering');

            if (err.status === 0) {
              this.toast.error("Can't reach server, please try again later");

              return of(registerFailure({ error: 'Network error: server unreachable' }));
            }

            const error = err?.error?.message || 'Registration failed';

            this.toast.error(error);

            return of(registerFailure({ error }));
          }),
        ),
      ),
    ),
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(registerSuccess),
        tap(({ data }) => {
          // localStorage.setItem('accessToken', data.accessToken);
          // localStorage.setItem('refreshToken', data.refreshToken);

          this.toast.close('registering');

          this.toast.success('Registration successful!');

          this.router.navigate(['/']);
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(() =>
    this.actions.pipe(
      ofType(logout),
      tap(() => {
        this.messageService.disconnect(); // Disconnect WebSocket
        localStorage.clear();
        this.toast.success('Logged out successfully!');
        this.router.navigateByUrl('/auth/login');
      }),
      // Dispatch the action to wipe the rest of the app state
      map(() => clearAppState()),
    ),
  );
}
