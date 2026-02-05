import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Message } from '../../../../core/models/chat-room.model';
import { Store } from '@ngrx/store';
import { selectPrincipleUser } from '../../../../core/store/user/user.selectors';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css',
})
export class ChatCardComponent {
  @Input() message!: Message;

  private readonly store = inject(Store);
  readonly principalUser$ = this.store.select(selectPrincipleUser);
}
