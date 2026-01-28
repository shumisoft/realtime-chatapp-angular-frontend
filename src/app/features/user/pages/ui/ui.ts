import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthLoading } from '../../../../core/store/auth/auth.selectors';
import { HotToastService } from '@ngxpert/hot-toast';
import { getPrincipalUser } from '../../../../core/store/user/user.actions';
import { selectPrincipleUser } from '../../../../core/store/user/user.selectors';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { UserDTOResponse } from '../../../../core/models/user.models';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user/user.service';

@Component({
  selector: 'app-ui',
  standalone: true,
  imports: [ProfileCardComponent],
  templateUrl: './ui.html',
  styleUrls: ['./ui.css'],
})
export class Ui {
  private readonly store = inject(Store);
  private readonly toast = inject(HotToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly loading$ = this.store.select(selectAuthLoading);

  readonly principalUser = this.store.select(selectPrincipleUser);

  userId$!: Observable<string | null>;
  readonly userData$!: Observable<UserDTOResponse | null>;
  isPrincipalUser = false;

  constructor() {
    this.toast.loading('Fetching Profile', { id: 'fetching-profile' });
    this.userData$ = this.route.paramMap.pipe(
      switchMap(async (params) => params.get('userId')),
      switchMap((userId) => {
        console.log(userId);

        if (userId === 'me') {
          this.store.dispatch(getPrincipalUser());
          this.isPrincipalUser = true;
          return this.principalUser.pipe(
            tap(() => this.toast.close('fetching-profile')),
            map((user) => user as unknown as UserDTOResponse),
          );
        }
        if (userId) {
          return this.userService.getUserById(userId).pipe(
            tap(() => this.toast.close('fetching-profile')),
            catchError((err) => {
              this.toast.close('fetching-profile');

              if (err.status === 404) {
                this.toast.error('User not found');
                this.router.navigateByUrl('/');
                return of(null);
              }

              if (err.status === 0) {
                this.toast.error('Server unreachable');
                return of(null);
              }

              this.toast.error(err?.error?.message || 'Failed to fetch user');
              return of(null);
            }),
          );
        }
        return of(null);
      }),
    );
  }
}
