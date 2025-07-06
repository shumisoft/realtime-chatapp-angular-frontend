import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css',
})
export class ConfirmationDialog {
  @Input() dialogText: string = '';
  @Input() primaryButtonText: string = 'Yes';
  @Input() secondaryButtonText: string = 'No';
  @Input() primaryButtonColor: string = 'bg-blue-500';
  @Input() secondaryButtonColor: string = 'bg-gray-500';
  @Input() textColor: string = 'text-gray-800';
  @Input() textSize: string = 'text-lg';
  @Input() buttonTextSize: string = 'text-md';
  @Input() loading: boolean = false;

  @Output() primaryButtonAction: EventEmitter<void> = new EventEmitter();
  @Output() secondaryButtonAction: EventEmitter<void> = new EventEmitter();

  closeDialog(): void {
    this.secondaryButtonAction.emit();
  }

  onPrimaryClick() {
    this.primaryButtonAction.emit();
  }

  onSecondaryClick() {
    this.secondaryButtonAction.emit();
  }
}
