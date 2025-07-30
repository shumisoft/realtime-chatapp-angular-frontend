import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-send',
  template: ` <svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.width]="size"
    [attr.height]="size"
    viewBox="0 -960 960 960"
    [class]="class"
  >
    <path
      d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"
    />
    <
  </svg>`,
  styles: ``,
})
export class Send {
  @Input() size: string = '24px';
  @Input() class: string = 'fill-current';
}
