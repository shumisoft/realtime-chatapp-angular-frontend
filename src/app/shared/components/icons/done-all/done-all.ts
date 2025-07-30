import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-done-all',
  imports: [],
  template: ` <svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.width]="size"
    [attr.height]="size"
    viewBox="0 -960 960 960"
    [class]="class"
  >
    <path
      d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"
    />
  </svg>`,
  styles: ``,
})
export class DoneAll {
  @Input() size: string = '24px';
  @Input() class: string = 'fill-current';
}
