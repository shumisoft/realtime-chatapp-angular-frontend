import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HotToastService } from '@ngxpert/hot-toast';
import { catchError, exhaustMap, map, of, switchMap, takeUntil, tap } from 'rxjs';
import { UserService } from '../../services/user/user.service';
import { logout } from '../auth/auth.actions';
import {
  getPrincipalUser,
  getPrincipalUserFailure,
  getPrincipalUserSuccess,
  updatePrincipalUser,
  updatePrincipalUserFailure,
  updatePrincipalUserSuccess,
} from './principal-user.actions';

export class UserEffects {
  private readonly actions = inject(Actions);
  private readonly userService = inject(UserService);
  private readonly toast = inject(HotToastService);

  getPrincipalUser$ = createEffect(() =>
    this.actions.pipe(
      ofType(getPrincipalUser),
      exhaustMap(() =>
        this.userService.getPrincipalUser().pipe(
          takeUntil(this.actions.pipe(ofType(logout))), // Cancel on logout
          map((data) => {
            return getPrincipalUserSuccess({ data: { ...data, loading: false, error: null } });
          }),
          catchError((err) => {
            this.toast.close('fetching-profile');

            if (err.status === 0) {
              this.toast.error("Can't reach server, please try again later");

              return of(getPrincipalUserFailure({ error: 'Network error: server unreachable' }));
            }

            const error = err?.error?.message || 'Failed to fetch user profile.';

            this.toast.error(error);

            return of(getPrincipalUserFailure({ error }));
          }),
        ),
      ),
    ),
  );

  getPrincipalUserSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(getPrincipalUserSuccess),
        tap(() => {
          this.toast.close('fetching-profile');
        }),
      ),
    { dispatch: false },
  );

  updatePrincipalUser$ = createEffect(() =>
    this.actions.pipe(
      ofType(updatePrincipalUser),
      switchMap(({ payload }) =>
        this.userService.updatePrincipalUser(payload).pipe(
          takeUntil(this.actions.pipe(ofType(logout))), // Cancel on logout
          map((data) =>
            updatePrincipalUserSuccess({ data: { ...data, loading: false, error: null } }),
          ),
          catchError((err) => {
            const error = err?.error?.message || 'Failed to update profile';

            this.toast.error(error);
            return of(updatePrincipalUserFailure({ error }));
          }),
        ),
      ),
    ),
  );

  updatePrincipalUserSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(updatePrincipalUserSuccess),
        tap(() => {
          this.toast.success('Profile updated');
        }),
      ),
    { dispatch: false },
  );
}
