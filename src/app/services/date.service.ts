import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  // Parse date to strip out local time zone setting
  parseDate(dateStr: string): Date {
    // Assume format yyyy-MM-dd
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
