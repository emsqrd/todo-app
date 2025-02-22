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

  it('should return empty string when formatting a falsy date', () => {
    expect(service.convertToDateInput(null as any)).toBe('');
    expect(service.convertToDateInput(undefined as any)).toBe('');
  });

  it('should convert a valid date string to ISO format', () => {
    const validDate = '2023-01-01';
    const expectedISO = new Date(validDate).toISOString();
    expect(service.convertToISO(validDate)).toBe(expectedISO);
  });

  it('should return null when converting a null date string', () => {
    expect(service.convertToISO(null)).toBeNull();
  });

  it('should convert a valid ISO string to YYYY-MM-DD format', () => {
    const isoString = '2023-01-01T00:00:00.000Z';
    expect(service.convertToDateInput(isoString)).toBe('2023-01-01');
  });
});
