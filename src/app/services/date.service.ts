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

  // Format date as yyyy-MM-dd
  formatDate(date: Date): string {
    if (!date) return '';

    const validDate = date instanceof Date ? date : new Date(date);
    return validDate.toISOString().substring(0, 10);
  }
}
