import { TestBed } from '@angular/core/testing';
import { LoadingStore } from './loading.store';

describe('LoadingStore', () => {
  let store: LoadingStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingStore],
    });
    store = TestBed.inject(LoadingStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should not be loading initially', () => {
    expect(store.isLoading()).toBeFalsy();
  });

  it('should start loading when request is added', () => {
    store.startLoading('request1');
    expect(store.isLoading()).toBeTruthy();
  });

  it('should stop loading when request is removed', () => {
    store.startLoading('request1');
    store.stopLoading('request1');
    expect(store.isLoading()).toBeFalsy();
  });

  it('should handle multiple concurrent requests', () => {
    store.startLoading('request1');
    store.startLoading('request2');
    expect(store.isLoading()).toBeTruthy();

    store.stopLoading('request1');
    expect(store.isLoading()).toBeTruthy();

    store.stopLoading('request2');
    expect(store.isLoading()).toBeFalsy();
  });

  it('should safely handle stopping non-existent requests', () => {
    store.stopLoading('nonexistent');
    expect(store.isLoading()).toBeFalsy();
  });
});
