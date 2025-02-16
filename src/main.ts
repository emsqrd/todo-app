import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { DatePipe } from '@angular/common';

bootstrapApplication(AppComponent, {
  providers: [DatePipe, ...appConfig.providers],
}).catch((err) => console.error(err));
