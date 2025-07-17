import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal, WritableSignal } from '@angular/core';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { User } from '../../../../core/models/user.models';
import { UserService } from '../../../../core/services/user/user.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-new-chat',
  imports: [AvatarComponent, CommonModule],
  templateUrl: './new-chat.html',
  styleUrl: './new-chat.css',
})
export class NewChat {
  private readonly userService = inject(UserService);

  @Output() close = new EventEmitter<void>();
  @Output() selectUser = new EventEmitter<User>();

  private searchSubject = new Subject<string>();

  searchResults: Partial<User>[] | null = null;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  searchInputFocused: WritableSignal<boolean> = signal<boolean>(false);

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
        this.searchResults = response.content;
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

  onUserClick(user: any) {
    this.selectUser.emit(user as User);
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick() {
    this.onClose();
  }
}
