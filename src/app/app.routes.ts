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
      {
        // Usa el mismo componente/diseño que ensenada, puebla y ciudad-de-mexico
        // (ver src/app/features/city/city.component.ts). El componente dedicado
        // anterior (HermosilloComponent, con formulario de registro) quedó sin
        // usar — su código no se borró, solo se comentó (ver ese archivo).
        path: 'hermosillo',
        loadComponent: () => import('./features/city/city.component').then(m => m.CityComponent)
      },
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
    path: '**',
    redirectTo: '/404'
  }
];
