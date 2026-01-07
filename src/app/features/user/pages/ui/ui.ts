import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAuthLoading } from '../../../../core/store/auth/auth.selectors';
import { HotToastService } from '@ngxpert/hot-toast';
import { getPrincipalUser } from '../../../../core/store/user/user.actions';

@Component({
  selector: 'app-ui',
  imports: [],
  templateUrl: './ui.html',
  styleUrl: './ui.css',
})
export class Ui {
  store = inject(Store);
  loading$ = this.store.select(selectAuthLoading);

  private readonly toast = inject(HotToastService);

  constructor() {
    this.toast.loading('Fetching Profile', { id: 'fetching-profile' });
    this.store.dispatch(getPrincipalUser());
  }
}
