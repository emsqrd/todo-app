import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { TaskComponent } from '../task/task.component';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DragDropModule, TaskComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent {
  @ViewChild('addTaskDialog') addTaskDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('taskNameInput') taskNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('taskDateInput') taskDateInput!: ElementRef<HTMLInputElement>;

  bodyElement: HTMLElement = document.body;

  constructor(private taskService: TaskService) {}

  tasks: Task[] = [];

  getTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  onAddTaskClick() {
    this.addTaskDialog.nativeElement.showModal();
  }

  onCancelDialogClick() {
    this.addTaskDialog.nativeElement.close();
  }

  onSaveTaskClick(name: string, date: string) {
    const newTask: Omit<Task, 'id'> = {
      name: name,
      dueDate: new Date(date),
    };

    this.taskService.createTask(newTask).subscribe((createdTask) => {
      this.tasks.push(createdTask);
      this.taskNameInput.nativeElement.value = '';
      this.taskDateInput.nativeElement.value = '';
      this.onCancelDialogClick();
    });
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.bodyElement.classList.remove('inheritCursors');
    this.bodyElement.style.cursor = 'unset';
  }

  handleDeleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe((_) => {
      this.tasks = this.tasks.filter((task) => task.id !== id);
    });
  }

  ngOnInit() {
    this.getTasks();
  }
}
