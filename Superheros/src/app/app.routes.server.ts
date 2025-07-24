import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server
  },
  {
    path: 'terms',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**', // Otras rutas
    renderMode: RenderMode.Server
  }
];
