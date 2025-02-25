import { computed, Injectable, signal } from '@angular/core';

interface LoadingState {
  activeRequests: Set<string>;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingStore {
  private state = signal<LoadingState>({
    activeRequests: new Set<string>(), // Tracks individual requests
  });

  readonly isLoading = computed(() => {
    const isCurrentlyLoading = this.state().activeRequests.size > 0;
    console.debug(
      'Loading state:',
      isCurrentlyLoading,
      'Active requests:',
      Array.from(this.state().activeRequests)
    );
    return isCurrentlyLoading;
  });

  startLoading(requestId: string) {
    // Each request has unique identifier
    console.debug('Starting loading:', requestId);
    this.state.update((state) => ({
      ...state,
      activeRequests: new Set(state.activeRequests).add(requestId),
    }));
  }

  stopLoading(requestId: string) {
    console.debug('Stopping loading:', requestId);
    this.state.update((state) => {
      const newRequests = new Set(state.activeRequests);
      newRequests.delete(requestId);
      return {
        ...state,
        activeRequests: newRequests,
      };
    });
  }
}
