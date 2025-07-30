import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../../../core/models/user.models';
import { UserSearch } from '../../../../shared/components/user-search/user-search';
import { Close } from '../../../../shared/components/icons';

@Component({
  selector: 'app-new-chat',
  imports: [CommonModule, UserSearch, Close],
  templateUrl: './new-chat.html',
  styleUrl: './new-chat.css',
})
export class NewChat {
  @Output() close = new EventEmitter<void>();
  @Output() selectUser = new EventEmitter<User>();

  onUserClick(user: any) {
    this.selectUser.emit(user as User);
  }
}
