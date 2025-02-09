import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { TaskComponent } from '../task/task.component';
import { Task } from '../../models/task';

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

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  tasks: Task[] = [
    {
      id: Math.random(),
      name: 'Walk the dog',
      dueDate: new Date('02/05/25'),
    },
    {
      id: Math.random(),
      name: 'Read a book',
      dueDate: new Date('02/23/25'),
    },
    {
      id: Math.random(),
      name: 'Take out the garbage',
      dueDate: new Date('02/05/25'),
    },
    {
      id: Math.random(),
      name: 'Make dinner',
      dueDate: new Date('02/07/25'),
    },
    {
      id: Math.random(),
      name: 'Do laundry',
      dueDate: new Date('02/13/25'),
    },
  ];

  onAddTaskClick() {
    this.addTaskDialog.nativeElement.showModal();
  }

  onCancelDialogClick() {
    this.addTaskDialog.nativeElement.close();
  }

  onSaveTaskClick(name: string, date: string) {
    const newTask = {
      id: Math.random(),
      name: name,
      dueDate: new Date(date),
    };

    this.tasks.push(newTask);

    this.taskNameInput.nativeElement.value = '';
    this.taskDateInput.nativeElement.value = '';

    this.onCancelDialogClick();
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.bodyElement.classList.remove('inheritCursors');
    this.bodyElement.style.cursor = 'unset';
  }

  handleDeleteTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
