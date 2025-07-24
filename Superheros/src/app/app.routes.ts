import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { TermsComponent } from './components/pages/terms/terms.component';
import { MetaResolver } from '../resolvers/meta-resolver';

export const routes: Routes = [
  { path: '',
    component: HomeComponent,
    title: 'Home',
    data: {
      description: 'This is our Home Page',
      robots: 'index, follow',
      ogTitle: 'Superheroes Home Page',
      ogDescription: 'Discover our Superheroes Home Page',
      ogImage: '../../public/assets/superhero_header.png',
      ogUrl: 'http://localhost:4200/'
    },
    resolve: {
      meta: MetaResolver
    }
  },
  { path: 'terms',
    component: TermsComponent,
    title: 'Términos y Condiciones',
    data: {
      description: 'This is our Terms Page',
      robots: 'index, follow', // También se puede poner noindex, nofollow
      // No nos interesan los og aquí
    },
    resolve: {
      meta: MetaResolver
    }
  }
];
