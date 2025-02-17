import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskNewComponent } from './task-new.component';
import { By } from '@angular/platform-browser';

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

  it('should emit addNewTask with correct task on add button click', () => {
    const taskName = 'Test Task';
    const taskDate = '2023-12-31';
    spyOn(component.addNewTask, 'emit');

    const nameInput: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid="task-name-input"]')
    ).nativeElement;
    const dateInput: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-testid="due-date-input"]')
    ).nativeElement;
    nameInput.value = taskName;
    dateInput.value = taskDate;
    nameInput.dispatchEvent(new Event('input'));
    dateInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const addButton: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid="add-task-button"]')
    ).nativeElement;
    addButton.click();
    fixture.detectChanges();

    expect(component.addNewTask.emit).toHaveBeenCalledWith({
      name: taskName,
      dueDate: new Date(2023, 11, 31),
    });
  });

  it('should emit cancelSave on cancel button click', () => {
    spyOn(component.cancelSave, 'emit');
    const cancelButton: HTMLButtonElement = fixture.debugElement.query(
      By.css('[data-testid="cancel-button"]')
    ).nativeElement;
    cancelButton.click();
    fixture.detectChanges();
    expect(component.cancelSave.emit).toHaveBeenCalled();
  });
});
