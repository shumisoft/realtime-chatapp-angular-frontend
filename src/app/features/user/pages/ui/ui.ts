import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthLoading } from '../../../../core/store/auth/auth.selectors';
import { HotToastService } from '@ngxpert/hot-toast';
import { getPrincipalUser } from '../../../../core/store/principal-user/principal-user.actions';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { ProfileCardComponent } from '../../components/profile-card/profile-card.component';
import { catchError, filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { User } from '../../../../core/models/user.models';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { ConfirmationDialog } from '../../../../shared/components/confirmation-dialog/confirmation-dialog';
import { logout } from '../../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-ui',
  standalone: true,
  imports: [ProfileCardComponent, CommonModule, ConfirmationDialog],
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

  readonly principalUser$ = this.store.select(selectPrincipleUser);

  readonly username$ = this.route.paramMap.pipe(map((params) => params.get('username')));
  readonly userData$!: Observable<User | null>;
  readonly isPrincipleUser$ = this.username$.pipe(map((username) => username === 'me'));
  private username!: string | null;

  showLogoutModal = false;
  logoutLoader = false;

  constructor() {
    this.principalUser$.pipe(take(1)).subscribe((user) => {
      if (!user?.userId) {
        this.toast.loading('Fetching Profile', { id: 'fetching-profile' });
        this.store.dispatch(getPrincipalUser());
      }
    });

    this.route.paramMap
      .pipe(
        switchMap(async (params) => params.get('username')),
        tap((username) => (this.username = username)),
      )
      .subscribe();

    this.userData$ = this.principalUser$.pipe(
      switchMap((principleUser) => {
        if (this.username === principleUser.username) {
          this.router.navigate(['..', 'me'], { relativeTo: this.route });
        }
        if (this.username === 'me') {
          // this.isPrincipleUser.set(true);
          try {
            this.toast.close('fetching-profile');
          } catch (e) {}
          return of(principleUser as unknown as User);
        }
        if (this.username) {
          return this.userService.getUserByUsername(this.username).pipe(
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

  openLogoutModal(): void {
    console.log('[openLogoutModal] logout event emitted!');
    this.showLogoutModal = true;
  }

  onLogoutConfirmed(): void {
    console.log('[onLogoutConfirmed] logout event emitted!');
    this.store.dispatch(logout())
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
  }
}
