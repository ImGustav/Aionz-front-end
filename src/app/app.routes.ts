import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'produtos',
    // LAZY LOADING: Carrega as rotas filhas (product.routes.ts)
    // quando o usuário acessar /produtos
    loadChildren: () => import('./features/products/product.routes').then((m) => m.PRODUCT_ROUTES),
  },
  {
    path: '',
    redirectTo: '/produtos',
    pathMatch: 'full',
  },
  {
    path: '**', // Rota "coringa"
    redirectTo: '/produtos',
  },
];
