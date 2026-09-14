import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: { title: 'Dinner In The Sky' }
      },
      {
        path: 'ensenada',
        loadComponent: () => import('./features/city/city.component').then(m => m.CityComponent)
      },
      {
        path: 'puebla',
        loadComponent: () => import('./features/city/city.component').then(m => m.CityComponent)
      },
      {
        path: 'ciudad-de-mexico',
        loadComponent: () => import('./features/city/city.component').then(m => m.CityComponent)
      },
      // 'hermosillo' ya NO vive aquí (ver ruta top-level más abajo, fuera de
      // LayoutComponent) — se comenta en vez de borrar, mismo criterio que
      // con HermosilloComponent antes:
      // {
      //   path: 'hermosillo',
      //   loadComponent: () => import('./features/city/city.component').then(m => m.CityComponent)
      // },
      {
        path: 'faq',
        loadComponent: () => import('./features/faq/faq.component').then(m => m.FAQComponent)
      },
      {
        path: 'gracias',
        loadComponent: () => import('./features/gracias/gracias.component').then(m => m.GraciasComponent)
      },
      {
        path: '404',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
      }
    ]
  },
  {
    // Landing dedicado de una sola ciudad (mismo diseño/estructura que el
    // repo "Dinner in the Sky Mexico Tijuana" — LandingTijuanaComponent),
    // replicado para Hermosillo a pedido explícito. Va FUERA de
    // LayoutComponent a propósito: LandingHermosilloComponent trae su propio
    // header/footer (tj-header/tj-footer) — anidarlo bajo LayoutComponent
    // duplicaría header/footer/botón de WhatsApp del sitio. Reemplaza la
    // página anterior de Hermosillo (CityComponent, arriba comentada); el
    // resto del sitio (home multi-ciudad, Ensenada/Puebla/CDMX) no cambia.
    path: 'hermosillo',
    loadComponent: () => import('./features/landing-hermosillo/landing-hermosillo.component').then(m => m.LandingHermosilloComponent),
    data: { title: 'Dinner In The Sky — Hermosillo' }
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];
