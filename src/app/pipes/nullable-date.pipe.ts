import { Pipe, PipeTransform, inject } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'nullableDate',
  standalone: true,
})
export class NullableDatePipe implements PipeTransform {
  private datePipe = inject(DatePipe);

  transform(value: Date | null, format: string = 'mediumDate'): string {
    if (!value) return '';
    // const d = new Date(value);
    // if (isNaN(d.getTime())) return '';
    return this.datePipe.transform(value, format) || '';
  }
}
