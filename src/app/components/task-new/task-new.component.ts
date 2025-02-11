import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Task } from '../../models/task';

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
  @Output() handleSaveClick = new EventEmitter<Omit<Task, 'id'>>();
  @Output() handleCancelClick = new EventEmitter<null>();

  addTask(taskName: string, dueDate: string) {
    const newTask: Omit<Task, 'id'> = {
      name: taskName,
      dueDate: new Date(dueDate),
    };

    this.taskNameInput.nativeElement.value = '';
    this.taskDateInput.nativeElement.value = '';
    this.handleSaveClick.emit(newTask);
  }

  cancelClick() {
    this.handleCancelClick.emit();
  }
}
