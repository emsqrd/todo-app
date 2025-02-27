import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../models/task';
import { LoadingStore } from '../stores/loading.store';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly dateService = inject(DateService);
  private readonly loadingStore = inject(LoadingStore);

  private baseUrl = environment.apiUrl;

  // Convert task due date to a format that can be displayed in the UI
  private mapTaskDates(task: Task): Task {
    return {
      ...task,
      dueDate: this.dateService.convertToDateInput(task.dueDate),
    };
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const requestId = `create-task-${Date.now()}`;
    this.loadingStore.startLoading(requestId);

    const taskToCreate = {
      ...task,
      dueDate: this.dateService.convertToISO(task.dueDate),
    };

    return this.http.post<Task>(`${this.baseUrl}/tasks`, taskToCreate).pipe(
      map((createdTask) => this.mapTaskDates(createdTask)),
      catchError((error) => {
        console.error('Error creating task:', error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingStore.stopLoading(requestId);
      })
    );
  }

  getTasks(): Observable<Task[]> {
    const requestId = 'get-tasks';
    this.loadingStore.startLoading(requestId);

    return this.http.get<Task[]>(`${this.baseUrl}/tasks`).pipe(
      map((tasks) => tasks.map((task) => this.mapTaskDates(task))),
      catchError((error) => {
        console.error('Error fetching tasks:', error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingStore.stopLoading(requestId);
      })
    );
  }

  updateTask(task: Task): Observable<Task> {
    const requestId = `update-task-${task.id}`;
    this.loadingStore.startLoading(requestId);

    const taskToUpdate = {
      ...task,
      dueDate: this.dateService.convertToISO(task.dueDate),
    };

    return this.http
      .put<Task>(`${this.baseUrl}/tasks/${taskToUpdate.id}`, taskToUpdate)
      .pipe(
        catchError((error) => {
          console.error('Error updating task:', error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingStore.stopLoading(requestId);
        })
      );
  }

  deleteTask(id: string): Observable<Task> {
    const requestId = `delete-task-${id}`;
    this.loadingStore.startLoading(requestId);

    return this.http.delete<Task>(`${this.baseUrl}/tasks/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting task:', error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingStore.stopLoading(requestId);
      })
    );
  }
}
