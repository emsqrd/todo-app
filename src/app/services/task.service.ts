import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, task);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${task.id}`, task);
  }

  deleteTask(id: string): Observable<Task> {
    return this.http.delete<Task>(`${this.baseUrl}/tasks/${id}`);
  }
}
