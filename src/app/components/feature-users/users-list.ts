import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserRole, User } from '../../services/auth.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full bg-white relative">
      
      <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
        <div>
          <h1 class="text-xl font-bold text-slate-900">Utilisateurs</h1>
          <p class="text-xs text-gray-500 mt-1">Gérez les accès et identifiants de la plateforme.</p>
        </div>
        <button (click)="openCreateModal()" class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Nouvel utilisateur
        </button>
      </div>

      <div class="flex-1 overflow-auto bg-gray-50 p-6">
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              <tr>
                <th class="px-6 py-4 border-b border-gray-100">Utilisateur</th>
                <th class="px-6 py-4 border-b border-gray-100">Rôle</th>
                <th class="px-6 py-4 border-b border-gray-100">Identifiants</th>
                <th class="px-6 py-4 border-b border-gray-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @for (user of auth.users(); track user.id) {
                <tr class="hover:bg-gray-50/80 transition-colors group">
                  <td class="px-6 py-4">
                    <div class="font-bold text-slate-900">{{ user.firstname }} {{ user.lastname }}</div>
                    <div class="text-xs text-gray-400">{{ user.company }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border"
                      [ngClass]="{
                        'bg-purple-50 text-purple-700 border-purple-100': user.role === 'ADMIN',
                        'bg-indigo-50 text-indigo-700 border-indigo-100': user.role === 'VENDEUR',
                        'bg-blue-50 text-blue-700 border-blue-100': user.role === 'ACHETEUR'
                      }">
                      {{ user.label }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col gap-1.5">
                      <div class="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                        {{ user.email }}
                      </div>
                      <div class="flex items-center gap-2 text-xs text-gray-400">
                         <svg class="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                         ••••••••
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button (click)="openEditModal(user)" class="text-gray-300 hover:text-slate-900 p-2 hover:bg-gray-100 rounded-full transition-colors" title="Modifier">
                           <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button (click)="deleteUser(user.id)" class="text-gray-300 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors" [disabled]="user.id === auth.currentUser()?.id" [class.opacity-0]="user.id === auth.currentUser()?.id" title="Supprimer">
                           <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (isModalOpen()) {
         <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                
                <div class="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                  <div>
                    <h2 class="text-xl font-bold text-slate-900">
                        {{ editingId() ? 'Modifier l\\'utilisateur' : 'Nouvel Utilisateur' }}
                    </h2>
                    <p class="text-xs text-gray-500 mt-0.5">
                        {{ editingId() ? 'Mise à jour des informations' : 'Création d\\'un compte partenaire' }}
                    </p>
                  </div>
                  <button (click)="closeModal()" class="p-2 -mr-2 text-gray-400 hover:text-slate-900 rounded-full hover:bg-gray-100 transition-all">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div class="p-8 overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                    
                        <div class="space-y-6">
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span class="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                                Profil & Rôle
                            </h3>
                            
                            <div class="grid grid-cols-2 gap-3">
                                <button 
                                    type="button" 
                                    (click)="formData.role = 'VENDEUR'" 
                                    class="p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all duration-200"
                                    [ngClass]="formData.role === 'VENDEUR' ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50'"
                                >
                                    <div class="font-bold text-sm">VENDEUR</div>
                                    <div class="text-[10px] opacity-80 uppercase tracking-wide">Gère son stock</div>
                                </button>
                                
                                <button 
                                    type="button" 
                                    (click)="formData.role = 'ACHETEUR'" 
                                    class="p-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all duration-200"
                                    [ngClass]="formData.role === 'ACHETEUR' ? 'border-slate-900 bg-slate-50 text-slate-900 shadow-sm' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:bg-gray-50'"
                                >
                                    <div class="font-bold text-sm">ACHETEUR</div>
                                    <div class="text-[10px] opacity-80 uppercase tracking-wide">Accès marché</div>
                                </button>
                            </div>

                            <div class="space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Prénom</label>
                                        <input [(ngModel)]="formData.firstname" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all" placeholder="Jean">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Nom</label>
                                        <input [(ngModel)]="formData.lastname" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all" placeholder="Dupont">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Société</label>
                                    <input [(ngModel)]="formData.company" type="text" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all" placeholder="Ex: Domaine du Vin">
                                </div>
                            </div>
                        </div>

                        <div class="space-y-6 md:border-l md:border-gray-100 md:pl-10">
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span class="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </span>
                                Accès & Contact
                            </h3>
                            
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Email (Identifiant)</label>
                                    <input [(ngModel)]="formData.email" type="email" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all">
                                </div>
                                
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Mot de passe</label>
                                    <div class="relative group">
                                        <input [(ngModel)]="formData.password" type="text" class="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all">
                                    </div>
                                    <p class="text-[10px] text-gray-400 mt-1.5 ml-1">
                                        {{ editingId() ? 'Laisser tel quel ou modifier pour réinitialiser.' : 'Sera modifié à la première connexion.' }}
                                    </p>
                                </div>

                                <div>
                                    <label class="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Téléphone (Optionnel)</label>
                                    <input [(ngModel)]="formData.phone" type="tel" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all">
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <button (click)="closeModal()" class="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">Annuler</button>
                    <button (click)="saveUser()" class="px-8 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg shadow-slate-900/20 transition-all transform hover:-translate-y-0.5">
                        {{ editingId() ? 'Enregistrer les modifications' : 'Créer l\\'utilisateur' }}
                    </button>
                </div>

            </div>
         </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
    .animate-scale-in { animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class UsersListComponent {
  auth = inject(AuthService);
  
  isModalOpen = signal(false);
  editingId = signal<string | null>(null);

  // Modèle mis à jour avec firstname / lastname
  formData: { firstname: string; lastname: string; company: string; email: string; phone: string; password?: string; role: UserRole } = {
    firstname: '', lastname: '', company: '', email: '', phone: '', password: '', role: 'VENDEUR'
  };

  openCreateModal() { 
    this.formData = { firstname: '', lastname: '', company: '', email: '', phone: '', password: '', role: 'VENDEUR' };
    this.editingId.set(null);
    this.isModalOpen.set(true); 
  }

  openEditModal(user: User) {
    this.formData = { 
        firstname: user.firstname,
        lastname: user.lastname, 
        company: user.company, 
        email: user.email, 
        phone: user.phone, 
        password: user.password, 
        role: user.role 
    };
    this.editingId.set(user.id);
    this.isModalOpen.set(true);
  }

  closeModal() { this.isModalOpen.set(false); }

  saveUser() {
    if (!this.formData.firstname || !this.formData.lastname || !this.formData.company) {
        alert("Champs manquants");
        return;
    }

    if (this.editingId()) {
        this.auth.updateUser({
            ...this.formData,
            id: this.editingId()!,
            label: '', // Sera géré par le service
            name: ''   // Sera géré par le service
        });
    } else {
        this.auth.addUser(this.formData);
    }
    
    this.closeModal();
  }

  deleteUser(id: string) {
    if(confirm('Supprimer cet utilisateur ?')) {
      this.auth.deleteUser(id);
    }
  }
}