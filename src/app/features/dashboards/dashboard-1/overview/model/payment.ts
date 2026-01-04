export const PAYMENT_STATUS = ['success', 'processing', 'failed'] as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

export interface Payment {
  status: PaymentStatus;
  email: string;
  amount: number;
}
