import { Component, ElementRef, ViewChild } from '@angular/core';

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

  tasks = [
    {
      id: Math.random(),
      title: 'Take out the garbage',
      dueDate: this.formatDate(new Date('02/03/25')),
    },
    {
      id: Math.random(),
      title: 'Feed the cats',
      dueDate: this.formatDate(new Date('02/05/25')),
    },
    {
      id: Math.random(),
      title: 'Walk the dog',
      dueDate: this.formatDate(new Date('02/04/25')),
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
