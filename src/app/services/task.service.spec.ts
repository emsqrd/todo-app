import { TestBed } from '@angular/core/testing';
import {
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { TaskService } from './task.service';
import { Task } from '../models/task';
import { environment } from '../../environments/environment';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { DateService } from '../../app/services/date.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpRequests: HttpRequest<any>[] = [];

  // Stub for DateService
  const stubDateService = {
    convertToDateInput: (date: string) => `converted-${date}`,
    convertToISO: (date: string) => `iso-${date}`,
  };

  const testInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
  ) => {
    httpRequests.push(req);

    // Mock responses based on the request
    if (req.url.endsWith('/tasks') && req.method === 'GET') {
      return of(new HttpResponse({ body: [mockTask] }));
    } else if (req.url.endsWith('/tasks') && req.method === 'POST') {
      return of(new HttpResponse({ body: mockTask }));
    } else if (req.url.includes('/tasks/') && req.method === 'PUT') {
      return of(new HttpResponse({ body: mockTask }));
    } else if (req.url.includes('/tasks/') && req.method === 'DELETE') {
      return of(new HttpResponse({ body: mockTask }));
    }
    return next(req);
  };

  // Mock data
  const mockTask: Task = {
    id: '1',
    name: 'Test Task',
    dueDate: '2020-01-01',
  };

  const mockNewTask: Omit<Task, 'id'> = {
    name: 'New Task',
    dueDate: '2020-01-01',
  };

  // Expected task for methods that apply date conversion
  const expectedConvertedTask: Task = {
    ...mockTask,
    dueDate: stubDateService.convertToDateInput(mockTask.dueDate),
  };

  beforeEach(() => {
    httpRequests = [];
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: DateService, useValue: stubDateService },
        provideHttpClient(withInterceptors([testInterceptor])),
      ],
    });

    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTask', () => {
    it('should create a new task with formatted dueDate', () => {
      // Act
      service.createTask(mockNewTask).subscribe((task) => {
        // Assert
        expect(task).toEqual(expectedConvertedTask);
      });

      // Assert
      const req = httpRequests[0];
      expect(req.method).toBe('POST');
      expect(req.url).toBe(`${environment.apiUrl}/tasks`);
    });
  });

  describe('getTasks', () => {
    it('should return all tasks with formatted dueDate', () => {
      // Act
      service.getTasks().subscribe((tasks) => {
        // Assert
        expect(tasks).toEqual([expectedConvertedTask]);
      });

      // Assert
      const req = httpRequests[0];
      expect(req.method).toBe('GET');
      expect(req.url).toBe(`${environment.apiUrl}/tasks`);
    });
  });

  describe('updateTask', () => {
    it('should update a task', () => {
      // Act
      service.updateTask(mockTask).subscribe((task) => {
        // Assert
        expect(task).toEqual(mockTask);
      });

      // Assert
      const req = httpRequests[0];
      expect(req.method).toBe('PUT');
      expect(req.url).toBe(`${environment.apiUrl}/tasks/1`);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', () => {
      // Act
      service.deleteTask('1').subscribe((task) => {
        // Assert
        expect(task).toEqual(mockTask);
      });

      // Assert
      const req = httpRequests[0];
      expect(req.method).toBe('DELETE');
      expect(req.url).toBe(`${environment.apiUrl}/tasks/1`);
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors', (done: DoneFn) => {
      const errorInterceptor: HttpInterceptorFn = (
        req: HttpRequest<any>,
        next: HttpHandlerFn
      ) => {
        return throwError(
          () =>
            new HttpErrorResponse({
              error: 'Server error',
              status: 500,
              statusText: 'Server Error',
            })
        );
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          TaskService,
          { provide: DateService, useValue: stubDateService },
          provideHttpClient(withInterceptors([errorInterceptor])),
        ],
      });

      service = TestBed.inject(TaskService);

      service.getTasks().subscribe({
        next: () => {
          done.fail('Should have failed with 500 error');
        },
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
          done();
        },
      });
    });
  });
});
