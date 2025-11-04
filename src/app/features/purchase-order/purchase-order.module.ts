import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RouterModule, Routes } from '@angular/router';

import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderCreateComponent } from './components/purchase-order-create/purchase-order-create.component';

const routes: Routes = [
  { path: 'poList', component: PurchaseOrderListComponent },
  { path: 'poCreate', component: PurchaseOrderCreateComponent },
];

@NgModule({
  declarations: [PurchaseOrderListComponent, PurchaseOrderCreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    PaginationModule,
    RouterModule.forChild(routes),
  ],
})
export class PurchaseOrderModule {}
