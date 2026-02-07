import { Component, inject, OnInit } from '@angular/core';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { Store } from '@ngrx/store';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css'],
  imports: [AvatarComponent, CommonModule, RouterLink],
})
export class SidebarMenuComponent implements OnInit {
  private readonly store = inject(Store);
  readonly principleUser$ = this.store.select(selectPrincipleUser);
  constructor() {}

  ngOnInit() {}
}
