import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Task } from '../../models/task';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
})
export class TaskDetailComponent {
  @ViewChild('taskNameInput')
  protected readonly taskNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('taskDateInput')
  protected readonly taskDateInput!: ElementRef<HTMLInputElement>;

  @Input({ required: true }) task!: Task;
  @Output() handleSaveClick = new EventEmitter<Task>();
  @Output() handleCancelClick = new EventEmitter<null>();

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  saveTask(taskName: string, dueDate: string) {
    const newTask: Task = {
      id: this.task.id,
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
