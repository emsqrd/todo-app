import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { TaskComponent } from '../task/task.component';
import { TaskNewComponent } from '../task-new/task-new.component';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DragDropModule, TaskComponent, TaskNewComponent, ModalComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent {
  private readonly taskService = inject(TaskService);
  @ViewChild('addTaskDialog')
  protected readonly addTaskDialog!: ElementRef<HTMLDialogElement>;

  bodyElement: HTMLElement = document.body;
  showAddTaskModal = false;
  tasks: Task[] = [];

  getTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  onAddTaskClick() {
    this.showAddTaskModal = true;
  }

  onCancelDialogClick() {
    this.showAddTaskModal = false;
  }

  onSaveTaskClick(newTask: Omit<Task, 'id'>) {
    this.taskService.createTask(newTask).subscribe((createdTask) => {
      this.tasks.push(createdTask);
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
