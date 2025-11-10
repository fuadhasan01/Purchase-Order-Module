import { Component, OnInit } from '@angular/core';
import { PurchaseOrderService } from '../purchase-order/services/purchase-order.service';
import { PurchaseOrderModel } from '../purchase-order/models/purchase-order.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {}
