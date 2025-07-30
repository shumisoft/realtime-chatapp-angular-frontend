import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-add-comment',
  imports: [],
  template: ` <svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.width]="size"
    [attr.height]="size"
    viewBox="0 -960 960 960"
    [class]="class"
  >
    <path
      d="M440-400h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"
    />
  </svg>`,
  styles: ``,
})
export class AddComment {
  @Input() size: string = '24px';
  @Input() class: string = 'fill-current';
}
