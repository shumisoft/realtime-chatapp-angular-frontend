import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ChatRoomType, CreateChatRoomRequest } from '../../../../core/models/message.model';
import { User } from '../../../../core/models/user.models';
import { createChatRoom } from '../../../../core/store/chat-room/chat-room.actions';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { NewChat } from '../new-chat/new-chat';
import { NewGroup } from '../new-group/new-group';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css'],
  imports: [AvatarComponent, CommonModule, RouterLink, NewChat, NewGroup],
})
export class SidebarMenuComponent implements OnInit {
  private readonly store = inject(Store);
  readonly principleUser$ = this.store.select(selectPrincipleUser);

  @Output() logout = new EventEmitter<void>();

  isNewChatModalOpen = false;
  isNewGroupModalOpen = false;

  isMenuOpen = false;
  isPlusMenuOpen = false;

  constructor() {}

  ngOnInit() {}

  @HostListener('document:click')
  onDocumentClick() {
    this.closeMenu();
    this.closePlusMenu();
  }

  openPlusMenu($event: MouseEvent) {
    $event.stopPropagation();
    this.isPlusMenuOpen = !this.isPlusMenuOpen;
    this.isMenuOpen = false;
  }

  closePlusMenu() {
    this.isPlusMenuOpen = false;
  }

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isPlusMenuOpen = false;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openNewChatModal() {
    this.isNewChatModalOpen = true;
    this.isMenuOpen = false;
  }

  closeNewChatModal() {
    this.isNewChatModalOpen = false;
  }

  openNewGroupModal() {
    this.isNewGroupModalOpen = true;
    this.isPlusMenuOpen = false;
  }
  closeNewGroupModal() {
    this.isNewGroupModalOpen = false;
  }

  onCreateGroup(event: { name: string; description: string; memberIds: string[] }) {
    const payload: CreateChatRoomRequest = {
      ...event,
      type: ChatRoomType.PRIVATE,
    };

    this.store.dispatch(createChatRoom({ payload }));

    this.closeNewGroupModal();
  }

  onCreateDirectMessage(user: User) {
    if (!user?.userId) return;

    const payload: CreateChatRoomRequest = {
      type: ChatRoomType.DIRECT_MESSAGE,
      name: 'dm-name-placeholder', // backend requirement
      description: 'dm-description-laceholder', // backend requirement
      memberIds: [user?.userId],
    };

    this.store.dispatch(createChatRoom({ payload }));

    this.closeNewChatModal();
  }

  onLogout(): void {
    this.logout.emit();
  }
}
