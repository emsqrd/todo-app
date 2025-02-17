import { TestBed } from '@angular/core/testing';
import { DateService } from './date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService],
    });
    service = TestBed.inject(DateService);
  });

  it('should parse a valid date string', () => {
    const date = service.parseDate('2023-12-31');
    expect(date.getFullYear()).toBe(2023);
    expect(date.getMonth()).toBe(11);
    expect(date.getDate()).toBe(31);
  });

  it('should format a valid date into yyyy-MM-dd', () => {
    // Using Date.UTC to prevent local timezone shifts
    const testDate = new Date(Date.UTC(2023, 0, 1));
    const formatted = service.formatDate(testDate);
    expect(formatted).toBe('2023-01-01');
  });

  it('should return empty string when formatting a falsy date', () => {
    expect(service.formatDate(null as any)).toBe('');
    expect(service.formatDate(undefined as any)).toBe('');
  });
});
