import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Task } from '../../models/task';

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

  private fb = inject(FormBuilder);

  newTaskForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    dueDate: [''],
  });

  addTask() {
    if (this.newTaskForm.invalid) return;

    const { name, description, dueDate } = this.newTaskForm.value;

    const newTask: Omit<Task, 'id'> = {
      name: name,
      description: description,
      dueDate: dueDate,
    };

    this.addNewTask.emit(newTask);
  }

  cancelClick() {
    this.cancelSave.emit();
  }
}
