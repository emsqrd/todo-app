import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateService } from '../../services/date.service';

import { TaskDetailComponent } from './task-detail.component';

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
    component.task = dummyTask; // assign dummy task
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit new task on saveTask', () => {
    spyOn(component.handleSaveClick, 'emit');
    // Simulate user input by querying the DOM
    const compiled = fixture.nativeElement as HTMLElement;
    const nameInput = compiled.querySelector(
      'input[placeholder="Task name"]'
    ) as HTMLInputElement;
    const dateInput = compiled.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement;
    const saveButton = compiled.querySelector(
      'button.task-detail__button--primary'
    ) as HTMLButtonElement;

    // Set new values
    const newTaskName = 'Updated Task';
    const newDueDate = '2020-03-03';
    nameInput.value = newTaskName;
    dateInput.value = newDueDate;
    nameInput.dispatchEvent(new Event('input'));
    dateInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Click the save button
    saveButton.click();
    fixture.detectChanges();

    const expectedTask = {
      id: dummyTask.id,
      name: newTaskName,
      dueDate: mockDateService.parseDate(newDueDate),
    };

    expect(component.handleSaveClick.emit).toHaveBeenCalledWith(expectedTask);
    expect(nameInput.value).toBe('');
    expect(dateInput.value).toBe('');
  });

  it('should emit cancel event on cancelClick', () => {
    spyOn(component.handleCancelClick, 'emit');
    component.cancelClick();
    expect(component.handleCancelClick.emit).toHaveBeenCalledWith();
  });
});
