import { Injectable, signal, computed, effect } from '@angular/core';

export type UserRole = 'ADMIN' | 'VENDEUR' | 'ACHETEUR';

export interface User {
  id: string;
  firstname: string; // Nouveau
  lastname: string;  // Nouveau
  name: string;      // On garde ça pour l'affichage global (Header/Sidebar)
  company: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  label: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  readonly users = signal<User[]>([
    { 
      id: 'USER_1', 
      firstname: 'Pierre', lastname: 'Admin', name: 'Pierre Admin', // Concaténé
      company: 'WINE TRADING HQ', 
      email: 'pierre@winetrading.com',
      phone: '+33 6 00 00 00 01',
      password: 'admin', 
      role: 'ADMIN', 
      label: 'Administrateur' 
    },
    { 
      id: 'USER_2', 
      firstname: 'Jean', lastname: 'Dupont', name: 'Jean Dupont',
      company: 'MAISON DUPONT & FILS', 
      email: 'jean.dupont@domain.com',
      phone: '+33 6 12 34 56 78',
      password: 'user123', 
      role: 'VENDEUR', 
      label: 'Vendeur' 
    },
    { 
      id: 'USER_3', 
      firstname: 'Marie', lastname: 'Martin', name: 'Marie Martin',
      company: 'Négociant A',
      email: 'marie.client@import.com',
      phone: '+33 6 98 76 54 32',
      password: 'user123', 
      role: 'ACHETEUR', 
      label: 'Acheteur' 
    }
  ]);

  readonly currentUser = signal<User | null>(null);

  constructor() {
    const savedUser = localStorage.getItem('wine_user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem('wine_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('wine_user');
      }
    });
  }

  loginAs(role: UserRole) {
    const user = this.users().find(u => u.role === role);
    if (user) this.currentUser.set(user);
  }

  logout() { this.currentUser.set(null); }

  // CRUD
  addUser(newUser: Omit<User, 'id' | 'label' | 'name'>) {
    const roleLabel = newUser.role === 'VENDEUR' ? 'Vendeur' : (newUser.role === 'ACHETEUR' ? 'Acheteur' : 'Admin');
    const id = `USER_${this.users().length + 1 + Math.floor(Math.random() * 1000)}`;
    
    // On génère le "Display Name" automatiquement
    const user: User = { 
        ...newUser, 
        id, 
        label: roleLabel,
        name: `${newUser.firstname} ${newUser.lastname}` 
    };
    
    this.users.update(current => [...current, user]);
  }

  updateUser(updatedUser: User) {
    const roleLabel = updatedUser.role === 'VENDEUR' ? 'Vendeur' : (updatedUser.role === 'ACHETEUR' ? 'Acheteur' : 'Admin');
    const userWithLabel = { 
        ...updatedUser, 
        label: roleLabel,
        name: `${updatedUser.firstname} ${updatedUser.lastname}` // Mise à jour du nom complet
    };

    this.users.update(current => 
      current.map(u => u.id === updatedUser.id ? userWithLabel : u)
    );
  }

  deleteUser(id: string) {
    this.users.update(current => current.filter(u => u.id !== id));
  }

  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  isSeller = computed(() => this.currentUser()?.role === 'VENDEUR');
  isBuyer = computed(() => this.currentUser()?.role === 'ACHETEUR');
}