import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  const dummyTask = {
    id: '1',
    name: 'Test Task',
    description: 'Test description',
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
    expect(component.taskForm.value.name).toBe(dummyTask.name);
    expect(component.taskForm.value.description).toBe(dummyTask.description);
    expect(component.taskForm.value.dueDate).toBe(dummyTask.dueDate);
  });

  it('should emit updated task on form submit', () => {
    spyOn(component.updateTask, 'emit');

    const updatedName = 'Updated Task';
    const updatedDescription = 'Updated description';
    const updatedDueDate = '2020-03-03';

    component.taskForm.setValue({
      name: updatedName,
      description: updatedDescription,
      dueDate: updatedDueDate,
    });

    fixture.detectChanges();

    component.submitTask();
    fixture.detectChanges();

    const expectedTask = {
      id: dummyTask.id,
      name: updatedName,
      description: updatedDescription,
      dueDate: updatedDueDate,
    };

    expect(component.updateTask.emit).toHaveBeenCalledWith(expectedTask);
  });

  it('should not emit updateTask when form validation fails', () => {
    spyOn(component.updateTask, 'emit');

    component.taskForm.setErrors({ invalid: true });
    component.taskForm.markAllAsTouched();

    fixture.detectChanges();

    component.submitTask();

    expect(component.updateTask.emit).not.toHaveBeenCalled();
  });

  it('should not emit updateTask when name is empty', () => {
    spyOn(component.updateTask, 'emit');

    const nameInput = component.taskForm.get('name');
    nameInput?.setErrors({ required: true });
    nameInput?.markAsTouched();

    fixture.detectChanges();

    component.submitTask();

    expect(component.updateTask.emit).not.toHaveBeenCalled();
  });

  it('should reset and mark form as pristine after submission', () => {
    component.taskForm.setValue({
      name: 'New Name',
      description: 'New description',
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
      description: 'Another description',
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

    expect(component.taskForm.value.name).toBe(newTask.name);
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

    expect(component.taskForm.value.name).toBe('Test Task');
    expect(component.taskForm.value.dueDate).toBe('2024-01-01');
  });

  it('should set dueDate to empty string if task.dueDate is falsy', () => {
    const taskWithoutDueDate = {
      id: '3',
      name: 'Task with no due date',
      description: 'No due date',
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
