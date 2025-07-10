import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { TermsComponent } from './components/pages/terms/terms.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'terms', component: TermsComponent, title: 'Términos y Condiciones' }
];
