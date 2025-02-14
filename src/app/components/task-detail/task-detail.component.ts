import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Task } from '../../models/task';
import { DatePipe } from '@angular/common';
import { DateService } from '../../services/date.service';

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

  private dateService = inject(DateService);

  saveTask(taskName: string, dueDate: string) {
    const localDate = this.dateService.parseDate(dueDate);

    const newTask: Task = {
      id: this.task.id,
      name: taskName,
      dueDate: localDate,
    };
    this.handleSaveClick.emit(newTask);

    this.taskNameInput.nativeElement.value = '';
    this.taskDateInput.nativeElement.value = '';
  }

  cancelClick() {
    this.handleCancelClick.emit();
  }
}
