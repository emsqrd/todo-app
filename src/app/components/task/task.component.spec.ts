import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskComponent } from './task.component';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeEn);

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  const mockTask = {
    id: '1',
    name: 'Test Task',
    dueDate: '2024-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskComponent, DragDropModule],
      providers: [DatePipe, { provide: LOCALE_ID, useValue: 'en-US' }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Arrange & Act handled by beforeEach
    // Assert
    expect(component).toBeTruthy();
  });

  it('should display task name', () => {
    // Arrange - handled by beforeEach

    // Act
    const taskNameElement = fixture.debugElement.query(
      By.css('.task-list-item__name')
    );

    // Assert
    expect(taskNameElement.nativeElement.textContent.trim()).toBe('Test Task');
  });

  it('should display formatted due date', () => {
    // Arrange
    const datePipe = new DatePipe('en-US');
    const expectedDate = datePipe.transform(mockTask.dueDate, 'MMM d');

    // Act
    const dueDateElement = fixture.debugElement.query(
      By.css('.task-list-item__due-date')
    );

    // Assert
    expect(dueDateElement.nativeElement.textContent.trim()).toBe(expectedDate);
  });

  it('should emit deleteTask event when delete button is clicked', () => {
    // Arrange
    spyOn(component.deleteTask, 'emit');
    const deleteButton = fixture.debugElement.query(
      By.css('.task-list-item__delete')
    );
    const event = { stopPropagation: jasmine.createSpy('stopPropagation') };

    // Act
    deleteButton.triggerEventHandler('click', event);

    // Assert
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.deleteTask.emit).toHaveBeenCalledWith(mockTask.id);
  });

  it('should update body classes when drag starts', () => {
    // Arrange - handled by beforeEach

    // Act
    component.onDragStarted();

    // Assert
    expect(document.body.classList.contains('inheritCursors')).toBeTrue();
    expect(document.body.style.cursor).toBe('grabbing');
  });

  it('should have correct checkbox ID', () => {
    // Arrange - handled by beforeEach

    // Act
    const checkbox = fixture.debugElement.query(
      By.css('input[type="checkbox"]')
    );

    // Assert
    expect(checkbox.nativeElement.id).toBe('task-1');
  });

  it('should have drag handle with correct icon', () => {
    // Arrange - handled by beforeEach

    // Act
    const dragHandle = fixture.debugElement.query(
      By.css('.task-list-item__drag-handle i')
    );

    // Assert
    expect(
      dragHandle.nativeElement.classList.contains('fa-grip-vertical')
    ).toBeTrue();
  });

  it('should have delete button with correct icon', () => {
    // Arrange - handled by beforeEach

    // Act
    const deleteIcon = fixture.debugElement.query(
      By.css('.task-list-item__delete i')
    );

    // Assert
    expect(
      deleteIcon.nativeElement.classList.contains('fa-trash-can')
    ).toBeTrue();
  });

  it('should emit selectedTask event when task element is clicked', () => {
    spyOn(component.selectedTask, 'emit');
    const taskContent = fixture.debugElement.query(By.css('.task-list-item'));
    taskContent.triggerEventHandler('click', null);
    expect(component.selectedTask.emit).toHaveBeenCalledWith(mockTask);
  });

  it('should emit selectedTask event when onTaskClick is called directly', () => {
    spyOn(component.selectedTask, 'emit');
    component.onTaskClick();
    expect(component.selectedTask.emit).toHaveBeenCalledWith(mockTask);
  });
});
