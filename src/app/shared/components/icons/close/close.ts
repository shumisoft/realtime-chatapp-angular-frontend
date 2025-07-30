import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-close',
  template: ` <svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.width]="size"
    [attr.height]="size"
    viewBox="0 -960 960 960"
    [class]="class"
  >
    <path
      d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
    />
  </svg>`,
  styles: ``,
})
export class Close {
  @Input() size: string = '24px';
  @Input() class: string = 'fill-current';
}
