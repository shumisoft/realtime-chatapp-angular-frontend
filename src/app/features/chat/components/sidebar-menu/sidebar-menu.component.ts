import { Component, OnInit } from '@angular/core';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css'],
  imports: [AvatarComponent],
})
export class SidebarMenuComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
