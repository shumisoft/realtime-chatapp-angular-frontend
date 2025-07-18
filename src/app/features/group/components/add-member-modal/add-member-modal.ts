import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../core/models/user.models';
import { UserSearch } from '../../../../shared/components/user-search/user-search';

@Component({
  selector: 'app-add-member-modal',
  imports: [UserSearch],
  templateUrl: './add-member-modal.html',
  styleUrl: './add-member-modal.css',
})
export class AddMemberModal {
  @Input() existingMemberIds: string[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() selectUser = new EventEmitter<User>();

  onUserClick(user: User) {
    this.selectUser.emit(user);
  }
}
