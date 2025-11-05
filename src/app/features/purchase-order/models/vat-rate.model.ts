// This interface represents a VAT rate option that can be applied to a purchase order
export interface VatRateModel {
  vatRateId: string;
  vatPercentage: number;
  description?: string;
}
