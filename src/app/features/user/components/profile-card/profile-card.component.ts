import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HotToastService } from '@ngxpert/hot-toast';
import { map, Observable } from 'rxjs';
import { User } from '../../../../core/models/user.models';
import { StorageService } from '../../../../core/services/storage/storage.service';
import { updatePrincipalUser } from '../../../../core/store/principal-user/principal-user.actions';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import {
  Check,
  Edit,
  FolderOpen,
  Logout,
  Upload,
  Visibility,
  AddComment,
} from '../../../../shared/components/icons';
import { ImageViewerModal } from '../../../../shared/components/image-viewer-modal/image-viewer-modal';
import { EditUserRequest } from './../../../../core/models/user.models';
import { ChatRoomType, CreateChatRoomRequest } from '../../../../core/models/message.model';
import { createChatRoom } from '../../../../core/store/chat-room/chat-room.actions';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent,
    Edit,
    Logout,
    Check,
    ImageViewerModal,
    Visibility,
    Upload,
    FolderOpen,
    AddComment,
  ],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css'],
})
export class ProfileCardComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly toast = inject(HotToastService);
  private readonly storageService = inject(StorageService);

  @Input() loading!: Observable<boolean>;
  @Input() userData!: Observable<User | null>;
  @Input() isPrincipalUser!: boolean;

  @Output() logout = new EventEmitter<void>();

  form: any = {};
  editField: Record<string, boolean> = {};

  isAvatarMenuOpen = false;
  isViewerOpen = false;
  selectedImageUrl: string | null = null;
  isUploadingAvatar = false;

  constructor() {}

  ngOnInit() {
    this.userData.pipe(
      map((data) => {
        if (!data) {
          this.toast.error('Something Went Wrong!');
          this.router.navigateByUrl('/');
        }
      }),
    );
  }

  startEdit(field: string, currentValue: string | null) {
    this.editField[field] = true;
    this.form[field] = currentValue;
  }

  saveEdit(field: string, originalValue: string | null) {
    if (this.form[field] !== originalValue) {
      this.store.dispatch(
        updatePrincipalUser({ payload: { [field]: this.form[field] } as EditUserRequest }),
      );

      console.info(`Updated ${field} to`, this.form[field]);
    }
    this.editField[field] = false;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click')
  onDocumentClick() {
    this.isAvatarMenuOpen = false;
  }

  onAvatarClick(user: User | null, event: MouseEvent) {
    event.stopPropagation(); // prevent document click from immediately closing it

    if (!user) return;

    // PRINCIPAL USER
    if (this.isPrincipalUser) {
      if (!user.avatar) {
        // No avatar → directly upload
        this.triggerFileInput();
      } else {
        // Avatar exists → show menu
        this.isAvatarMenuOpen = !this.isAvatarMenuOpen;
      }
    }

    // NON-PRINCIPAL USER
    else {
      if (user.avatar) {
        this.openViewer(user.avatar);
      }
    }
  }

  triggerFileInput() {
    const input = document.getElementById('avatarFileInput') as HTMLInputElement;
    input?.click();
  }

  onAvatarSelected(event: Event, user: User) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) return;

    this.isUploadingAvatar = true;

    // Show uploading toast
    const uploadingToastId = 'avatar-upload';
    this.toast.loading('Uploading avatar...', { id: uploadingToastId });

    this.storageService.uploadFile(file).subscribe({
      next: (imageUrl) => {
        this.store.dispatch(
          updatePrincipalUser({
            payload: { ...user, avatar: imageUrl },
          }),
        );
        // Toast → success
        this.toast.close(uploadingToastId);

        this.isUploadingAvatar = false;
        this.isAvatarMenuOpen = false;
      },
      error: () => {
        // Toast → error
        this.toast.close(uploadingToastId);
        this.toast.error('Failed to upload avatar, please try again.');

        this.isUploadingAvatar = false;
      },
    });

    input.value = '';
  }

  openViewer(url: string) {
    this.selectedImageUrl = url;
    this.isViewerOpen = true;
  }

  closeViewer() {
    this.selectedImageUrl = null;
    this.isViewerOpen = false;
  }

  onLogout(): void {
    this.logout.emit();
  }

  onChatClick(user: User, event: MouseEvent) {
    event.stopPropagation();

    if (!user?.userId) return;

    const payload: CreateChatRoomRequest = {
      type: ChatRoomType.DIRECT_MESSAGE,
      name: 'dm-name-placeholder', // backend requirement
      description: 'dm-description-laceholder', // backend requirement
      memberIds: [user?.userId],
    };

    this.store.dispatch(createChatRoom({ payload, redirectOnSuccess: true }));
  }
}
