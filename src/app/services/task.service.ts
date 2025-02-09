import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'https://todoapi-9d82.onrender.com';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    console.log(`${this.baseUrl}/tasks`);
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }
}
