import { Injectable, signal } from '@angular/core';

export interface Offer {
  id: number;
  ownerId: string;
  name: string;
  vintage: number;
  region: string;
  productType: 'VIN ROUGE' | 'VIN BLANC' | 'CHAMPAGNE' | 'SPIRITUEUX';
  regie: 'CRD' | 'NON CRD';
  price: { unit: number; total: number; currency: string };
  logistics: { unit: string; qty: number; packaging: string; guarantee: string; location: string };
  condition: { general: string; level: string; capsule: string; label: string; sellerType: string };
  status: 'DISPONIBLE' | 'A L\'ETUDE' | 'VENDU' | 'BROUILLON';
  ref: string;
  date: string;
  brokerNote: string;
  photos: string[];
  interestDate?: string;
  interestType?: 'PRIMARY' | 'WAITLIST';
}

export interface Request {
  id: number;
  ownerId: string;
  productName: string;
  vintage: number;
  format: string;
  qty: number;
  targetPrice: number;
  comment: string; // 👇 NOUVEAU CHAMP
  date: string;
  status: 'ACTIVE';
}

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  
  private mockOffers: Offer[] = [
    {
      id: 1,
      ownerId: 'USER_2',
      name: 'Château Lafite Rothschild',
      vintage: 2001,
      region: 'Pauillac, 1er Grand Cru Classé',
      productType: 'VIN ROUGE',
      regie: 'CRD',
      price: { unit: 980, total: 11760, currency: 'EUR' },
      logistics: { unit: 'Bouteille (75cl)', qty: 12, packaging: 'CBO', guarantee: 'Non', location: 'Bordeaux' },
      condition: { general: 'Parfait', level: 'Col', capsule: 'Intacte', label: 'Impeccable', sellerType: 'Négoce' },
      status: 'DISPONIBLE',
      ref: 'LAF-01-BX',
      date: '30/01/2026',
      brokerNote: 'Lot exceptionnel. Provenance directe château.',
      photos: ['https://placehold.co/400x600/f1f5f9/334155?text=Chateau+Lafite', 'https://placehold.co/400x600/f1f5f9/334155?text=Caisse+Bois']
    }
  ];

  private mockRequests: Request[] = [
    {
      id: 10001,
      ownerId: 'USER_3',
      productName: 'Petrus',
      vintage: 2015,
      format: 'Bouteille (75cl)',
      qty: 6,
      targetPrice: 3500,
      comment: 'Recherche caisse bois d\'origine uniquement. État parfait exigé.',
      date: '02/02/2026',
      status: 'ACTIVE'
    }
  ];

  offers = signal<Offer[]>(this.mockOffers);
  requests = signal<Request[]>(this.mockRequests);

  // --- OFFRES ---
  getOfferById(id: number): Offer | undefined { return this.offers().find(o => o.id === id); }
  getBlankOffer(ownerId: string): Offer {
    const current = this.offers();
    const nextId = current.length > 0 ? Math.max(...current.map(o => o.id)) + 1 : 1;
    return {
      id: nextId, ownerId: ownerId, name: '', vintage: new Date().getFullYear(), region: '', productType: 'VIN ROUGE', regie: 'CRD', price: { unit: 0, total: 0, currency: 'EUR' }, logistics: { unit: 'Bouteille (75cl)', qty: 12, packaging: 'Carton', guarantee: 'Non', location: 'Entrepôt' }, condition: { general: 'Bon', level: 'Normal', capsule: 'Intacte', label: 'Intacte', sellerType: 'Négoce' }, status: 'BROUILLON', ref: `REF-${nextId}`, date: new Date().toLocaleDateString('fr-FR'), brokerNote: '', photos: ['https://placehold.co/400x600/e2e8f0/64748b?text=Nouvelle+Offre']
    };
  }
  addOffer(newOffer: Offer) { this.offers.update(current => [newOffer, ...current]); }
  updateOffer(updatedOffer: Offer) { this.offers.update(current => current.map(o => o.id === updatedOffer.id ? updatedOffer : o)); }
  deleteOffer(id: number) { this.offers.update(current => current.filter(o => o.id !== id)); }
  markAsContacted(id: number, type: 'PRIMARY' | 'WAITLIST') { const today = new Date().toLocaleDateString('fr-FR'); this.offers.update(current => current.map(o => o.id === id ? { ...o, interestDate: today, interestType: type } : o)); }

  // --- DEMANDES ---
  getRequestById(id: number): Request | undefined { return this.requests().find(r => r.id === id); }
  getBlankRequest(ownerId: string): Request {
    const current = this.requests();
    const nextId = current.length > 0 ? Math.max(...current.map(r => r.id)) + 1 : 10000;
    return {
      id: nextId, ownerId: ownerId, productName: '', vintage: new Date().getFullYear(), format: 'Bouteille (75cl)', qty: 12, targetPrice: 0, comment: '', date: new Date().toLocaleDateString('fr-FR'), status: 'ACTIVE'
    };
  }
  addRequest(newRequest: Request) { this.requests.update(current => [newRequest, ...current]); }
  updateRequest(updatedRequest: Request) { this.requests.update(current => current.map(r => r.id === updatedRequest.id ? updatedRequest : r)); }
  deleteRequest(id: number) { this.requests.update(current => current.filter(r => r.id !== id)); }
}