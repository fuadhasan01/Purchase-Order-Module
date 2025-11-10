import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { SupplierModel } from '../../models/supplier.model';
import { WarehouseModel } from '../../models/warehouse.model';
import { ProductModel } from '../../models/product.model';
import { VatRateModel } from '../../models/vat-rate.model';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { Observable, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrderItemModel, PurchaseOrderModel } from '../../models/purchase-order.model';

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
  vatRates: VatRateModel[] = [];

  isEditMode = false;
  purchaseOrderId: string | null = null;
  constructor(
    private fb: FormBuilder,
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();

    // Create form with FormBuilder
    this.purchaseOrderForm = this.fb.group({
      purchaseOrderNumber: ['', Validators.required],
      supplierId: [null, Validators.required],
      warehouseId: [null, Validators.required],
      shippingAddress: ['', Validators.required],
      vatRateId: [null, Validators.required],
      orderDate: [new Date(), Validators.required],
      status: [null, Validators.required],
      items: this.fb.array([], Validators.required),
      memoNotes: [''],
      attachmentFileName: [''],
    });

    // Check for Edit Mode first
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.purchaseOrderId = id;
        this.loadPurchaseOrder(id);
      } else {
        this.addItem();
      }
    });
  }
  loadData(): void {
    this.suppliers$ = this.purchaseOrderService.getSuppliers();
    this.warehouses$ = this.purchaseOrderService.getWarehouses();
    this.products$ = this.purchaseOrderService.getProducts();
    this.vatRates$ = this.purchaseOrderService.getVatRates();

    this.vatRates$.pipe(take(1)).subscribe((rates) => {
      this.vatRates = rates;
    });
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
      (sum, field) => sum + (field.get('lineTotal')?.value || 0),
      0
    );
  }

  get vatAmount(): number {
    const vatRateId = this.purchaseOrderForm.get('vatRateId')?.value;
    const selectedRate = this.vatRates.find((r) => r.vatRateId === vatRateId);
    const vatPercentage = selectedRate ? selectedRate.vatPercentage : 0;
    return (this.subTotal * vatPercentage) / 100;
  }

  get grandTotal(): number {
    return this.subTotal + this.vatAmount;
  }

  loadPurchaseOrder(id: string): void {
    this.purchaseOrderService
      .getPurchaseOrderById(id)
      .pipe(take(1))
      .subscribe({
        next: (po) => {
          if (!po) return;

          this.purchaseOrderForm.patchValue({
            purchaseOrderNumber: po.poNumber,
            supplierId: po.supplierId,
            warehouseId: po.warehouseId,
            shippingAddress: po.shippingAddress,
            vatRateId: po.vatRateId,
            status: po.status,
            orderDate: new Date(po.orderDate),
            memoNotes: po.memoNotes,
            // attachmentFileName: po.attachmentFileName,
          });

          // Clear existing items
          this.items.clear();
          console.log('Loaded PO for edit:', po);
          // Patch items
          po.items.forEach((item: any) => {
            const group = this.fb.group({
              productId: [item.productId, Validators.required],
              quantity: [item.quantity, [Validators.required, Validators.min(1)]],
              unitPrice: [item.unitPrice, [Validators.required, Validators.min(0.01)]],
              lineTotal: [{ value: item.quantity * item.unitPrice, disabled: true }],
            });

            group.valueChanges.subscribe((val) => {
              const total = (val.quantity || 0) * (val.unitPrice || 0);
              group.get('lineTotal')?.setValue(total, { emitEvent: false });
            });

            this.items.push(group);
          });
        },
        error: (err) => console.error('Error loading PO for edit:', err),
      });
  }

  onSubmit(): void {
    if (this.purchaseOrderForm.invalid) {
      this.purchaseOrderForm.markAllAsTouched();
      return;
    }

    const formValue = this.purchaseOrderForm.getRawValue();
    const purchaseOrderData = {
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
      status: formValue.status,
    };

    if (this.isEditMode && this.purchaseOrderId) {
      this.purchaseOrderService
        .updatePurchaseOrder(this.purchaseOrderId, purchaseOrderData)
        .pipe(take(1))
        .subscribe({
          next: () => {
            alert('Purchase Order updated successfully!');
            this.router.navigate(['/po/poList']);
          },
          error: (err) => {
            console.error('Error updating PO:', err);
            alert('Failed to update Purchase Order.');
          },
        });
    } else {
      this.purchaseOrderService
        .createPurchaseOrder(purchaseOrderData)
        .pipe(take(1))
        .subscribe({
          next: () => {
            alert('Purchase Order created successfully!');
            this.purchaseOrderForm.reset();
            this.items.clear();
            this.addItem();
            this.router.navigate(['/po/poList']);
          },
          error: (err) => {
            console.error('Error creating PO:', err);
            alert('Failed to create Purchase Order.');
          },
        });
    }
  }
  onCancel(): void {
    this.router.navigate(['/po/poList']);
  }
}
