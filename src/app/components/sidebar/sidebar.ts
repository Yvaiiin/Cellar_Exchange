import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="w-60 bg-[#181818] text-white flex flex-col h-full border-r border-slate-800 shrink-0 font-sans">
      
      <nav class="flex-1 px-2 py-4 space-y-6">
        
        <div>
            <p class="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Données</p>
            
            <a 
              routerLink="/app/offers" 
              routerLinkActive="bg-slate-800/50 text-white shadow-sm ring-1 ring-white/5" 
              class="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
            >
              <svg class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {{ auth.isSeller() ? 'Mon Stock' : 'Offres & Demandes' }}
            </a>
        </div>

        @if (auth.isAdmin()) {
          <div>
            <p class="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Administration</p>
            
            <a 
              routerLink="/app/users" 
              routerLinkActive="bg-slate-800/50 text-white shadow-sm ring-1 ring-white/5" 
              class="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all group"
            >
              <svg class="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Utilisateurs
            </a>
          </div>
        }

      </nav>

    </aside>
  `
})
export class SidebarComponent {
  auth = inject(AuthService);
}