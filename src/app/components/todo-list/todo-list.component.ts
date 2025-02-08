import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

interface Task {
  id: number;
  title: string;
  dueDate: string;
}

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  @ViewChild('addTaskDialog') addTaskDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('taskTitleInput') taskTitleInput!: ElementRef<HTMLInputElement>;
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
      title: 'Walk the dog',
      dueDate: this.formatDate(new Date('02/05/25')),
    },
    {
      id: Math.random(),
      title: 'Read a book',
      dueDate: this.formatDate(new Date('02/23/25')),
    },
    {
      id: Math.random(),
      title: 'Take out the garbage',
      dueDate: this.formatDate(new Date('02/05/25')),
    },
    {
      id: Math.random(),
      title: 'Make dinner',
      dueDate: this.formatDate(new Date('02/07/25')),
    },
  ];

  onAddTaskClick() {
    this.addTaskDialog.nativeElement.showModal();
  }

  onCancelDialogClick() {
    this.addTaskDialog.nativeElement.close();
  }

  onSaveTaskClick(title: string, date: string) {
    const newTask = {
      id: Math.random(),
      title: title,
      dueDate: this.formatDate(new Date(date)),
    };

    this.tasks.push(newTask);

    this.taskTitleInput.nativeElement.value = '';
    this.taskDateInput.nativeElement.value = '';

    this.onCancelDialogClick();
  }

  onDeleteTaskClick(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  onDragStarted() {
    this.bodyElement.classList.add('inheritCursors');
    this.bodyElement.style.cursor = 'grabbing';
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.bodyElement.classList.remove('inheritCursors');
    this.bodyElement.style.cursor = 'unset';
  }
}
