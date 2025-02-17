import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Task } from '../models/task';
import { environment } from '../../environments/environment';
import { DateService } from './date.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly dateService = inject(DateService);

  private baseUrl = environment.apiUrl;

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const taskToCreate = {
      ...task,
      dueDate: this.dateService.convertToISO(task.dueDate),
    };

    return this.http.post<Task>(`${this.baseUrl}/tasks`, taskToCreate);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`).pipe(
      map((tasks) =>
        tasks.map((task) => ({
          ...task,
          dueDate: this.dateService.convertToDateInput(task.dueDate),
        }))
      )
    );
  }

  updateTask(task: Task): Observable<Task> {
    const taskToUpdate = {
      ...task,
      dueDate: this.dateService.convertToISO(task.dueDate),
    };

    return this.http.put<Task>(
      `${this.baseUrl}/tasks/${taskToUpdate.id}`,
      taskToUpdate
    );
  }

  deleteTask(id: string): Observable<Task> {
    return this.http.delete<Task>(`${this.baseUrl}/tasks/${id}`);
  }
}
