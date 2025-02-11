import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), TaskService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render app-task-list', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const taskListElement = fixture.debugElement.query(By.css('app-task-list'));
    expect(taskListElement).toBeTruthy();
  });
});
