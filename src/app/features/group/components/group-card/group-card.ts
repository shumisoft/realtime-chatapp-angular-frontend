import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatRoom } from '../../../../core/models/message.model';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-group-card',
  imports: [CommonModule, FormsModule, AvatarComponent, RouterLink],
  templateUrl: './group-card.html',
  styleUrl: './group-card.css',
})
export class GroupCard implements OnChanges {
  constructor() {
    console.log('gruop card constructor');
  }

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
  @Input({ required: true }) group!: ChatRoom;
  @Input({ required: true }) isGroupAdmin = false;
  @Input() principalUserId: string | null = null;

  @Output() updateGroup = new EventEmitter<any>();
  @Output() removeMember = new EventEmitter<string>();

  editField: Record<'name' | 'description', boolean> = {
    name: false,
    description: false,
  };

  form: Partial<Pick<ChatRoom, 'name' | 'description'>> = {};
  openMenuUserId: string | null = null;

  // Close dropdown when clicking outside
  @HostListener('document:click')
  onDocumentClick() {
    this.openMenuUserId = null;
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

    console.log(`Updated ${field} to`, this.form[field]);

    this.editField[field] = false;
  }

  toggleMemberMenu(userId: string, event: MouseEvent) {
    event.stopPropagation(); // prevent document click from immediately closing it
    this.openMenuUserId = this.openMenuUserId === userId ? null : userId;
  }

  onRemoveMember(userId: string) {
    if (confirm('Are you sure you want to remove this member from the group?')) {
      this.removeMember.emit(userId);
    }
    this.openMenuUserId = null;
  }
}
