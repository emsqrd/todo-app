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
import { By } from '@angular/platform-browser';
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
    ]);
    spy.getTasks.and.returnValue(of(mockTasks));
    spy.createTask.and.returnValue(of(mockTasks[0]));
    spy.deleteTask.and.returnValue(of({}));

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

  // Replace the dialog test with this updated version
  it('should open dialog when add task button is clicked', () => {
    // Arrange
    const addTaskButton = fixture.debugElement.query(By.css('.header__button'));
    const dialogElement = fixture.debugElement.query(By.css('.task-dialog'));

    // Act
    addTaskButton.triggerEventHandler('click');
    fixture.detectChanges();

    // Assert
    expect(dialogElement.nativeElement.hasAttribute('open')).toBeTrue();
  });

  // Update the cancel dialog test
  it('should close dialog when cancel is clicked', () => {
    // Arrange
    component.onAddTaskClick(); // Open the dialog first
    fixture.detectChanges();

    const cancelButton = fixture.debugElement.query(
      By.css('.task-dialog__button--secondary')
    );
    const dialogElement = fixture.debugElement.query(By.css('.task-dialog'));

    // Act
    cancelButton.triggerEventHandler('click');
    fixture.detectChanges();

    // Assert
    expect(dialogElement.nativeElement.hasAttribute('open')).toBeFalse();
  });

  it('should create new task when save is clicked', fakeAsync(() => {
    // Arrange
    const newTask = {
      name: 'New Task',
      dueDate: new Date(),
    };

    taskService.createTask.and.returnValue(of({ ...newTask, id: '3' }));

    // Act
    component.onSaveTaskClick(newTask.name, newTask.dueDate.toISOString());
    tick();

    // Assert
    expect(taskService.createTask).toHaveBeenCalledWith(newTask);
    expect(component.tasks.length).toBe(3);
  }));

  it('should delete task when delete is triggered', fakeAsync(() => {
    // Arrange
    component.ngOnInit();
    tick();
    expect(component.tasks).toEqual(mockTasks);

    // Act
    component.handleDeleteTask('1');
    tick();

    // Assert
    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].id).toBe('2');
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
});
