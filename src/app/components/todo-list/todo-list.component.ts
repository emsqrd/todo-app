import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent {
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
}
