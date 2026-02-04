import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferService, Offer, Request } from '../../services/offer.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (!offer() && !request()) {
      <div class="h-full flex flex-col items-center justify-center text-gray-400">
        <p class="text-sm">Sélectionnez un élément à gauche.</p>
      </div>
    } 
    
    @if (request()) {
        <div class="flex flex-col h-full bg-white relative">
            <div class="flex px-6 py-3 border-b border-gray-100 justify-end items-center bg-white shadow-sm shrink-0 z-10 h-14">
               @if (isRequestOwner()) {
                  <button (click)="deleteRequest()" class="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider px-3 py-1 hover:bg-red-50 rounded transition-colors">Supprimer la demande</button>
               }
            </div>

            <div class="flex-1 overflow-y-auto p-12 bg-white flex flex-col items-center pt-20">
                <div class="w-full max-w-3xl bg-[#EEF2FF] rounded-xl p-12 text-center mb-10 shadow-sm border border-[#E0E7FF]">
                    <h1 class="text-2xl font-bold text-[#313B85] mb-2 tracking-tight">RECHERCHE : {{ request()!.productName }}</h1>
                    <div class="text-lg text-[#4F46E5] mb-8 font-medium">{{ request()!.vintage }} • {{ request()!.format }}</div>
                    <div class="text-base text-slate-600 mb-8 font-bold">Quantité recherchée : {{ request()!.qty }}</div>
                    
                    <div class="inline-flex items-center justify-center px-6 py-2 bg-white rounded-full shadow-sm text-[#313B85] font-bold text-sm border border-[#E0E7FF]">
                        Budget Total : {{ request()!.targetPrice > 0 ? formatPrice(request()!.targetPrice * request()!.qty) : 'NC' }}
                    </div>
                </div>
                <div class="w-full max-w-3xl">
                    <h3 class="text-xs font-bold text-slate-900 uppercase mb-3 tracking-wide">CONTEXTE</h3>
                    <div class="w-full bg-white border border-gray-200 rounded-lg p-6 min-h-[80px] text-slate-700 text-sm leading-relaxed shadow-sm">
                        {{ request()!.comment || 'Pour commande client ferme.' }}
                    </div>
                </div>
            </div>

            @if (!isRequestOwner()) {
                <div class="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-4 flex justify-end items-center z-20 h-20">
                    <button (click)="openContactModal()" class="px-8 py-3 bg-[#313B85] hover:bg-[#232a63] text-white text-sm font-bold rounded-md shadow-lg shadow-indigo-900/10 transition-all transform active:scale-95">
                        Répondre
                    </button>
                </div>
            }
        </div>
    }

    @if (offer()) {
      <div class="flex flex-col h-full bg-white relative">
        <div class="flex px-6 py-3 border-b border-gray-100 justify-between items-center bg-white shadow-sm shrink-0 z-10">
          <div class="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span>Réf: {{ offer()!.ref }}</span><span>•</span><span>Ajouté le {{ offer()!.date }}</span>
            @if (auth.isAdmin()) { <span class="ml-2 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase">Propriétaire : {{ getOwnerName(offer()!.ownerId) }}</span> }
          </div>
          <div class="flex gap-2"><button (click)="copyData()" class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2 transition-colors">Copier</button><button class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2 transition-colors">PDF</button></div>
        </div>

        <div class="flex-1 overflow-y-auto pb-24">
          @if (offer()!.photos.length > 0) {
            <div (click)="openLightbox()" class="w-full h-80 bg-white border-b border-gray-100 flex items-center justify-center p-4 relative group cursor-zoom-in">
              <img [src]="currentPhoto()" [alt]="offer()!.name" class="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105">
              <div class="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-sm"><span>AGRANDIR</span><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div>
            </div>
            @if (offer()!.photos.length > 1) {
              <div class="flex gap-2 px-6 py-3 bg-gray-50 border-b border-gray-100 overflow-x-auto">
                @for (photo of offer()!.photos; track $index) { <div (click)="selectedPhotoIndex.set($index)" class="w-12 h-12 border rounded-md overflow-hidden cursor-pointer hover:ring-2 ring-indigo-100 transition-all bg-white shrink-0" [class.border-indigo-500]="selectedPhotoIndex() === $index" [class.border-gray-200]="selectedPhotoIndex() !== $index"><img [src]="photo" class="w-full h-full object-cover"></div> }
              </div>
            }
          } @else { <div class="w-full h-64 bg-gray-50 border-b border-gray-200 flex items-center justify-center text-gray-400 italic text-sm">Aucun visuel disponible</div> }

          <div class="max-w-5xl mx-auto px-6 py-6">
            <div class="flex flex-col md:flex-row justify-between items-start mb-6 gap-6 border-b border-gray-100 pb-6">
              <div class="flex-1">
                <div class="mb-2">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border" [ngClass]="{'bg-green-50 text-green-700 border-green-100': offer()!.status === 'DISPONIBLE', 'bg-amber-50 text-amber-700 border-amber-100': offer()!.status === 'A L\\'ETUDE', 'bg-gray-50 text-gray-500 border-gray-100': offer()!.status === 'VENDU', 'bg-slate-100 text-slate-500 border-slate-200 border-dashed': offer()!.status === 'BROUILLON'}">{{ offer()!.status }}</span>
                </div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2 tracking-tight leading-tight">{{ offer()!.name }}</h1>
                <div class="text-xl font-light text-gray-500 mb-4">{{ offer()!.vintage }} • {{ offer()!.region }}</div>
                <div class="flex gap-2"><span class="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-wide rounded border border-gray-200">{{ offer()!.productType }}</span><span class="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-wide rounded border border-gray-200">{{ offer()!.regie }}</span></div>
              </div>
              <div class="bg-white border border-slate-200 rounded-xl p-5 text-right shadow-sm min-w-[250px]">
                <div class="text-4xl font-bold text-slate-900 tracking-tight leading-none mb-1">{{ formatPrice(offer()!.price.unit * offer()!.logistics.qty) }}<span class="text-xl text-gray-400 font-normal">HT</span></div>
                <div class="text-sm font-medium text-gray-400">{{ formatPrice(offer()!.price.unit) }} / col</div>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 mb-8">
                <div><h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Logistique</h3><dl class="grid grid-cols-2 gap-3 text-sm"><dt class="text-gray-500">Format</dt><dd class="font-medium text-gray-900 text-right">{{ offer()!.logistics.unit }}</dd><dt class="text-gray-500">Quantité</dt><dd class="font-medium text-gray-900 text-right">{{ offer()!.logistics.qty }}</dd><dt class="text-gray-500">Caissage</dt><dd class="font-medium text-gray-900 text-right">{{ offer()!.logistics.packaging }}</dd><dt class="text-gray-500">Bande de Garantie</dt><dd class="font-medium text-gray-900 text-right">{{ offer()!.logistics.guarantee }}</dd><dt class="text-gray-500">Localisation</dt><dd class="font-medium text-gray-900 text-right">{{ offer()!.logistics.location }}</dd></dl></div>
                <div><h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">État & Garantie</h3><dl class="grid grid-cols-2 gap-3 text-sm"><dt class="text-gray-500">État général</dt><dd class="font-medium text-gray-900 text-right">{{ offer()!.condition.general }}</dd><dt class="text-gray-500">Niveau</dt><dd class="font-medium text-gray-900 text-right">{{ offer()!.condition.level }}</dd><dt class="text-gray-500">Capsule</dt><dd class="font-medium text-gray-900 text-right">{{ offer()!.condition.capsule }}</dd><dt class="text-gray-500">Étiquette</dt><dd class="font-medium text-gray-900 text-right">{{ offer()!.condition.label }}</dd><dt class="text-gray-500">Vendeur</dt><dd class="font-medium text-gray-900 text-right">{{ offer()!.condition.sellerType }}</dd></dl></div>
            </div>
            <div class="bg-slate-50 p-6 rounded-lg border border-slate-100"><h3 class="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2">Note du courtier</h3><p class="text-slate-700 text-sm leading-relaxed italic">"{{ offer()!.brokerNote }}"</p></div>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
             @if (isOwner()) {
               <button (click)="deleteOffer()" class="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
               <div class="flex items-center gap-3">
                  @if (offer()!.status === 'BROUILLON') {
                      <div class="text-xs text-gray-400 font-medium mr-2">Ce lot est en brouillon</div>
                      <button (click)="openEditModal()" class="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all">Modifier</button>
                      <button (click)="publishOffer()" class="px-6 py-2.5 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>Publier l'offre</button>
                  } @else {
                      <div class="relative"><select [ngModel]="offer()!.status" (ngModelChange)="updateStatus($event)" class="appearance-none bg-gray-50 border border-gray-200 text-slate-900 text-xs font-bold py-2.5 pl-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer hover:bg-white transition-colors uppercase tracking-wide"><option value="DISPONIBLE">DISPONIBLE</option><option value="A L'ETUDE">A L'ETUDE</option><option value="VENDU">VENDU</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"><svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg></div></div>
                      <button (click)="openEditModal()" class="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>Modifier</button>
                  }
               </div>
            } @else {
               @if (offer()!.status === 'VENDU') {
                   <div class="flex-1"></div>
                   <button disabled class="px-6 py-2.5 rounded-md bg-gray-100 text-gray-400 font-bold text-sm cursor-not-allowed border border-gray-200 uppercase tracking-wide">vente terminée</button>
               } 
               @else {
                   <div class="flex-1"></div>
                   <div class="flex gap-3">
                       <button (click)="openContactModal()" class="px-4 py-2.5 rounded-md border border-gray-300 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">Précisions</button>
                       @if (offer()!.interestDate) {
                         <button disabled class="px-6 py-2.5 rounded-md bg-gray-100 border border-gray-200 text-gray-500 font-medium text-sm cursor-not-allowed flex items-center gap-2"><svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg><span>{{ getInterestStatusText() }}</span></button>
                       } 
                       @else {
                            @if (offer()!.status === 'DISPONIBLE') { <button (click)="openInterestModal('PRIMARY')" class="px-6 py-2.5 rounded-md bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 shadow-sm transition-all">Se positionner</button> }
                            @if (offer()!.status === "A L'ETUDE") { <button (click)="openInterestModal('WAITLIST')" class="px-6 py-2.5 rounded-md bg-[#c2410c] text-white font-medium text-sm hover:bg-[#9a3412] shadow-sm transition-all">Rejoindre liste d'attente</button> }
                       }
                   </div>
               }
            }
        </div>
      </div>
    }

    @if (isEditModalOpen()) {
        <div class="fixed inset-0 z-[50000] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" (click)="closeEditModal()"></div>
            <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] animate-scale-in">
                <div class="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0"><h2 class="text-xl font-bold text-slate-900">Modifier l'offre</h2><button (click)="closeEditModal()" class="p-2 -mr-2 text-gray-400 hover:text-slate-900 rounded-full hover:bg-gray-100 transition-all"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                <div class="p-8 overflow-y-auto space-y-8">
                        <div>
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">1</span> Identité & Prix</h3>
                            <div class="grid grid-cols-2 gap-4"><div class="col-span-2"><label class="block text-xs font-bold text-gray-700 mb-1">Nom du produit</label><input [(ngModel)]="editFormData.name" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Millésime</label><input [(ngModel)]="editFormData.vintage" type="number" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Type</label><select [(ngModel)]="editFormData.productType" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"><option value="VIN ROUGE">VIN ROUGE</option><option value="VIN BLANC">VIN BLANC</option><option value="CHAMPAGNE">CHAMPAGNE</option><option value="SPIRITUEUX">SPIRITUEUX</option></select></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Région</label><input [(ngModel)]="editFormData.region" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Prix Unitaire (HT)</label><input [(ngModel)]="editFormData.price.unit" type="number" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div></div>
                        </div>
                        <div>
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">2</span> Technique & Logistique</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="space-y-4"><div><label class="block text-xs font-bold text-gray-700 mb-1">Régie</label><select [(ngModel)]="editFormData.regie" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"><option value="CRD">CRD</option><option value="NON CRD">NON CRD</option></select></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Localisation</label><input [(ngModel)]="editFormData.logistics.location" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Type Vendeur</label><input [(ngModel)]="editFormData.condition.sellerType" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div></div>
                                <div class="space-y-4"><div><label class="block text-xs font-bold text-gray-700 mb-1">Format</label><input [(ngModel)]="editFormData.logistics.unit" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Quantité</label><input [(ngModel)]="editFormData.logistics.qty" type="number" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Caissage</label><input [(ngModel)]="editFormData.logistics.packaging" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Bande de Garantie</label><input [(ngModel)]="editFormData.logistics.guarantee" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div></div>
                                <div class="space-y-4"><div><label class="block text-xs font-bold text-gray-700 mb-1">État Général</label><input [(ngModel)]="editFormData.condition.general" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Niveau</label><input [(ngModel)]="editFormData.condition.level" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Capsule</label><input [(ngModel)]="editFormData.condition.capsule" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div><div><label class="block text-xs font-bold text-gray-700 mb-1">Étiquette</label><input [(ngModel)]="editFormData.condition.label" type="text" class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"></div></div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><span class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">3</span> Photos</h3>
                            <div class="space-y-3">
                                <div class="flex gap-2"><input #newPhotoInput type="text" placeholder="URL de l'image (https://...)" class="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"><button (click)="addPhoto(newPhotoInput.value); newPhotoInput.value=''" class="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 text-sm">Ajouter</button></div>
                                <div class="flex gap-2 overflow-x-auto py-2">
                                    @for (photo of editFormData.photos; track $index) { <div class="relative w-16 h-16 rounded-md overflow-hidden group shrink-0 border border-gray-200"><img [src]="photo" class="w-full h-full object-cover"><button (click)="removePhoto($index)" class="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button></div> }
                                </div>
                            </div>
                        </div>
                </div>
                <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0"><button (click)="closeEditModal()" class="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors">Annuler</button><button (click)="saveOffer()" class="px-8 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg shadow-slate-900/20 transition-all">Enregistrer</button></div>
            </div>
        </div>
    }

@if (showInterestModal()) { 
      <div class="fixed inset-0 z-[50000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" (click)="closeInterestModal()"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-[420px] p-6 text-center animate-scale-in border border-gray-100">
          
          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-5" [ngClass]="interestType() === 'PRIMARY' ? 'bg-indigo-100' : 'bg-orange-100'">
            @if (interestType() === 'PRIMARY') { <svg class="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> } 
            @else { <svg class="h-7 w-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
          </div>

          <h3 class="text-xl font-bold text-slate-900 mb-4">{{ interestType() === 'PRIMARY' ? 'Confirmer le positionnement' : 'Rejoindre la liste d\\'attente' }}</h3>
          
          @if (offer()) {
            <div class="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-6 text-center shadow-sm">
                <div class="font-bold text-slate-900 text-lg leading-tight mb-1">{{ offer()!.name }}</div>
                <div class="text-xs text-slate-500 font-bold uppercase tracking-wide mb-3">{{ offer()!.vintage }} • {{ offer()!.logistics.unit }}</div>
                
                <div class="flex justify-between items-center border-t border-slate-200 pt-3 mt-2">
                    <span class="text-xs text-slate-500">Quantité : {{ offer()!.logistics.qty }}</span>
                    <span class="text-sm font-bold text-slate-900">Total : {{ formatPrice(offer()!.price.unit * offer()!.logistics.qty) }}</span>
                </div>
            </div>
          }
          <p class="text-sm text-gray-500 mb-6">{{ interestType() === 'PRIMARY' ? 'Vous êtes sur le point de valider cet ordre.' : 'Vous serez notifié si la transaction en cours n\\'aboutit pas.' }}</p>
          
          <div class="space-y-3">
              <button (click)="confirmInterest()" class="w-full inline-flex justify-center rounded-lg px-4 py-3 text-sm font-bold text-white shadow-sm focus:outline-none transition-all active:scale-[0.98]" [ngClass]="interestType() === 'PRIMARY' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#c2410c] hover:bg-[#9a3412]'">{{ interestType() === 'PRIMARY' ? 'Confirmer mon intérêt' : 'M\\'inscrire sur la liste' }}</button>
              <button (click)="closeInterestModal()" class="w-full inline-flex justify-center rounded-lg bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">Annuler</button>
          </div>
        </div>
      </div>
    }

    @if (isContactModalOpen()) {
      <div class="fixed inset-0 z-[50000] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" (click)="closeContactModal()"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-[480px] p-6 animate-scale-in border border-gray-100">
            
            @if (request()) {
                <h3 class="text-xl font-bold text-slate-900 mb-2">Vous êtes sur le point de répondre à la demande de recherche</h3>
                <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4 text-center">
                    <div class="font-bold text-indigo-900 text-lg leading-tight mb-1">{{ request()!.productName }}</div>
                    <div class="text-sm text-indigo-700 font-medium">{{ request()!.vintage }} • {{ request()!.format }}</div>
                </div>
                <textarea [(ngModel)]="contactMessage" placeholder="Donnez des précisions à l'acheteur à propos du lot que vous avez..." class="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm text-slate-900 placeholder-gray-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none mb-6 bg-slate-50"></textarea>
                <div class="flex justify-end gap-3"><button (click)="closeContactModal()" class="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all">Annuler</button><button (click)="sendInquiry()" class="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all">Confirmer</button></div>
            } 
            @else {
                <h3 class="text-xl font-bold text-slate-900 mb-2">Demande de précisions</h3>
                <p class="text-sm text-gray-500 mb-6">Votre message sera transmis au courtier en charge de ce lot.</p>
                <textarea [(ngModel)]="contactMessage" placeholder="Posez votre question ici..." class="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm text-slate-900 placeholder-gray-400 focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none mb-6 bg-slate-50"></textarea>
                <div class="flex justify-end gap-3"><button (click)="closeContactModal()" class="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all">Annuler</button><button (click)="sendInquiry()" class="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all">Envoyer</button></div>
            }
        </div>
      </div>
    }

    @if (showToast()) {
        <div class="fixed top-3 left-1/2 z-[100000] bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 border border-white/10" [ngClass]="isToastClosing() ? 'animate-toast-out' : 'animate-toast-in'">
            <div class="bg-green-500 rounded-full p-1 flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.4)]"><svg class="w-3 h-3 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></div>
            <div class="text-xs font-bold tracking-wide">
                @if (isContactModalOpen() || contactMessage) { Message envoyé }
                @else { {{ interestType() === 'WAITLIST' ? 'Ajouté à la liste d\\'attente' : 'Action validée' }} }
            </div>
        </div>
    }

    @if (isLightboxOpen()) {
        <div class="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" (click)="closeLightbox()">
            <button class="absolute top-4 right-4 text-white hover:text-gray-300 z-[10000] p-2" (click)="closeLightbox(); $event.stopPropagation()">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <img [src]="currentPhoto()" class="max-h-[85vh] max-w-[90vw] object-contain select-none" (click)="$event.stopPropagation()">

            @if (offer()!.photos.length > 1) {
                <button class="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all z-[10000]" (click)="prevPhoto($event)">
                    <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button class="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all z-[10000]" (click)="nextPhoto($event)">
                    <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            }
        </div>
    }
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.3s ease-out forwards; }
    .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }
    .animate-toast-in { animation: toastIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-toast-out { animation: toastOut 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
    @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes toastOut { from { opacity: 1; transform: translate(-50%, 0); } to { opacity: 0; transform: translate(-50%, -20px); } }
  `]
})
export class OfferDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private offerService = inject(OfferService);
  auth = inject(AuthService);

  offer = signal<Offer | undefined>(undefined);
  request = signal<Request | undefined>(undefined);

  isOwner = computed(() => this.auth.currentUser()?.id === this.offer()?.ownerId);
  isRequestOwner = computed(() => this.auth.currentUser()?.id === this.request()?.ownerId);

  selectedPhotoIndex = signal(0);
  isLightboxOpen = signal(false);
  currentPhoto = computed(() => { const currentOffer = this.offer(); if (currentOffer && currentOffer.photos.length > 0) return currentOffer.photos[this.selectedPhotoIndex()]; return ''; });
  
  showInterestModal = signal(false);
  interestType = signal<'PRIMARY' | 'WAITLIST'>('PRIMARY');
  showToast = signal(false);
  isToastClosing = signal(false);
  isEditModalOpen = signal(false);
  editFormData: any = {};
  isContactModalOpen = signal(false);
  contactMessage = '';

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.offer.set(undefined);
        this.request.set(undefined);
        this.selectedPhotoIndex.set(0);

        if (id >= 10000) {
            this.request.set(this.offerService.getRequestById(id));
        } else {
            this.offer.set(this.offerService.getOfferById(id));
        }
      }
    });
  }

  // --- LIGHTBOX NAVIGATION ---
  openLightbox() { this.isLightboxOpen.set(true); }
  closeLightbox() { this.isLightboxOpen.set(false); }
  
  nextPhoto(e: Event) {
      e.stopPropagation();
      const photos = this.offer()?.photos;
      if (photos && photos.length > 1) {
          if (this.selectedPhotoIndex() < photos.length - 1) {
              this.selectedPhotoIndex.update(i => i + 1);
          } else {
              this.selectedPhotoIndex.set(0); // Boucle
          }
      }
  }

  prevPhoto(e: Event) {
      e.stopPropagation();
      const photos = this.offer()?.photos;
      if (photos && photos.length > 1) {
          if (this.selectedPhotoIndex() > 0) {
              this.selectedPhotoIndex.update(i => i - 1);
          } else {
              this.selectedPhotoIndex.set(photos.length - 1); // Boucle
          }
      }
  }

  // --- ACTIONS ---
  deleteRequest() { if(confirm("Supprimer cette demande ?")) { this.offerService.deleteRequest(this.request()!.id); this.router.navigate(['/app/offers']); } }
  openContactModal() { this.contactMessage = ''; this.isContactModalOpen.set(true); }
  closeContactModal() { this.isContactModalOpen.set(false); }
  sendInquiry() { console.log('Message envoyé'); this.closeContactModal(); this.triggerToast(); }
  getInterestStatusText(): string { const o = this.offer(); if (!o) return ''; if (o.interestType === 'WAITLIST') return "Vous êtes sur liste d'attente"; return `Intérêt signalé le ${o.interestDate}`; }
  updateStatus(newStatus: any) { if (this.offer()) { const updated = { ...this.offer()!, status: newStatus }; this.offerService.updateOffer(updated); this.offer.set(updated); this.triggerToast(); } }
  deleteOffer() { if(confirm("Supprimer ?")) { this.offerService.deleteOffer(this.offer()!.id); this.router.navigate(['/app/offers']); } }
  openEditModal() { this.editFormData = JSON.parse(JSON.stringify(this.offer())); this.isEditModalOpen.set(true); }
  closeEditModal() { this.isEditModalOpen.set(false); }
  saveOffer() { this.editFormData.price.total = this.editFormData.price.unit * this.editFormData.logistics.qty; this.offerService.updateOffer(this.editFormData); this.offer.set(this.editFormData); this.closeEditModal(); this.triggerToast(); }
  publishOffer() { if (this.offer()) { const updated = { ...this.offer()!, status: 'DISPONIBLE' as const }; this.offerService.updateOffer(updated); this.offer.set(updated); this.triggerToast(); } }
  openInterestModal(type: 'PRIMARY' | 'WAITLIST') { this.interestType.set(type); this.showInterestModal.set(true); }
  closeInterestModal() { this.showInterestModal.set(false); }
  confirmInterest() { if (this.offer()) { this.offerService.markAsContacted(this.offer()!.id, this.interestType()); const updated = this.offerService.getOfferById(this.offer()!.id); if(updated) this.offer.set(updated); this.closeInterestModal(); this.triggerToast(); } }
  copyData() { this.triggerToast(); }
  triggerToast() { this.showToast.set(false); this.isToastClosing.set(false); setTimeout(() => { this.showToast.set(true); setTimeout(() => { this.isToastClosing.set(true); setTimeout(() => { this.showToast.set(false); this.isToastClosing.set(false); }, 500); }, 3000); }, 50); }
  getOwnerName(userId: string): string { const user = this.auth.users().find(u => u.id === userId); return user ? user.name : userId; }
  formatPrice(price: number): string { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price); }
  addPhoto(url: string) { if(url) this.editFormData.photos.push(url); }
  removePhoto(index: number) { this.editFormData.photos.splice(index, 1); }
}