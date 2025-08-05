import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-upload',
  template: ` <svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.width]="size"
    [attr.height]="size"
    viewBox="0 -960 960 960"
    [class]="class"
  >
    <path
      d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
    />
  </svg>`,
  styles: ``,
})
export class Upload {
  @Input() size: string = '24px';
  @Input() class: string = 'fill-current';
}
