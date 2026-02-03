import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h2 class="text-3xl font-bold mb-4">Tableau de bord</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-6 rounded shadow">Statistique A</div>
      <div class="bg-white p-6 rounded shadow">Statistique B</div>
      <div class="bg-white p-6 rounded shadow">Statistique C</div>
    </div>
  `
})
export class DashboardComponent {}