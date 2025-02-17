import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../models/task';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css',
})
export class TaskDetailComponent implements OnChanges {
  @Input({ required: true }) task!: Task;
  @Output() updateTask = new EventEmitter<Task>();
  @Output() cancelUpdateTask = new EventEmitter<null>();

  private dateService = inject(DateService);
  private fb = inject(FormBuilder);
  taskForm: FormGroup = this.fb.group({
    taskName: ['', Validators.required],
    dueDate: [''],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.taskForm.patchValue({
        taskName: this.task.name,
        dueDate: this.dateService.convertToDateInput(this.task.dueDate),
      });
    }
  }

  submitTask() {
    if (this.taskForm.invalid) return;

    const { taskName, dueDate } = this.taskForm.value;

    const updatedTask: Task = {
      ...this.task,
      name: taskName,
      dueDate: dueDate,
    };
    this.updateTask.emit(updatedTask);
  }

  cancelClick() {
    this.cancelUpdateTask.emit();
  }
}
