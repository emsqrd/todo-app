import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';
import { DateService } from '../../services/date.service';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  const mockDateService = {
    parseDate: (dateStr: string) => new Date(dateStr),
  };

  const dummyTask = {
    id: '1',
    name: 'Test Task',
    dueDate: new Date('2020-01-01'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent],
      providers: [{ provide: DateService, useValue: mockDateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    // Set input and simulate change detection
    component.task = dummyTask;
    component.ngOnChanges({
      task: {
        currentValue: dummyTask,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form values when task input changes', () => {
    expect(component.taskForm.value.name).toBe(dummyTask.name);
    expect(component.taskForm.value.dueDate).toBe(
      new Date(dummyTask.dueDate).toISOString().substring(0, 10)
    );
  });

  it('should emit new task on form submit', () => {
    spyOn(component.updateTask, 'emit');
    // Set new values using reactive forms API
    const newTaskName = 'Updated Task';
    const newDueDate = '2020-03-03';
    component.taskForm.setValue({
      name: newTaskName,
      dueDate: newDueDate,
    });
    fixture.detectChanges();

    // Trigger submission
    component.submitTask();
    fixture.detectChanges();

    const expectedTask = {
      id: dummyTask.id,
      name: newTaskName,
      dueDate: mockDateService.parseDate(newDueDate),
    };

    expect(component.updateTask.emit).toHaveBeenCalledWith(expectedTask);
    // Verify that form has been reset
    expect(component.taskForm.value.name).toBe(null);
    expect(component.taskForm.value.dueDate).toBe(null);
  });

  it('should not emit updateTask when form is invalid', () => {
    spyOn(component.updateTask, 'emit');
    // Set form fields to empty values making the form invalid
    component.taskForm.setValue({ name: '', dueDate: '' });
    fixture.detectChanges();
    // Trigger submission
    component.submitTask();
    expect(component.updateTask.emit).not.toHaveBeenCalled();
  });

  it('should reset and mark form as pristine after submission', () => {
    // Set new valid values
    component.taskForm.setValue({ name: 'New Name', dueDate: '2020-05-05' });
    fixture.detectChanges();
    component.submitTask();
    fixture.detectChanges();

    // The form should be reset
    expect(component.taskForm.value.name).toBe(null);
    expect(component.taskForm.value.dueDate).toBe(null);
    expect(component.taskForm.pristine).toBeTrue();
  });

  it('should emit cancel event on cancelClick', () => {
    spyOn(component.cancelUpdateTask, 'emit');
    component.cancelClick();
    expect(component.cancelUpdateTask.emit).toHaveBeenCalled();
  });

  it('should update the form when task input changes via ngOnChanges', () => {
    const newTask = {
      id: '2',
      name: 'Another Task',
      dueDate: new Date('2021-12-12'),
    };

    component.task = newTask;
    component.ngOnChanges({
      task: {
        currentValue: newTask,
        previousValue: dummyTask,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();

    expect(component.taskForm.value.name).toBe(newTask.name);
    expect(component.taskForm.value.dueDate).toBe(
      new Date(newTask.dueDate).toISOString().substring(0, 10)
    );
  });

  it('should not update the form if task is null', () => {
    component.task = null as any;
    // Call ngOnChanges with an empty change for 'task'
    component.ngOnChanges({
      task: {
        currentValue: null,
        previousValue: dummyTask,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();

    // Expect the form to remain unchanged from previous valid state
    // Use the dummyTask's initial values, as they were initially patched
    expect(component.taskForm.value.name).toBe('Test Task');
    expect(component.taskForm.value.dueDate).toBe('2020-01-01');
  });

  it('should set dueDate to empty string if task.dueDate is falsy', () => {
    const taskWithoutDueDate = {
      id: '3',
      name: 'Task with no due date',
      dueDate: null as any,
    };

    component.task = taskWithoutDueDate;
    component.ngOnChanges({
      task: {
        currentValue: taskWithoutDueDate,
        previousValue: dummyTask,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();

    expect(component.taskForm.value.name).toBe(taskWithoutDueDate.name);
    expect(component.taskForm.value.dueDate).toBe('');
  });
});
