import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskNewComponent } from './task-new.component';

describe('TaskNewComponent', () => {
  let component: TaskNewComponent;
  let fixture: ComponentFixture<TaskNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit handleSaveClick with correct task and clear inputs on add button click', () => {
    const taskName = 'Test Task';
    const taskDate = '2023-12-31';
    spyOn(component.handleSaveClick, 'emit');

    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[placeholder="Task name"]'
    );
    const dateInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[aria-label="Due date"]'
    );
    nameInput.value = taskName;
    dateInput.value = taskDate;
    nameInput.dispatchEvent(new Event('input'));
    dateInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const addButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button.task-new__button--primary'
    );
    addButton.click();
    fixture.detectChanges();

    expect(component.handleSaveClick.emit).toHaveBeenCalledWith({
      name: taskName,
      dueDate: new Date(2023, 11, 31),
    });
    expect(nameInput.value).toBe('');
    expect(dateInput.value).toBe('');
  });

  it('should emit handleCancelClick on cancel button click', () => {
    spyOn(component.handleCancelClick, 'emit');
    const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button.task-new__button--secondary'
    );
    cancelButton.click();
    fixture.detectChanges();
    expect(component.handleCancelClick.emit).toHaveBeenCalled();
  });
});
