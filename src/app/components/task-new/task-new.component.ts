import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Task } from '../../models/task';
import { DateService } from '../../services/date.service';

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
  @Output() addNewTask = new EventEmitter<Omit<Task, 'id'>>();
  @Output() cancelSave = new EventEmitter<null>();

  private dateService = inject(DateService);

  addTask(taskName: string, dueDate: string) {
    const newTask: Omit<Task, 'id'> = {
      name: taskName,
      dueDate: this.dateService.parseDate(dueDate),
    };

    this.addNewTask.emit(newTask);
    this.taskNameInput.nativeElement.value = '';
    this.taskDateInput.nativeElement.value = '';
  }

  cancelClick() {
    this.cancelSave.emit();
  }
}
