import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Task } from '../../models/task';
import { DateService } from '../../services/date.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-task-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-new.component.html',
  styleUrl: './task-new.component.css',
})
export class TaskNewComponent {
  @Output() addNewTask = new EventEmitter<Omit<Task, 'id'>>();
  @Output() cancelSave = new EventEmitter<null>();

  private dateService = inject(DateService);
  private fb = inject(FormBuilder);

  newTaskForm: FormGroup = this.fb.group({
    taskName: ['', Validators.required],
    dueDate: [null],
  });

  addTask() {
    if (this.newTaskForm.invalid) return;

    const { taskName, dueDate } = this.newTaskForm.value;
    const localDate = dueDate ? this.dateService.parseDate(dueDate) : null;

    const newTask: Omit<Task, 'id'> = {
      name: taskName,
      dueDate: localDate,
    };

    this.addNewTask.emit(newTask);
    this.newTaskForm.reset();
  }

  cancelClick() {
    this.cancelSave.emit();
  }
}
