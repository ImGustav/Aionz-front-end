import { Routes } from '@angular/router';

// Este arquivo define as rotas filhas de /produtos
export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    // Carrega o componente de lista na rota /produtos
    loadComponent: () => 
      import('./product-list/product-list.component')
      .then(m => m.ProductListComponent)
  },
  {
    path: ':id', // Rota /produtos/1, /produtos/2, etc.
    // Carrega o componente de detalhe
    loadComponent: () => 
      import('./product-detail/product-detail.component')
      .then(m => m.ProductDetailComponent)
  }
];