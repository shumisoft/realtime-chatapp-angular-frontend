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
import { User } from '../../../core/models/user.models';
import { UserService } from '../../../core/services/user/user.service';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-user-search',
  imports: [AvatarComponent],
  templateUrl: './user-search.html',
  styleUrl: './user-search.css',
})
export class UserSearch {
  private readonly userService = inject(UserService);

  @Input() placeholder = 'Search user...';
  @Input() disabledUserIds: string[] = [];

  @Output() userSelected = new EventEmitter<User>();

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
        this.searchResults = (response?.content as User[]) ?? null;
      });
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  isDisabled(user: User): boolean {
    if (!user?.userId) return true;
    return this.disabledUserIds.includes(user.userId);
  }

  onUserClick(user: User) {
    if (this.isDisabled(user)) return;
    this.userSelected.emit(user);
  }

  onSearchInputFocus() {
    this.searchInputFocused.set(true);
  }

  onSearchInputBlur() {
    this.searchInputFocused.set(false);
  }
}
