import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../models/task';
import { LoadingStore } from '../stores/loading.store';
import { DateService } from './date.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let loadingStore: jasmine.SpyObj<LoadingStore>;
  let consoleErrorSpy: jasmine.Spy;
  let httpRequests: HttpRequest<any>[] = [];

  // Test data
  const mockTask: Task = {
    id: '1',
    name: 'Test Task',
    dueDate: '2020-01-01',
  };

  const mockNewTask: Omit<Task, 'id'> = {
    name: 'New Task',
    dueDate: '2020-01-01',
  };

  const expectedConvertedTask: Task = {
    ...mockTask,
    dueDate: 'converted-2020-01-01',
  };

  // Service stubs
  const stubDateService = {
    convertToDateInput: (date: string) => `converted-${date}`,
    convertToISO: (date: string) => `iso-${date}`,
  };

  const successInterceptor: HttpInterceptorFn = (req: HttpRequest<any>) => {
    httpRequests.push(req);
    const response = req.method === 'GET' ? [mockTask] : mockTask;
    return of(new HttpResponse({ body: response }));
  };

  const errorInterceptor: HttpInterceptorFn = () => {
    return throwError(
      () =>
        new HttpErrorResponse({
          error: 'Server error',
          status: 500,
          statusText: 'Server Error',
        })
    );
  };

  beforeEach(() => {
    httpRequests = [];
    loadingStore = jasmine.createSpyObj('LoadingStore', [
      'startLoading',
      'stopLoading',
    ]);
    consoleErrorSpy = spyOn(console, 'error');
  });

  function setupTestBed(interceptor: HttpInterceptorFn = successInterceptor) {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: DateService, useValue: stubDateService },
        { provide: LoadingStore, useValue: loadingStore },
        provideHttpClient(withInterceptors([interceptor])),
      ],
    });

    service = TestBed.inject(TaskService);
  }

  describe('CRUD operations', () => {
    beforeEach(() => setupTestBed());

    it('creates a new task with proper date formatting and loading state', async () => {
      const task = await firstValueFrom(service.createTask(mockNewTask));

      expect(task).toEqual(expectedConvertedTask);
      expect(loadingStore.startLoading).toHaveBeenCalledWith(
        jasmine.stringMatching(/create-task-\d+/)
      );
      expect(loadingStore.stopLoading).toHaveBeenCalledWith(
        jasmine.stringMatching(/create-task-\d+/)
      );

      const req = httpRequests[0];
      expect(req.method).toBe('POST');
      expect(req.url).toBe(`${environment.apiUrl}/tasks`);
      expect(req.body.dueDate).toBe('iso-2020-01-01');
    });

    it('retrieves tasks with proper date formatting and loading state', async () => {
      const tasks = await firstValueFrom(service.getTasks());

      expect(tasks).toEqual([expectedConvertedTask]);
      expect(loadingStore.startLoading).toHaveBeenCalledWith('get-tasks');
      expect(loadingStore.stopLoading).toHaveBeenCalledWith('get-tasks');

      const req = httpRequests[0];
      expect(req.method).toBe('GET');
      expect(req.url).toBe(`${environment.apiUrl}/tasks`);
    });

    it('updates a task with proper date formatting and loading state', async () => {
      const task = await firstValueFrom(service.updateTask(mockTask));

      expect(task).toEqual(mockTask);
      expect(loadingStore.startLoading).toHaveBeenCalledWith(
        `update-task-${mockTask.id}`
      );
      expect(loadingStore.stopLoading).toHaveBeenCalledWith(
        `update-task-${mockTask.id}`
      );

      const req = httpRequests[0];
      expect(req.method).toBe('PUT');
      expect(req.url).toBe(`${environment.apiUrl}/tasks/1`);
      expect(req.body.dueDate).toBe('iso-2020-01-01');
    });

    it('deletes a task and manages loading state', async () => {
      const task = await firstValueFrom(service.deleteTask('1'));

      expect(task).toEqual(mockTask);
      expect(loadingStore.startLoading).toHaveBeenCalledWith('delete-task-1');
      expect(loadingStore.stopLoading).toHaveBeenCalledWith('delete-task-1');

      const req = httpRequests[0];
      expect(req.method).toBe('DELETE');
      expect(req.url).toBe(`${environment.apiUrl}/tasks/1`);
    });
  });

  describe('Error handling', () => {
    beforeEach(() => setupTestBed(errorInterceptor));

    it('handles HTTP errors while managing loading state', async () => {
      try {
        await firstValueFrom(service.getTasks());
        fail('Should have thrown an error');
      } catch (err: unknown) {
        if (!(err instanceof HttpErrorResponse)) {
          throw err;
        }

        expect(err.status).toBe(500);
        expect(err.statusText).toBe('Server Error');
        expect(loadingStore.startLoading).toHaveBeenCalledWith('get-tasks');
        expect(loadingStore.stopLoading).toHaveBeenCalledWith('get-tasks');
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching tasks:',
          err
        );
      }
    });
  });
});
