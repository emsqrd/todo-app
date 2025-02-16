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
    name: ['', Validators.required],
    dueDate: ['', Validators.required],
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.task) {
      this.taskForm.patchValue({
        name: this.task.name,
        dueDate: this.task.dueDate
          ? new Date(this.task.dueDate).toISOString().substring(0, 10)
          : '',
      });
    }
  }

  submitTask() {
    if (this.taskForm.invalid) return;

    const { name, dueDate } = this.taskForm.value;
    const localDate = this.dateService.parseDate(dueDate);
    const updatedTask: Task = {
      id: this.task.id,
      name,
      dueDate: localDate,
    };
    this.updateTask.emit(updatedTask);
    this.taskForm.reset();
  }

  cancelClick() {
    this.cancelUpdateTask.emit();
  }
}
