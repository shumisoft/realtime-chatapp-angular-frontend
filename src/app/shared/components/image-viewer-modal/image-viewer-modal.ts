import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Close } from "../icons";

@Component({
  selector: 'app-image-viewer-modal',
  imports: [Close],
  templateUrl: './image-viewer-modal.html',
  styleUrl: './image-viewer-modal.css',
})
export class ImageViewerModal {
  @Input() imageUrl!: string | null;

  @Output() close = new EventEmitter<void>();

  onBackdropClick() {
    this.close.emit();
  }

  onContentClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
