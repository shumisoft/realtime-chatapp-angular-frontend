import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Close } from '../icons';

@Component({
  selector: 'app-image-preview',
  imports: [Close],
  templateUrl: './image-preview.html',
  styleUrl: './image-preview.css',
})
export class ImagePreview {
  @Input() imageUrl!: string | null;
  @Input() removable = false;

  @Output() remove = new EventEmitter<void>();
  @Output() imageClicked = new EventEmitter<void>();

  onRemoveClick(event: MouseEvent) {
    event.stopPropagation();
    this.remove.emit();
  }

  onImageClick() {
    this.imageClicked.emit();
  }
}
