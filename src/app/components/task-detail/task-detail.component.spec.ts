import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  const dummyTask = {
    id: '1',
    name: 'Test Task',
    dueDate: '2024-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailComponent],
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

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should patch form values when task input changes', () => {
    expect(component.taskForm.value.taskName).toBe(dummyTask.name);
    expect(component.taskForm.value.dueDate).toBe(dummyTask.dueDate);
  });

  it('should emit new task on form submit', () => {
    spyOn(component.updateTask, 'emit');
    const newTaskName = 'Updated Task';
    const newDueDate = '2020-03-03';

    component.taskForm.setValue({
      taskName: newTaskName,
      dueDate: newDueDate,
    });
    fixture.detectChanges();

    component.submitTask();
    fixture.detectChanges();

    const expectedTask = {
      id: dummyTask.id,
      name: newTaskName,
      dueDate: newDueDate,
    };

    expect(component.updateTask.emit).toHaveBeenCalledWith(expectedTask);
  });

  it('should not emit updateTask when form is invalid', () => {
    spyOn(component.updateTask, 'emit');
    component.taskForm.setValue({ taskName: '', dueDate: '' });
    fixture.detectChanges();
    component.submitTask();
    expect(component.updateTask.emit).not.toHaveBeenCalled();
  });

  it('should reset and mark form as pristine after submission', () => {
    component.taskForm.setValue({
      taskName: 'New Name',
      dueDate: '2020-05-05',
    });
    fixture.detectChanges();
    component.submitTask();
    fixture.detectChanges();

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
      dueDate: '2021-12-12',
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

    expect(component.taskForm.value.taskName).toBe(newTask.name);
    expect(component.taskForm.value.dueDate).toBe(
      new Date(newTask.dueDate).toISOString().substring(0, 10)
    );
  });

  it('should not update the form if task is null', () => {
    component.task = null as any;
    component.ngOnChanges({
      task: {
        currentValue: null,
        previousValue: dummyTask,
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    fixture.detectChanges();

    expect(component.taskForm.value.taskName).toBe('Test Task');
    expect(component.taskForm.value.dueDate).toBe('2024-01-01');
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

    expect(component.taskForm.value.taskName).toBe(taskWithoutDueDate.name);
    expect(component.taskForm.value.dueDate).toBe('');
  });
});
