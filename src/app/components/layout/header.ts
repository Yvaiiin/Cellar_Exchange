import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40 sticky top-0">
      
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-lg font-mono">W</div>
        <span class="font-bold text-gray-900 tracking-tight text-lg">
          WINE TRADING <span class="text-gray-400 font-normal text-sm">B2B</span>
        </span>
      </div>

      <div class="flex items-center gap-4">
        
        <div class="hidden md:block text-right leading-tight">
          <div class="text-sm font-bold text-gray-900">
            {{ auth.currentUser()?.name }}
          </div>
          <div class="text-xs text-gray-500 font-medium">
            {{ auth.currentUser()?.company }}
          </div>
        </div>
        
        <button 
          (click)="openModal()"
          class="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm hover:bg-slate-200 hover:border-slate-300 transition-all cursor-pointer"
        >
          {{ userInitials() }}
        </button>

      </div>
    </header>

    @if (showLogoutModal()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" (click)="closeModal()"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center animate-scale-in border border-gray-100">
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-5">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-2">Se déconnecter ?</h3>
          <p class="text-sm text-gray-500 mb-8 leading-relaxed">
            Vous retournerez à l'écran de sélection des profils.
          </p>
          <div class="space-y-3">
            <button (click)="logout()" class="w-full inline-flex justify-center rounded-lg bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition-colors">
              Confirmer la déconnexion
            </button>
            <button (click)="closeModal()" class="w-full inline-flex justify-center rounded-lg bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  `]
})
export class HeaderComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  showLogoutModal = signal(false);

  userInitials = computed(() => {
    const name = this.auth.currentUser()?.name;
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  });

  openModal() { this.showLogoutModal.set(true); }
  closeModal() { this.showLogoutModal.set(false); }

  logout() {
    this.closeModal();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}