import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// To avoid Angular's default messages in the console during development
console.log = () => {};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


