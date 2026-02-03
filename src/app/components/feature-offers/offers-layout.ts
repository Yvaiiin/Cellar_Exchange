import { Component, inject, signal, effect } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { OffersListComponent } from './offers-list';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-offers-layout',
  standalone: true,
  imports: [RouterOutlet, OffersListComponent, CommonModule],
  template: `
    <div class="flex h-full w-full relative">
      
      <div 
        class="w-full md:w-[450px] flex-shrink-0 h-full border-r border-gray-200 bg-slate-50 transition-transform"
        [class.hidden]="isDetailOpen() && isMobile"
      >
        <app-offers-list />
      </div>

      <div 
        class="flex-1 h-full overflow-hidden bg-white relative"
        [class.hidden]="!isDetailOpen() && isMobile"
      >
        <router-outlet />
      </div>

    </div>
  `
})
export class OffersLayoutComponent {
  private router = inject(Router);
  
  // États pour le responsive
  isDetailOpen = signal(false);
  isMobile = window.innerWidth < 768;

  constructor() {
    // Détecte si une offre est ouverte (URL contient un ID)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Si l'URL finale n'est pas juste "/app/offers", c'est qu'on a un détail
      const isRoot = this.router.url === '/app/offers' || this.router.url === '/app/offers/';
      this.isDetailOpen.set(!isRoot);
    });

    // Écouteur simple pour le resize (pour switching mobile/desktop à la volée)
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }
}