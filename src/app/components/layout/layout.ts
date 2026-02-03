import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { HeaderComponent } from './header';
import { AuthService } from '../../services/auth.service'; // <--- Import du Service

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden">
      
      @if (auth.isAdmin()) {
        <app-sidebar class="shrink-0 h-full" />
      }

      <div class="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        <app-header class="shrink-0" />

        <main class="flex-1 overflow-auto relative">
           <router-outlet />
        </main>
      </div>

    </div>
  `
})
export class LayoutComponent {
  auth = inject(AuthService); // <--- Injection pour vérifier le rôle
}