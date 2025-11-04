import { Routes } from '@angular/router';
import { PurchaseOrderListComponent } from './features/purchase-order/components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderCreateComponent } from './features/purchase-order/components/purchase-order-create/purchase-order-create.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'poList', component: PurchaseOrderListComponent },
  { path: 'poCreate', component: PurchaseOrderCreateComponent },
];
