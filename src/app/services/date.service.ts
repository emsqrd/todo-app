import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  // Convert date string to ISO format for API
  convertToISO(dateStr: string | null): string | null {
    return dateStr ? new Date(dateStr).toISOString() : null;
  }

  // Convert to YYYY-MM-DD format for inputs
  convertToDateInput(isoString: string | null): string {
    return isoString ? new Date(isoString).toISOString().split('T')[0] : '';
  }
}
