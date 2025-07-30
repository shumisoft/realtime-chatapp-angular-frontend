import { Component, Input } from '@angular/core';

@Component({
  selector: 'icon-check',
  imports: [],
  template: ` <svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.width]="size"
    [attr.height]="size"
    viewBox="0 -960 960 960"
    [class]="class"
  >
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </svg>`,
  styles: ``,
})
export class Check {
  @Input() size: string = '24px';
  @Input() class: string = 'fill-current';
}
