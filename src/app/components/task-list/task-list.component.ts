import { Component, inject, signal } from '@angular/core';
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
import { TaskDetailComponent } from '../task-detail/task-detail.component';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    DragDropModule,
    ModalComponent,
    TaskComponent,
    TaskNewComponent,
    TaskDetailComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent {
  private readonly taskService = inject(TaskService);
  private readonly dateService = inject(DateService);

  selectedTask!: Task;
  showTaskDetailModal = signal(false);

  bodyElement: HTMLElement = document.body;
  showAddTaskModal = false;
  tasks: Task[] = [];

  get isTaskDetailModalOpen() {
    return this.showTaskDetailModal();
  }

  getTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  onAddNewTaskClick() {
    this.showAddTaskModal = true;
  }

  handleAddNewTask(newTask: Omit<Task, 'id'>) {
    this.taskService.createTask(newTask).subscribe((createdTask) => {
      this.tasks.push(createdTask);
      this.handleNewTaskModalClose();
    });
  }

  handleNewTaskModalClose() {
    this.showAddTaskModal = false;
  }

  handleSelectedTaskModalClose() {
    this.showTaskDetailModal.set(false);
  }

  handleSelectTask(task: Task) {
    this.showTaskDetailModal.set(true);
    this.selectedTask = task;
  }

  handleUpdateTask(updatedTask: Task) {
    this.taskService.updateTask(updatedTask).subscribe((_) => {
      this.tasks = this.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      this.handleSelectedTaskModalClose();
    });
  }

  handleDeleteTask(id: string) {
    this.taskService.deleteTask(id).subscribe((_) => {
      this.tasks = this.tasks.filter((task) => task.id !== id);
    });
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.bodyElement.classList.remove('inheritCursors');
    this.bodyElement.style.cursor = 'unset';
  }

  ngOnInit() {
    this.getTasks();
  }
}
