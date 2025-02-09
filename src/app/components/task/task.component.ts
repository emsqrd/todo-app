import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [DragDropModule, DatePipe],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent {
  @Input() task!: Task;
  @Output() deleteTask = new EventEmitter<number>();

  bodyElement: HTMLElement = document.body;

  onDeleteTaskClick(id: number) {
    this.deleteTask.emit(id);
  }

  onDragStarted() {
    this.bodyElement.classList.add('inheritCursors');
    this.bodyElement.style.cursor = 'grabbing';
  }
}
