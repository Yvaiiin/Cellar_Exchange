import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OfferService, Offer, Request } from '../../services/offer.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-offers-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full bg-white border-r border-gray-200">
      
      <div class="p-4 border-b border-gray-200 space-y-3 shrink-0">
        <div class="grid grid-cols-2 gap-1 p-1 bg-gray-100/80 rounded-lg">
          <button (click)="switchTab('OFFRES')" class="py-1.5 text-xs font-bold rounded-md transition-all shadow-sm" [ngClass]="activeTab() === 'OFFRES' ? 'bg-white text-slate-900 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'">{{ auth.isSeller() ? 'MES OFFRES' : 'OFFRES' }}</button>
          <button (click)="switchTab('DEMANDES')" class="py-1.5 text-xs font-bold rounded-md transition-all" [ngClass]="activeTab() === 'DEMANDES' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'">DEMANDES</button>
        </div>

        @if (auth.isSeller() && activeTab() === 'OFFRES') {
            <button (click)="openOfferCreationModal()" class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-md shadow-sm flex items-center justify-center gap-2 transition-all"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>Ajouter une offre</button>
        }
        @if (auth.isBuyer() && activeTab() === 'DEMANDES') {
            <button (click)="openRequestCreationModal()" class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-md shadow-sm flex items-center justify-center gap-2 transition-all"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>Ajouter une demande</button>
        }

        <div class="relative"><span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span><input type="text" placeholder="Rechercher..." class="w-full py-2 pl-9 pr-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"></div>

        @if (activeTab() === 'OFFRES') {
            <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button (click)="statusFilter.set('TOUT')" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all whitespace-nowrap" [ngClass]="statusFilter() === 'TOUT' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'">TOUT</button>
                @if (!auth.isBuyer()) { <button (click)="statusFilter.set('BROUILLON')" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all whitespace-nowrap" [ngClass]="statusFilter() === 'BROUILLON' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'">BROUILLON</button> }
                <button (click)="statusFilter.set('DISPONIBLE')" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all whitespace-nowrap" [ngClass]="statusFilter() === 'DISPONIBLE' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'">DISPONIBLE</button>
                <button (click)="statusFilter.set('A L\\'ETUDE')" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all whitespace-nowrap" [ngClass]="statusFilter() === 'A L\\'ETUDE' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'">À L'ÉTUDE</button>
                <button (click)="statusFilter.set('VENDU')" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all whitespace-nowrap" [ngClass]="statusFilter() === 'VENDU' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'">VENDU</button>
            </div>
        }
      </div>

      <div class="flex-1 overflow-y-auto min-h-0">
        @if (activeTab() === 'OFFRES') {
            @for (offer of filteredOffers(); track offer.id) {
                <div (click)="selectItem(offer.id)" class="group p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors relative">
                  <div class="flex justify-between items-start mb-1">
                    <div class="flex items-center gap-2">
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border" [ngClass]="{'bg-green-50 text-green-700 border-green-100': offer.status === 'DISPONIBLE', 'bg-amber-50 text-amber-700 border-amber-100': offer.status === 'A L\\'ETUDE', 'bg-gray-50 text-gray-500 border-gray-100': offer.status === 'VENDU', 'bg-slate-100 text-slate-500 border-slate-200 border-dashed': offer.status === 'BROUILLON'}">{{ offer.status }}</span>
                        @if (offer.interestDate) {
                            <div class="flex items-center justify-center w-4 h-4 cursor-default transition-opacity hover:opacity-80" [title]="getTooltip(offer)">
                                @if (offer.interestType === 'WAITLIST') { <svg class="w-3.5 h-3.5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> } 
                                @else { <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
                            </div>
                        }
                        @if (auth.isAdmin()) { <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-bold uppercase">{{ getOwnerName(offer.ownerId) }}</span> }
                    </div>
                    <span class="text-[10px] text-gray-400 font-mono group-hover:text-slate-600 transition-colors">{{ offer.ref }}</span>
                  </div>
                  <h3 class="text-sm font-bold text-slate-900 leading-tight mb-0.5">{{ offer.name }}</h3>
                  <div class="text-xs text-gray-500 mb-2">{{ offer.vintage }} • {{ offer.region }}</div>
                  <div class="flex justify-between items-end border-t border-gray-50 pt-2 mt-2">
                    <div class="flex gap-1"><span class="text-[10px] text-gray-500">{{ offer.logistics.qty }} x {{ offer.logistics.unit }}</span></div>
                    <div class="text-right"><div class="text-sm font-bold text-slate-900 leading-none">{{ formatPrice(offer.price.unit * offer.logistics.qty) }}</div><div class="text-[10px] text-gray-400 font-medium mt-0.5">{{ formatPrice(offer.price.unit) }} / col</div></div>
                  </div>
                </div>
            }
            @if (filteredOffers().length === 0) { <div class="p-8 text-center text-gray-400 text-sm">Aucune offre.</div> }
        }

        @if (activeTab() === 'DEMANDES') {
            @for (req of requestList(); track req.id) {
                <div (click)="selectItem(req.id)" class="group p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors relative">
                    <div class="flex justify-between items-start mb-1">
                        <div class="flex items-center gap-2">
                            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border bg-indigo-50 text-indigo-700 border-indigo-100">RECHERCHE</span>
                            </div>
                        <span class="text-[10px] text-gray-400 font-mono">#{{ req.id }}</span>
                    </div>
                    <h3 class="text-sm font-bold text-slate-900 leading-tight mb-0.5">{{ req.productName }}</h3>
                    <div class="text-xs text-gray-500 mb-2">{{ req.vintage }} • {{ req.format }}</div>
                    <div class="flex justify-between items-end border-t border-gray-50 pt-2 mt-2">
                         <div class="flex gap-1"><span class="text-[10px] text-gray-500">Qte: {{ req.qty }}</span></div>
                         <div class="text-right">
                             <div class="text-sm font-bold text-slate-900 leading-none">Budget {{ formatPrice(req.targetPrice) }}</div>
                             <div class="text-[10px] text-gray-400 font-medium mt-0.5">HT</div>
                         </div>
                    </div>
                </div>
            }
            @if (requestList().length === 0) { <div class="p-8 text-center text-gray-400 text-sm">Aucune demande en cours.</div> }
        }
      </div>

      @if (isOfferCreationModalOpen()) {
        <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" (click)="closeOfferCreationModal()"></div>
            <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-scale-in">
                <div class="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <h2 class="text-xl font-bold text-slate-900">Nouvelle offre</h2>
                    <button (click)="closeOfferCreationModal()" class="p-2 -mr-2 text-gray-400 hover:text-slate-900 rounded-full hover:bg-gray-100 transition-all"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div class="p-8 overflow-y-auto space-y-8">
                     <div>
                        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">1</span> Identité & Prix</h3>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="col-span-2"><label class="block text-xs font-bold text-gray-700 mb-1">Nom du produit</label><input [(ngModel)]="newOfferData.name" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div>
                            <div><label class="block text-xs font-bold text-gray-700 mb-1">Millésime</label><input [(ngModel)]="newOfferData.vintage" type="number" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div>
                            <div><label class="block text-xs font-bold text-gray-700 mb-1">Type</label><select [(ngModel)]="newOfferData.productType" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"><option value="VIN ROUGE">VIN ROUGE</option><option value="VIN BLANC">VIN BLANC</option><option value="CHAMPAGNE">CHAMPAGNE</option><option value="SPIRITUEUX">SPIRITUEUX</option></select></div>
                            <div><label class="block text-xs font-bold text-gray-700 mb-1">Région</label><input [(ngModel)]="newOfferData.region" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div>
                            <div><label class="block text-xs font-bold text-gray-700 mb-1">Prix Unitaire (HT)</label><input [(ngModel)]="newOfferData.price.unit" type="number" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div>
                        </div>
                    </div>
                </div>
                <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <button (click)="closeOfferCreationModal()" class="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">Annuler</button>
                    <button (click)="saveNewOffer('BROUILLON')" class="px-5 py-2.5 text-sm font-bold text-slate-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm">Enregistrer comme brouillon</button>
                    <button (click)="saveNewOffer('DISPONIBLE')" class="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg shadow-slate-900/20 transition-all">Publier</button>
                </div>
            </div>
        </div>
      }

      @if (isRequestCreationModalOpen()) {
         <div class="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" (click)="closeRequestCreationModal()"></div>
            <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-[500px] flex flex-col animate-scale-in">
                <div class="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <h2 class="text-xl font-bold text-slate-900">Nouvelle demande</h2>
                    <button (click)="closeRequestCreationModal()" class="p-2 -mr-2 text-gray-400 hover:text-slate-900 rounded-full hover:bg-gray-100 transition-all"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div class="p-8 space-y-4">
                    <p class="text-sm text-gray-500 italic mb-4">Recherchez un lot spécifique sur la place.</p>
                    <div><label class="block text-xs font-bold text-gray-700 mb-1">Nom du produit recherché</label><input [(ngModel)]="newRequestData.productName" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none" placeholder="Ex: Petrus"></div>
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-xs font-bold text-gray-700 mb-1">Millésime</label><input [(ngModel)]="newRequestData.vintage" type="number" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div>
                        <div><label class="block text-xs font-bold text-gray-700 mb-1">Format</label><input [(ngModel)]="newRequestData.format" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none" placeholder="Ex: Bouteille"></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div><label class="block text-xs font-bold text-gray-700 mb-1">Quantité</label><input [(ngModel)]="newRequestData.qty" type="number" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div>
                        <div><label class="block text-xs font-bold text-gray-700 mb-1">Prix € HT Souhaité</label><input [(ngModel)]="newRequestData.targetPrice" type="number" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-1">Commentaire (Optionnel)</label>
                        <textarea [(ngModel)]="newRequestData.comment" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none resize-none h-20" placeholder="Ex: Caisse bois d'origine uniquement..."></textarea>
                    </div>
                </div>
                <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
                    <button (click)="closeRequestCreationModal()" class="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">Annuler</button>
                    <button (click)="saveNewRequest()" class="px-8 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg shadow-slate-900/20 transition-all">Publier la demande</button>
                </div>
            </div>
         </div>
      }
    </div>
  `,
  styles: [`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .fade-in { animation: fadeIn 0.3s ease-out forwards; } .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes scaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }`]
})
export class OffersListComponent {
  offerService = inject(OfferService);
  auth = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  
  activeTab = signal<'OFFRES' | 'DEMANDES'>('OFFRES');
  statusFilter = signal<'TOUT' | 'DISPONIBLE' | 'A L\'ETUDE' | 'VENDU' | 'BROUILLON'>('TOUT');
  isOfferCreationModalOpen = signal(false);
  isRequestCreationModalOpen = signal(false);
  newOfferData: any = {};
  newRequestData: any = {};

  filteredOffers = computed(() => {
    const allOffers = this.offerService.offers();
    const currentUser = this.auth.currentUser();
    const status = this.statusFilter();
    let offers: Offer[] = [];
    if (this.auth.isAdmin()) offers = allOffers;
    else if (this.auth.isSeller()) offers = allOffers.filter(o => o.ownerId === currentUser?.id);
    else if (this.auth.isBuyer()) offers = allOffers.filter(o => o.status !== 'BROUILLON');
    if (status !== 'TOUT') offers = offers.filter(o => o.status === status);
    return offers;
  });

  requestList = computed(() => this.offerService.requests());

  switchTab(tab: 'OFFRES' | 'DEMANDES') { this.activeTab.set(tab); this.router.navigate(['.'], { relativeTo: this.route }); }
  selectItem(id: number) { this.router.navigate([id], { relativeTo: this.route }); }
  
  getOwnerName(userId: string): string { const user = this.auth.users().find(u => u.id === userId); return user ? user.name : userId; }
  formatPrice(price: number): string { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price); }
  getTooltip(offer: Offer): string { return offer.interestType === 'WAITLIST' ? "Sur liste d'attente" : "Intérêt signalé"; }

  openOfferCreationModal() { const currentUser = this.auth.currentUser(); if(currentUser) { this.newOfferData = this.offerService.getBlankOffer(currentUser.id); this.isOfferCreationModalOpen.set(true); } }
  closeOfferCreationModal() { this.isOfferCreationModalOpen.set(false); }
  saveNewOffer(targetStatus: 'BROUILLON' | 'DISPONIBLE') { 
      this.newOfferData.price.total = this.newOfferData.price.unit * this.newOfferData.logistics.qty; 
      this.newOfferData.status = targetStatus;
      this.offerService.addOffer(this.newOfferData); 
      this.closeOfferCreationModal(); 
      if (targetStatus === 'BROUILLON') this.statusFilter.set('BROUILLON'); else this.statusFilter.set('TOUT'); 
      setTimeout(() => { this.router.navigate([this.newOfferData.id], { relativeTo: this.route }); }, 50);
  }

  openRequestCreationModal() { const currentUser = this.auth.currentUser(); if(currentUser) { this.newRequestData = this.offerService.getBlankRequest(currentUser.id); this.isRequestCreationModalOpen.set(true); } }
  closeRequestCreationModal() { this.isRequestCreationModalOpen.set(false); }
  saveNewRequest() {
      this.offerService.addRequest(this.newRequestData);
      this.closeRequestCreationModal();
      setTimeout(() => { this.router.navigate([this.newRequestData.id], { relativeTo: this.route }); }, 50);
  }
}