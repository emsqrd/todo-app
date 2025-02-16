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
    dueDate: [null],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.taskForm.patchValue({
        taskName: this.task.name,
        dueDate: this.task.dueDate
          ? this.dateService.formatDate(this.task.dueDate)
          : null,
      });
    }
  }

  submitTask() {
    if (this.taskForm.invalid) return;

    const { taskName, dueDate } = this.taskForm.value;
    const localDate = dueDate ? this.dateService.parseDate(dueDate) : null;
    const updatedTask: Task = {
      id: this.task.id,
      name: taskName,
      dueDate: localDate,
    };
    this.updateTask.emit(updatedTask);
    this.taskForm.reset();
  }

  cancelClick() {
    this.cancelUpdateTask.emit();
  }
}
