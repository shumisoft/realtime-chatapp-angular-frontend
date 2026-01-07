import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { inject } from '@angular/core';
import { getPrincipalUser, getPrincipalUserFailure, getPrincipalUserSuccess } from './user.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';

export class UserEffects {
  private readonly actions = inject(Actions);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);

  getPrincipalUser$ = createEffect(() =>
    this.actions.pipe(
      ofType(getPrincipalUser),
      exhaustMap(() =>
        this.userService.getPrincipalUser().pipe(
          map((data) => getPrincipalUserSuccess({ data })),
          catchError((err) => {
            this.toast.close('fetching-profile');

            if (err.status === 0) {
              this.toast.error("Can't reach server, please try again later");

              return of(getPrincipalUserFailure({ error: 'Network error: server unreachable' }));
            }

            const error = err?.error?.message || 'Failed to fetch user profile.';

            this.toast.error(error);

            return of(getPrincipalUserFailure({ error }));
          })
        )
      )
    )
  );

  getPrincipalUserSuccess$ = createEffect(
    () =>
      this.actions.pipe(
        ofType(getPrincipalUserSuccess),
        tap(({ data }) => {
          this.toast.close('fetching-profile');
          localStorage.setItem('principalUser', JSON.stringify(data));
        })
      ),
    { dispatch: false }
  );
}
