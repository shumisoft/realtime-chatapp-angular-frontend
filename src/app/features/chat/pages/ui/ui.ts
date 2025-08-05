import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { MessageService } from '../../../../core/services/message/message.service';
import { selectAcessToken } from '../../../../core/store/auth/auth.selectors';
import { getPrincipalUser } from '../../../../core/store/principal-user/principal-user.actions';
import { MainComponent } from '../../components/main/main.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

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
