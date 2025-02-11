import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-task-new',
  standalone: true,
  imports: [],
  templateUrl: './task-new.component.html',
  styleUrl: './task-new.component.css',
})
export class TaskNewComponent {
  @ViewChild('taskNameInput')
  protected readonly taskNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('taskDateInput')
  protected readonly taskDateInput!: ElementRef<HTMLInputElement>;
  @Output() handleSaveClick = new EventEmitter<{
    taskName: string;
    dueDate: string;
  }>();
  @Output() handleCancelClick = new EventEmitter<null>();

  addTask(taskName: string, dueDate: string) {
    this.taskNameInput.nativeElement.value = '';
    this.taskDateInput.nativeElement.value = '';
    this.handleSaveClick.emit({ taskName, dueDate });
  }

  cancelClick() {
    this.handleCancelClick.emit();
  }
}
