import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { MainComponent } from '../../components/main/main.component';
import { MessageService } from '../../../../core/services/message/message.service';
import { Store } from '@ngrx/store';
import { selectAcessToken } from '../../../../core/store/auth/auth.selectors';
import { map, switchMap, tap } from 'rxjs';
import { getPrincipalUser } from '../../../../core/store/principal-user/principal-user.actions';

@Component({
  selector: 'app-ui',
  standalone: true,
  imports: [SidebarComponent, MainComponent],
  templateUrl: './ui.html',
  styleUrl: './ui.css',
})
export class Ui {
  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);

  constructor() {
    this.store
      .select(selectAcessToken)
      .pipe(
        tap((token) => {
          if (token) {
            this.messageService.connect(token);
          }
        }),
      )
      .subscribe();

    this.store.dispatch(getPrincipalUser());
  }
}
