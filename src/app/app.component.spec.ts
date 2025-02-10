import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TaskListComponent } from './components/task-list/task-list.component';
import { Component } from '@angular/core';

// Create stub component to avoid loading actual TaskListComponent
@Component({
  selector: 'app-task-list',
  template: '',
})
class TaskListStubComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet],
      declarations: [TaskListStubComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render task-list component', () => {
    const taskListElement = fixture.debugElement.query(
      By.directive(TaskListStubComponent)
    );
    expect(taskListElement).toBeTruthy();
  });

  it('should contain router-outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });

  it('should have main element with correct class', () => {
    const mainElement = fixture.debugElement.query(By.css('main.main'));
    expect(mainElement).toBeTruthy();
  });
});
