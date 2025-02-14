import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { TaskComponent } from '../task/task.component';
import { of } from 'rxjs';
import { Task } from '../../models/task';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ElementRef, NgZone } from '@angular/core';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  const mockTasks: Task[] = [
    { id: '1', name: 'Test Task 1', dueDate: new Date() },
    { id: '2', name: 'Test Task 2', dueDate: new Date() },
  ];

  beforeEach(async () => {
    // Arrange
    const spy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'createTask',
      'deleteTask',
      'updateTask',
    ]);
    spy.getTasks.and.returnValue(of(mockTasks));
    spy.createTask.and.returnValue(of(mockTasks[0]));
    spy.deleteTask.and.returnValue(of({}));
    spy.updateTask.and.returnValue(of(mockTasks[0])); // default behavior

    await TestBed.configureTestingModule({
      imports: [TaskListComponent, TaskComponent, DragDropModule],
      providers: [{ provide: TaskService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    fixture.detectChanges(); // Add this line to trigger initial detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', fakeAsync(() => {
    // Act
    component.ngOnInit();
    tick();

    // Assert
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(mockTasks);
  }));

  it('should handle drag and drop correctly', () => {
    // Arrange
    component.tasks = [...mockTasks];

    const mockDragRef = {
      isDragging: () => true,
      reset: () => {},
      disabled: false,
    };

    const mockDrag = {
      data: mockTasks[0],
      dropContainer: null!,
      element: new ElementRef(document.createElement('div')),
      _dragRef: mockDragRef,
      _handles: [],
      _ngZone: TestBed.inject(NgZone),
      _viewContainerRef: null!,
      _dir: null!,
      _changeDetectorRef: null!,
      dropPoint: { x: 0, y: 0 },
      getPlaceholderElement: () => document.createElement('div'),
      getRootElement: () => document.createElement('div'),
      reset: () => {},
    };

    const dropEvent: CdkDragDrop<Task[]> = {
      previousIndex: 0,
      currentIndex: 1,
      item: mockDrag as any,
      container: null!,
      previousContainer: null!,
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 },
      dropPoint: { x: 0, y: 0 },
      event: new MouseEvent('drop'),
    };

    // Act
    component.onDrop(dropEvent);

    // Assert
    expect(component.tasks[0].id).toBe('2');
    expect(component.tasks[1].id).toBe('1');
    expect(
      component.bodyElement.classList.contains('inheritCursors')
    ).toBeFalse();
  });

  it('should open add task modal when onAddTaskClick is called', () => {
    component.onAddTaskClick();
    expect(component.showAddTaskModal).toBeTrue();
  });

  it('should close add task modal when onNewTaskModalClose is called', () => {
    component.showAddTaskModal = true;
    component.onNewTaskModalClose();
    expect(component.showAddTaskModal).toBeFalse();
  });

  it('should open task detail modal and set selectedTask when onTaskSelect is called', () => {
    const task = mockTasks[0];
    component.onTaskSelect(task);
    expect(component.selectedTask).toEqual(task);
    expect(component.isTaskDetailModalOpen).toBeTrue();
  });

  it('should update task when onTaskDetailSaveClick is called', fakeAsync(() => {
    const updatedTask: Task = { ...mockTasks[0], name: 'Updated Task' };
    taskService.updateTask.and.returnValue(of(updatedTask));
    component.tasks = [mockTasks[0]];
    component.onTaskDetailSaveClick(updatedTask);
    tick();
    expect(taskService.updateTask).toHaveBeenCalledWith(updatedTask);
    expect(component.tasks[0]).toEqual(updatedTask);
    expect(component.isTaskDetailModalOpen).toBeFalse();
  }));

  it('should add new task when onSaveTaskClick is called', fakeAsync(() => {
    const newTask: Omit<Task, 'id'> = { name: 'New Task', dueDate: new Date() };
    const createdTask: Task = {
      id: '3',
      name: 'New Task',
      dueDate: new Date(),
    };
    taskService.createTask.and.returnValue(of(createdTask));
    const initialLength = component.tasks.length;
    component.onSaveTaskClick(newTask);
    tick();
    expect(taskService.createTask).toHaveBeenCalledWith(newTask);
    expect(component.tasks.length).toBe(initialLength + 1);
    expect(component.tasks.find((task) => task.id === createdTask.id)).toEqual(
      createdTask
    );
    expect(component.showAddTaskModal).toBeFalse();
  }));

  it('should display empty state message when there are no tasks', () => {
    component.tasks = [];
    fixture.detectChanges();
    const emptyMessageEl: HTMLElement =
      fixture.nativeElement.querySelector('.task-list--empty');
    expect(emptyMessageEl).toBeTruthy();
    expect(emptyMessageEl.textContent?.trim()).toBe(
      'Add a task to get started'
    );
  });

  it('should open add task modal when add task button is clicked', () => {
    const addButton: HTMLElement =
      fixture.nativeElement.querySelector('.header__button');
    addButton.click();
    fixture.detectChanges();
    expect(component.showAddTaskModal).toBeTrue();
    const modalEl: HTMLElement =
      fixture.nativeElement.querySelector('app-modal');
    expect(modalEl).toBeTruthy();
  });

  it('should delete a task when handleDeleteTask is called', fakeAsync(() => {
    // Arrange
    component.tasks = [...mockTasks];
    // Act
    component.handleDeleteTask(mockTasks[0].id);
    tick();
    // Assert
    expect(taskService.deleteTask).toHaveBeenCalledWith(mockTasks[0].id);
    expect(
      component.tasks.find((task) => task.id === mockTasks[0].id)
    ).toBeUndefined();
  }));
});
