// This interface represents a VAT rate option that can be applied to a purchase order
export interface VatRateModel {
  vatRateId: number;
  vatPercentage: number;
  description?: string;
}
