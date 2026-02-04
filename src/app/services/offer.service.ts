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
      name: 'Château Margaux',
      vintage: 2015,
      region: 'Margaux, 1er Grand Cru Classé',
      productType: 'VIN ROUGE',
      regie: 'CRD',
      price: { unit: 1250, total: 7500, currency: 'EUR' },
      logistics: { unit: 'Bouteille (75cl)', qty: 6, packaging: 'CBO', guarantee: 'Non', location: 'Bordeaux' },
      condition: { general: 'Parfait', level: 'PArfait', capsule: 'Intacte', label: 'Parfait', sellerType: 'Négoce' },
      status: 'DISPONIBLE',
      ref: 'MAR-15-BX',
      date: '02/02/2026',
      brokerNote: 'Caisse bois d\'origine non ouverte. Provenance directe propriété.',
      photos: ['assets/CHTM.webp','assets/M2.webp']
    },
    {
      id: 2,
      ownerId: 'USER_2',
      name: 'Puligny-Montrachet Leflaive',
      vintage: 2020,
      region: 'Bourgogne',
      productType: 'VIN BLANC',
      regie: 'NON CRD',
      price: { unit: 210, total: 2520, currency: 'EUR' },
      logistics: { unit: 'Bouteille (75cl)', qty: 12, packaging: 'Carton', guarantee: 'Non', location: 'Beaune' },
      condition: { general: 'Très Bon', level: 'épaule', capsule: 'Légèrement frottée', label: 'Intacte', sellerType: 'Particulier' },
      status: 'A L\'ETUDE',
      ref: 'LEF-20-BG',
      date: '28/01/2026',
      brokerNote: 'Lot rare sur le marché. Quelques traces mineures sur les capsules.',
      photos: ['assets/DF.webp']
    },
    {
      id: 3,
      ownerId: 'USER_2',
      name: 'Dom Pérignon Plénitude P2',
      vintage: 2004,
      region: 'Champagne',
      productType: 'CHAMPAGNE',
      regie: 'CRD',
      price: { unit: 480, total: 1440, currency: 'EUR' },
      logistics: { unit: 'Bouteille (75cl)', qty: 3, packaging: 'Coffret Individuel', guarantee: 'Oui', location: 'Paris' },
      condition: { general: 'Parfait', level: 'Parfait', capsule: 'Intacte', label: 'Parfaite', sellerType: 'Caviste' },
      status: 'DISPONIBLE',
      ref: 'DOM-04-P2',
      date: '03/02/2026',
      brokerNote: 'Coffrets scellés. Stocké en cave climatisée depuis l\'achat.',
      photos: ['assets/D.jpg']
    },
    {
      id: 4,
      ownerId: 'USER_2',
      name: 'Château Mouton Rothschild',
      vintage: 2000,
      region: 'Pauillac, 1er Grand Cru Classé',
      productType: 'VIN ROUGE',
      regie: 'NON CRD',
      price: { unit: 2100, total: 2100, currency: 'EUR' },
      logistics: { unit: 'Magnum (150cl)', qty: 1, packaging: 'Aucun', guarantee: 'Non', location: 'Bordeaux' },
      condition: { general: 'Bon', level: 'Épaule - bas', capsule: 'Intacte', label: 'Légèrement tachée', sellerType: 'Négoce' },
      status: 'VENDU',
      ref: 'MOU-00-MG',
      date: '15/01/2026',
      brokerNote: 'Bouteille iconique du millénaire. Étiquette "Bélier d\'Or".',
      photos: ['assets/M.jpg']
    },
    {
      id: 5,
      ownerId: 'USER_2',
      name: 'Macallan 25 Years Sherry Oak',
      vintage: 2023,
      region: 'Ecosse, Speyside',
      productType: 'SPIRITUEUX',
      regie: 'NON CRD',
      price: { unit: 390, total: 2340, currency: 'EUR' },
      logistics: { unit: 'Bouteille (70cl)', qty: 6, packaging: 'Carton Origine', guarantee: 'Oui', location: 'Londres' },
      condition: { general: 'Parfait', level: 'Parfait', capsule: 'Scellée', label: 'Parfait', sellerType: 'Distributeur' },
      status: 'BROUILLON',
      ref: 'MAC-18-SC',
      date: '03/02/2026',
      brokerNote: 'En attente de validation des photos par le vendeur.',
      photos: ['assets/M1.webp']
    },
    {
      id: 6,
      ownerId: 'USER_2',
      name: 'Château d\'Yquem',
      vintage: 2015,
      region: 'Sauternes, 1er Cru Supérieur',
      productType: 'VIN BLANC',
      regie: 'CRD',
      price: { unit: 350, total: 4200, currency: 'EUR' },
      logistics: { unit: 'Bouteille (75cl)', qty: 12, packaging: 'CBO', guarantee: 'Non', location: 'Bordeaux' },
      condition: { general: 'Parfait', level: 'Normal', capsule: 'Intacte', label: 'Parfait', sellerType: 'Négoce' },
      status: 'DISPONIBLE',
      ref: 'YQU-15-ST',
      date: '01/02/2026',
      brokerNote: '100/100 Parker. Potentiel de garde immense.',
      photos: ['assets/Y.webp']
    }
  ];

private mockRequests: Request[] = [
    {
      id: 10001,
      ownerId: 'USER_3',
      productName: 'Sassicaia',
      vintage: 2016,
      format: 'Bouteille (75cl)',
      qty: 12,
      targetPrice: 380,
      comment: 'Recherche CBO uniquement. Bandes de garantie souhaitées mais pas obligatoires. Urgent pour client export.',
      date: '02/02/2026',
      status: 'ACTIVE'
    },
    {
      id: 10002,
      ownerId: 'USER_3',
      productName: 'Salon Le Mesnil',
      vintage: 2000,
      format: 'Magnum (150cl)',
      qty: 3,
      targetPrice: 2200,
      comment: 'État parfait exigé. Photos HD des étiquettes + niveau demandées avant validation.',
      date: '29/01/2026',
      status: 'ACTIVE'
    },
    {
      id: 10003,
      ownerId: 'USER_3',
      productName: 'Chartreuse VEP Verte',
      vintage: 1990,
      format: 'Bouteille (100cl)',
      qty: 24,
      targetPrice: 0, // NC
      comment: 'Recherche mil. 1990 pour constitution verticale. Faire offre selon quantités disponibles. Accepte panachage avec VEP Jaune.',
      date: '03/02/2026',
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