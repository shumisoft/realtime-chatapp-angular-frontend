import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { User } from '../../../../core/models/user.models';
import { UserService } from '../../../../core/services/user/user.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { Close, Search } from '../../../../shared/components/icons';
@Component({
  selector: 'app-new-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvatarComponent, Search, Close],
  templateUrl: './new-group.html',
  styleUrl: './new-group.css',
})
export class NewGroup {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<{
    name: string;
    description: string;
    memberIds: string[];
  }>();

  // Form
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
  });

  searchValue: WritableSignal<string> = signal('');
  isLoading: WritableSignal<boolean> = signal(false);
  searchInputFocused: WritableSignal<boolean> = signal(false);

  private searchSubject = new Subject<string>();

  searchResults: Partial<User>[] | null = null;

  // Cache raw backend response
  private lastSearchResponse: Partial<User>[] = [];

  selectedUsers: Partial<User>[] = [];

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

        // Store raw response
        this.lastSearchResponse = response.content;

        // Filter already selected users
        const filtered = this.filterSelectedUsers(this.lastSearchResponse);

        this.searchResults = [...filtered].sort((a, b) =>
          (a?.fullName || '').localeCompare(b?.fullName || ''),
        );
      });
  }

  // Search
  onSearch(value: string) {
    this.searchValue.set(value);
    this.searchSubject.next(value);
  }

  onSearchInputFocus() {
    this.searchInputFocused.set(true);
  }

  onSearchInputBlur() {
    this.searchInputFocused.set(false);
  }

  // Selection
  selectUser(user: Partial<User>) {
    if (this.selectedUsers.some((u) => u.userId === user.userId)) return;

    this.selectedUsers.push(user);

    // Remove from visible results immediately
    this.searchResults = this.searchResults?.filter((u) => u.userId !== user.userId) ?? null;

    // Clear search input (WhatsApp-like behavior)
    this.searchValue.set('');
    this.searchResults = null;
  }

  // Removal
  removeUser(userId: string | null | undefined) {
    this.selectedUsers = this.selectedUsers.filter((u) => u.userId !== userId);

    // If there is active search text,
    // re-filter existing cached results (no API call needed)
    if (this.searchValue().trim()) {
      this.searchResults = this.filterSelectedUsers(this.lastSearchResponse);
    }
  }

  private filterSelectedUsers(users: Partial<User>[]): Partial<User>[] {
    return users.filter(
      (user) => !this.selectedUsers.some((selected) => selected.userId === user.userId),
    );
  }

  // Create Group
  canCreate(): boolean {
    return this.form.valid && this.selectedUsers.length > 0;
  }

  createGroup() {
    if (!this.canCreate()) {
      this.form.markAllAsTouched();
      return;
    }

    this.create.emit({
      name: this.form.value.name.trim(),
      description: this.form.value.description.trim(),
      memberIds: this.selectedUsers
        .map((u) => u.userId)
        .filter((id): id is string => typeof id === 'string'),
    });
  }

  onClose() {
    this.close.emit();
  }

  onBackdropClick() {
    this.onClose();
  }
}
