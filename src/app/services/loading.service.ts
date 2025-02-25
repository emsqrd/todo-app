import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCount = 0; // Simple numeric counter
  readonly loading = signal(false); // Single boolean state

  startLoading() {
    // No way to identify which request is loading
    this.loadingCount++;
    this.loading.set(true);
  }

  stopLoading() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.loading.set(false);
    }
  }
}
