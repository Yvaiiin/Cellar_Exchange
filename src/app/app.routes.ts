import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login'; // Adapte selon tes dossiers
import { LayoutComponent } from './components/layout/layout'; // Ton layout global

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'app',
    loadComponent: () => import('./components/layout/layout').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'offers', pathMatch: 'full' },
      
      // OFFRES
      { 
        path: 'offers', 
        loadComponent: () => import('./components/feature-offers/offers-layout').then(m => m.OffersLayoutComponent),
        children: [
           { 
             path: ':id', 
             loadComponent: () => import('./components/feature-offers/offer-detail').then(m => m.OfferDetailComponent) 
           }
        ]
      },

      // --- NOUVELLE ROUTE : UTILISATEURS ---
      {
        path: 'users',
        loadComponent: () => import('./components/feature-users/users-list').then(m => m.UsersListComponent)
      }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];