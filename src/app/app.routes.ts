import { Routes } from '@angular/router';
import { App } from './app';
import { Home } from './features/home/home';
import { PurchaseOrderList } from './features/purchase-order/components/purchase-order-list/purchase-order-list';

export const routes: Routes = [
  //   { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'poList', component: PurchaseOrderList },
];
