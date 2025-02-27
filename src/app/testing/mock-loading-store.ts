import { signal } from '@angular/core';
import { LoadingStore } from '../stores/loading.store';

export class MockLoadingStore implements Partial<LoadingStore> {
  isLoading = signal(false);

  startLoading = jasmine.createSpy('startLoading');
  stopLoading = jasmine.createSpy('stopLoading');

  setIsLoading(value: boolean) {
    this.isLoading.set(value);
  }
}
