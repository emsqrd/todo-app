import { Component, ElementRef, ViewChild } from '@angular/core';

interface Task {
  id: number;
  title: string;
  dueDate: string;
}
@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent {
  @ViewChild('addTaskDialog') addTaskDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('taskTitleInput') taskTitleInput!: ElementRef<HTMLInputElement>;
  @ViewChild('taskDateInput') taskDateInput!: ElementRef<HTMLInputElement>;

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  tasks: Task[] = [
    {
      id: 1,
      title: 'Walk the dog',
      dueDate: this.formatDate(new Date('02/08/25')),
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
}
