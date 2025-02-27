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

  // Test configuration object for parameterized tests
  interface OperationConfig<T = Task | Task[]> {
    name: string;
    method: keyof TaskService;
    args: any[];
    expectedMethod: string;
    expectedUrl: string;
    expectedRequestId: string | RegExp;
    expectedBody?: any;
    expectedResponse: T;
  }

  // Test operation configurations
  const operations: OperationConfig[] = [
    {
      name: 'creates a new task',
      method: 'createTask',
      args: [mockNewTask],
      expectedMethod: 'POST',
      expectedUrl: `${environment.apiUrl}/tasks`,
      expectedRequestId: /create-task-\d+/,
      expectedBody: { ...mockNewTask, dueDate: 'iso-2020-01-01' },
      expectedResponse: expectedConvertedTask,
    },
    {
      name: 'retrieves tasks',
      method: 'getTasks',
      args: [],
      expectedMethod: 'GET',
      expectedUrl: `${environment.apiUrl}/tasks`,
      expectedRequestId: 'get-tasks',
      expectedResponse: [expectedConvertedTask],
    },
    {
      name: 'updates a task',
      method: 'updateTask',
      args: [mockTask],
      expectedMethod: 'PUT',
      expectedUrl: `${environment.apiUrl}/tasks/1`,
      expectedRequestId: 'update-task-1',
      expectedBody: { ...mockTask, dueDate: 'iso-2020-01-01' },
      expectedResponse: mockTask,
    },
    {
      name: 'deletes a task',
      method: 'deleteTask',
      args: ['1'],
      expectedMethod: 'DELETE',
      expectedUrl: `${environment.apiUrl}/tasks/1`,
      expectedRequestId: 'delete-task-1',
      expectedResponse: mockTask,
    },
  ];

  // Test factory for creating test instances
  function createTestInstance(useErrorInterceptor = false) {
    const httpRequests: HttpRequest<any>[] = [];
    const loadingStore = jasmine.createSpyObj<LoadingStore>([
      'startLoading',
      'stopLoading',
    ]);
    const consoleErrorSpy = spyOn(console, 'error');

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

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: DateService, useValue: stubDateService },
        { provide: LoadingStore, useValue: loadingStore },
        provideHttpClient(
          withInterceptors([
            useErrorInterceptor ? errorInterceptor : successInterceptor,
          ])
        ),
      ],
    });

    const service = TestBed.inject(TaskService);

    return { service, loadingStore, httpRequests, consoleErrorSpy };
  }

  describe('CRUD operations', () => {
    operations.forEach((op) => {
      it(`${op.name} with proper date formatting and loading state`, async () => {
        const { service, loadingStore, httpRequests } = createTestInstance();

        // Type assertion to help TypeScript understand this is a callable method with any args
        const methodCall = service[op.method] as (...args: any[]) => any;
        const result = await firstValueFrom(methodCall.apply(service, op.args));

        // Verify the response
        expect(result).toEqual(op.expectedResponse);

        // Verify loading state management
        expect(loadingStore.startLoading).toHaveBeenCalledWith(
          jasmine.stringMatching(op.expectedRequestId)
        );
        expect(loadingStore.stopLoading).toHaveBeenCalledWith(
          jasmine.stringMatching(op.expectedRequestId)
        );

        // Verify HTTP request properties
        const req = httpRequests[0];
        expect(req.method).toBe(op.expectedMethod);
        expect(req.url).toBe(op.expectedUrl);

        // Check body if applicable
        if (op.expectedBody) {
          expect(req.body.dueDate).toBe(op.expectedBody.dueDate);
        }
      });
    });
  });

  describe('Error handling', () => {
    operations.forEach((op) => {
      it(`handles HTTP errors when calling ${op.method}() while managing loading state`, async () => {
        const { service, loadingStore, consoleErrorSpy } =
          createTestInstance(true);

        try {
          // Type assertion to help TypeScript understand this is a callable method with any args
          const methodCall = service[op.method] as (...args: any[]) => any;
          await firstValueFrom(methodCall.apply(service, op.args));

          fail('Should have thrown an error');
        } catch (err: unknown) {
          if (!(err instanceof HttpErrorResponse)) {
            throw err;
          }

          expect(err.status).toBe(500);
          expect(err.statusText).toBe('Server Error');

          expect(loadingStore.startLoading).toHaveBeenCalledWith(
            jasmine.stringMatching(op.expectedRequestId)
          );
          expect(loadingStore.stopLoading).toHaveBeenCalledWith(
            jasmine.stringMatching(op.expectedRequestId)
          );

          // Construct error message based on operation
          const errorMessagePrefix =
            op.method === 'getTasks'
              ? 'Error fetching tasks:'
              : op.method === 'createTask'
              ? 'Error creating task:'
              : op.method === 'updateTask'
              ? 'Error updating task:'
              : 'Error deleting task:';

          expect(consoleErrorSpy).toHaveBeenCalledWith(errorMessagePrefix, err);
        }
      });
    });
  });
});
