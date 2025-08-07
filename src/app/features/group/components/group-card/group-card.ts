import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChatRoom, ChatRoomMember } from '../../../../core/models/message.model';
import { StorageService } from '../../../../core/services/storage/storage.service';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';
import {
  Check,
  Delete,
  Edit,
  FolderOpen,
  MoreVertical,
  PersonAdd,
  PersonRemove,
  Upload,
  Visibility,
} from '../../../../shared/components/icons';
import { ImageViewerModal } from '../../../../shared/components/image-viewer-modal/image-viewer-modal';

@Component({
  standalone: true,
  selector: 'app-group-card',
  imports: [
    CommonModule,
    FormsModule,
    AvatarComponent,
    RouterLink,
    ConfirmationDialog,
    Check,
    Delete,
    Edit,
    MoreVertical,
    PersonAdd,
    PersonRemove,
    ImageViewerModal,
    Upload,
    Visibility,
    FolderOpen,
  ],
  templateUrl: './group-card.html',
  styleUrl: './group-card.css',
})
export class GroupCard implements OnChanges {
  private readonly storageService = inject(StorageService);

  @Input({ required: true }) group!: ChatRoom;
  @Input({ required: true }) isGroupAdmin = false;
  @Input() principalUserId: string | null = null;

  @Output() updateGroup = new EventEmitter<any>();
  @Output() addMember = new EventEmitter<void>();
  @Output() removeMember = new EventEmitter<string>();
  @Output() deleteGroup = new EventEmitter<number>();

  editField: Record<'name' | 'description', boolean> = {
    name: false,
    description: false,
  };

  form: Partial<Pick<ChatRoom, 'name' | 'description'>> = {};
  openMenuUserId: string | null = null;

  showRemoveMemberConfirmationDialog = false;
  memberToRemove: ChatRoomMember | null = null;

  showDeleteGroupDialog = false;

  isViewerOpen = false;
  selectedImageUrl: string | null = null;

  isGroupIconMenuOpen = false;
  isUploadingIcon = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const groupChange = changes['group'];

    // When group input updates (e.g. after save success), close any open
    // edit fields and sync form values to the freshly arrived data.
    if (groupChange && !groupChange.firstChange) {
      const prev: ChatRoom = groupChange.previousValue;
      const curr: ChatRoom = groupChange.currentValue;

      if (this.editField.name && prev?.name !== curr?.name) {
        this.editField.name = false;
        this.form.name = undefined;
      }

      if (this.editField.description && prev?.description !== curr?.description) {
        this.editField.description = false;
        this.form.description = undefined;
      }
    }
  }

  // Close dropdown when clicking outside
  @HostListener('document:click')
  onDocumentClick() {
    this.openMenuUserId = null;
    this.isGroupIconMenuOpen = false;
  }

  startEdit(field: 'name' | 'description', value: string) {
    this.editField[field] = true;
    this.form[field] = value;
  }

  saveEdit(field: 'name' | 'description', originalValue: string | null) {
    const newValue = (this.form[field] ?? '').trim();
    const oldValue = (originalValue ?? '').trim();

    if (newValue === oldValue) {
      this.editField[field] = false;
      return;
    }

    // safety: group name must not be empty
    if (field === 'name' && !newValue) {
      this.editField[field] = false;
      return;
    }

    this.updateGroup.emit({ [field]: newValue });

    console.info(`Updated ${field} to`, this.form[field]);

    this.editField[field] = false;
  }

  toggleMemberMenu(userId: string, event: MouseEvent) {
    event.stopPropagation(); // prevent document click from immediately closing it
    this.openMenuUserId = this.openMenuUserId === userId ? null : userId;
  }

  onAddMember() {
    this.addMember.emit();
  }

  onRemoveMember(member: ChatRoomMember) {
    this.memberToRemove = member;
    this.showRemoveMemberConfirmationDialog = true;
    this.openMenuUserId = null;
  }

  resetRemoveDialog() {
    this.showRemoveMemberConfirmationDialog = false;
    this.memberToRemove = null;
  }

  confirmRemove() {
    if (this.memberToRemove) {
      this.removeMember.emit(this.memberToRemove.userId);
    }
    this.resetRemoveDialog();
  }

  cancelRemove() {
    this.resetRemoveDialog();
  }

  openDeleteGroupDialog() {
    this.showDeleteGroupDialog = true;
  }

  confirmDeleteGroup() {
    this.deleteGroup.emit(this.group.chatId);
    this.closeDeleteGroupDialog();
  }

  closeDeleteGroupDialog() {
    this.showDeleteGroupDialog = false;
  }

  openViewer(url: string) {
    this.selectedImageUrl = url;
    this.isViewerOpen = true;
  }

  closeViewer() {
    this.selectedImageUrl = null;
    this.isViewerOpen = false;
  }

  onGroupIconClick(event: MouseEvent) {
    event.stopPropagation();

    if (this.isGroupAdmin) {
      if (!this.group.icon) {
        this.triggerGroupFileInput();
      } else {
        this.isGroupIconMenuOpen = !this.isGroupIconMenuOpen;
      }
    } else {
      if (this.group.icon) {
        this.openViewer(this.group.icon);
      }
    }
  }

  triggerGroupFileInput() {
    const input = document.getElementById('groupIconFileInput') as HTMLInputElement;
    input?.click();
  }

  onGroupIconSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) return;

    this.isUploadingIcon = true;

    this.storageService.uploadFile(file).subscribe({
      next: (imageUrl) => {
        this.updateGroup.emit({ icon: imageUrl });
        this.isUploadingIcon = false;
        this.isGroupIconMenuOpen = false;
      },
      error: () => {
        this.isUploadingIcon = false;
      },
    });

    input.value = '';
  }
}
