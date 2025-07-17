import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { User } from '../../../../core/models/user.models';
import { UserService } from '../../../../core/services/user/user.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-add-member-modal',
  imports: [AvatarComponent],
  templateUrl: './add-member-modal.html',
  styleUrl: './add-member-modal.css',
})
export class AddMemberModal {
  private readonly userService = inject(UserService);

  @Input() existingMemberIds: string[] = [];
  @Input() principalUserId: string | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() selectUser = new EventEmitter<User>();

  private searchSubject = new Subject<string>();

  searchResults: User[] | null = null;

  isLoading: WritableSignal<boolean> = signal(false);
  searchInputFocused: WritableSignal<boolean> = signal(false);

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query.trim()) {
            this.searchResults = null;
            return of(null);
          }

          this.isLoading.set(true);
          return this.userService.searchUsers(query);
        }),
      )
      .subscribe((response) => {
        this.isLoading.set(false);

        if (!response) {
          this.searchResults = null;
          return;
        }

        this.searchResults = response.content as User[];
      });
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  onSearchInputFocus() {
    this.searchInputFocused.set(true);
  }

  onSearchInputBlur() {
    this.searchInputFocused.set(false);
  }

  isAlreadyMember(user: Partial<User>): boolean {
    if (!user?.userId) return false;

    return this.existingMemberIds.includes(user.userId) || user.userId === this.principalUserId;
  }

  onUserClick(user: User) {
    if (this.isAlreadyMember(user)) return;
    this.selectUser.emit(user);
  }

  onBackdropClick() {
    this.close.emit();
  }
}
