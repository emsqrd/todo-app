import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() showCloseButton = true;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
