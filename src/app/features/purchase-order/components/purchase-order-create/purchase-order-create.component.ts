import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { SupplierModel } from '../../models/supplier.model';
import { WarehouseModel } from '../../models/warehouse.model';
import { ProductModel } from '../../models/product.model';
import { VatRateModel } from '../../models/vat-rate.model';
import { CommonModule } from '@angular/common';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { Observable, Subject, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-order-create',
  standalone: false,
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order-create.component.css'],
})
export class PurchaseOrderCreateComponent implements OnInit {
  purchaseOrderForm!: FormGroup;

  suppliers$!: Observable<SupplierModel[]>;
  warehouses$!: Observable<WarehouseModel[]>;
  products$!: Observable<ProductModel[]>;
  vatRates$!: Observable<VatRateModel[]>;
  vatRatesAmount = new Subject<number>();

  constructor(
    private fb: FormBuilder,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.purchaseOrderForm = this.fb.group({
      purchaseOrderNumber: ['', Validators.required],
      supplierId: [null, Validators.required],
      warehouseId: [null, Validators.required],
      shippingAddress: ['', Validators.required],
      vatRateId: [null, Validators.required],
      orderDate: [new Date().toISOString().substring(0, 10), Validators.required],
      items: this.fb.array([], Validators.required),
      memoNotes: [''],
      attachmentFileName: [''],
    });
    this.addItem(); // add one initial item
  }
  loadData(): void {
    this.suppliers$ = this.purchaseOrderService.getSuppliers();
    this.warehouses$ = this.purchaseOrderService.getWarehouses();
    this.products$ = this.purchaseOrderService.getProducts();
    this.vatRates$ = this.purchaseOrderService.getVatRates();
  }

  get items(): FormArray {
    return this.purchaseOrderForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]],
      lineTotal: [{ value: 0, disabled: true }],
    });

    itemGroup.valueChanges.subscribe((val) => {
      const total = (val.quantity || 0) * (val.unitPrice || 0);
      itemGroup.get('lineTotal')?.setValue(total, { emitEvent: false });
    });

    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  get subTotal(): number {
    return this.items.controls.reduce(
      (sum, group) => sum + (group.get('lineTotal')?.value || 0),
      0
    );
  }

  get vatAmount(): number {
    const vatRateId = this.purchaseOrderForm.get('vatRateId')?.value;
    const selectedOption = document.querySelector<HTMLSelectElement>(
      'select[formControlName="vatRateId"]'
    );
    const vatText = selectedOption?.selectedOptions[0]?.textContent?.trim() || '';

    const vatPercentage = parseFloat(vatText.replace('%', '').trim());
    if (isNaN(vatPercentage)) return 0;

    return (this.subTotal * vatPercentage) / 100;
  }

  get grandTotal(): number {
    return this.subTotal + this.vatAmount;
  }

  onSubmit(): void {
    if (this.purchaseOrderForm.invalid) {
      this.purchaseOrderForm.markAllAsTouched();
      return;
    }

    const formValue = this.purchaseOrderForm.getRawValue();

    // Build the data object to send
    const newPurchaseOrder = {
      poNumber: formValue.purchaseOrderNumber,
      supplierId: formValue.supplierId,
      warehouseId: formValue.warehouseId,
      shippingAddress: formValue.shippingAddress,
      vatRateId: formValue.vatRateId,
      orderDate: formValue.orderDate,
      items: formValue.items,
      memoNotes: formValue.memoNotes,
      attachmentFileName: formValue.attachmentFileName,
      totalAmount: this.grandTotal,
      status: 'Draft',
    };

    this.purchaseOrderService
      .createPurchaseOrder(newPurchaseOrder)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          console.log('Purchase Order saved:', res);
          alert('Purchase Order saved successfully!');
          this.purchaseOrderForm.reset();
          this.items.clear();
          this.addItem();
        },
        error: (err) => {
          console.error('Error saving purchase order:', err);
          alert('Failed to save Purchase Order. Please try again.');
        },
      });
  }
  onCancel(): void {
    this.router.navigate(['/poList']);
  }
}
