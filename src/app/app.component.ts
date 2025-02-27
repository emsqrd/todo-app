import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoadingStore } from './stores/loading.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskListComponent, LoaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly loadingStore = inject(LoadingStore);
}
