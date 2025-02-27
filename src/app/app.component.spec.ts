import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { TaskService } from './services/task.service';
import { LoadingStore } from './stores/loading.store';
import { MockLoadingStore } from './testing/mock-loading-store';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loadingStore: MockLoadingStore;
  let taskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    loadingStore = new MockLoadingStore();

    taskService = jasmine.createSpyObj('TaskService', ['getTasks']);
    taskService.getTasks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: LoadingStore, useValue: loadingStore },
        { provide: TaskService, useValue: taskService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should always display the task list component', () => {
    const taskListElement = fixture.debugElement.query(By.css('app-task-list'));
    expect(taskListElement).toBeTruthy();
  });

  it('should show loader when loading state is true', () => {
    // Arrange
    loadingStore.setIsLoading(true);

    // Act
    fixture.detectChanges();

    // Assert
    const loaderElement = fixture.debugElement.query(By.css('app-loader'));
    expect(loaderElement).toBeTruthy();
  });

  it('should hide loader when loading state is false', () => {
    // Arrange
    loadingStore.setIsLoading(false);

    // Act
    fixture.detectChanges();

    // Assert
    const loaderElement = fixture.debugElement.query(By.css('app-loader'));
    expect(loaderElement).toBeFalsy();
  });

  it('should render router outlet', () => {
    const routerOutletElement = fixture.debugElement.query(
      By.css('router-outlet')
    );
    expect(routerOutletElement).toBeTruthy();
  });
});
