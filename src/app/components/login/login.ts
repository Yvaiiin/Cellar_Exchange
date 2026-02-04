import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4 font-sans">
      
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-10 h-10 bg-slate-900 text-white font-bold text-lg rounded mb-3 shadow-sm">CE</div>
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">CELLAR EXCHANGE <span class="text-slate-400 font-normal text-sm"> BETA</span></h1>
        <p class="text-xs text-gray-400 mt-1 uppercase tracking-widest">Sélection du profil</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full">
        
        <div 
          (click)="login('VENDEUR')" 
          class="group relative bg-white border border-gray-200 p-5 rounded-lg hover:border-slate-900 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col h-full"
        >
            <div class="flex justify-between items-start mb-3">
                <div class="p-2 bg-gray-50 rounded-md border border-gray-100 group-hover:bg-slate-50 transition-colors">
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <span class="text-[10px] font-mono text-gray-400">USER_2</span>
            </div>

            <h3 class="text-sm font-bold text-slate-900 mb-0.5">Vendeur</h3>
            <p class="text-xs text-gray-500 mb-4">Courtier</p>
            
            <div class="flex-1 space-y-3 pt-4 border-t border-gray-100 border-dashed">
                <div class="flex gap-3">
                    <div class="w-0.5 h-full bg-slate-200 rounded-full shrink-0"></div>
                    <div>
                        <p class="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-0.5">Vente</p>
                        <p class="text-xs text-gray-500 leading-relaxed">
                            Pilotage autonome des offres de vente.<br>
                            Visibilité exclusive sur la Place de Bordeaux. <br>
                            Anonymat garanti.</p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="w-0.5 h-full bg-slate-200 rounded-full shrink-0"></div>
                    <div>
                        <p class="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-0.5">Opportunités</p>
                        <p class="text-xs text-gray-500 leading-relaxed">Réponse directe aux demandes d'achat.</p>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 duration-200">
                <span class="text-xs font-bold text-slate-900 flex items-center gap-1">
                    Accéder <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
            </div>
        </div>

        <div 
          (click)="login('ACHETEUR')" 
          class="group relative bg-white border border-gray-200 p-5 rounded-lg hover:border-slate-900 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col h-full"
        >
            <div class="flex justify-between items-start mb-3">
                <div class="p-2 bg-gray-50 rounded-md border border-gray-100 group-hover:bg-slate-50 transition-colors">
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <span class="text-[10px] font-mono text-gray-400">USER_3</span>
            </div>

            <h3 class="text-sm font-bold text-slate-900 mb-0.5">Acheteur</h3>
            <p class="text-xs text-gray-500 mb-4">Négociant</p>
            
            <div class="flex-1 space-y-3 pt-4 border-t border-gray-100 border-dashed">
                <div class="flex gap-3">
                    <div class="w-0.5 h-full bg-slate-200 rounded-full shrink-0"></div>
                    <div>
                        <p class="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-0.5">Sourcing Global</p>
                        <p class="text-xs text-gray-500 leading-relaxed">
                            Accès au catalogue des offres en temps réel.<br>
                            Possibilité de se positionner sur des offres.<br>
                            Export PDF des offres (marque blanche).<br>
                            Anonymat garanti.</p>
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="w-0.5 h-full bg-slate-200 rounded-full shrink-0"></div>
                    <div>
                        <p class="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-0.5">Recherche Active</p>
                        <p class="text-xs text-gray-500 leading-relaxed">Recherche de lots spécifiques.</p>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 duration-200">
                <span class="text-xs font-bold text-slate-900 flex items-center gap-1">
                    Accéder <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
            </div>
        </div>

        <div 
          (click)="login('ADMIN')" 
          class="group relative bg-white border border-gray-200 p-5 rounded-lg hover:border-red-800 hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col h-full opacity-70 hover:opacity-100"
        >
            <div class="flex justify-between items-start mb-3">
                <div class="p-2 bg-gray-50 rounded-md border border-gray-100 group-hover:bg-red-50 transition-colors">
                    <svg class="w-5 h-5 text-gray-400 group-hover:text-red-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <span class="text-[10px] font-mono text-gray-400">USER_1</span>
            </div>

            <h3 class="text-sm font-bold text-slate-900 mb-0.5">Administrateur</h3>
            <p class="text-xs text-gray-500 mb-4">Cellar Exchange</p>
            
            <div class="flex-1 space-y-3 pt-4 border-t border-gray-100 border-dashed">
                
                <div class="flex gap-3">
                    <div class="w-0.5 h-full bg-red-100 rounded-full shrink-0"></div>
                    <div>
                        <p class="text-[11px] font-bold text-red-800 uppercase tracking-wide mb-0.5">Système</p>
                        <p class="text-xs text-gray-500 leading-relaxed">Gestion des utilisateurs. <br> Maintenance plateforme.</p>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 duration-200">
                <span class="text-xs font-bold text-red-800 flex items-center gap-1">
                    Accéder <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </span>
            </div>
        </div>

      </div>
      
      <div class="mt-8 text-[10px] text-gray-300 font-mono">
        v0.8.2 • CELLAR EXCHANGE PLATFORM
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  login(role: UserRole) {
    this.auth.loginAs(role);
    this.router.navigate(['/app/offers']);
  }
}