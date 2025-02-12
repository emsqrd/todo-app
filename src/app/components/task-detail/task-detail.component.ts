import { Component, Input } from '@angular/core';
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
  @Input() task!: Task;
}
