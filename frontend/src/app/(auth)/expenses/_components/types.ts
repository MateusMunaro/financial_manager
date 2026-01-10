// Type definitions for expenses module

export interface Expense {
  id: string;
  name: string;
  value: number;
  category: string;
  date: string;
  description?: string | null;
  paymentMethod?: PaymentMethodType | null;
  isRecurring?: boolean;
}

export type PaymentMethodType =
  | 'credit-card'
  | 'debit-card'
  | 'pix'
  | 'bank-slip'
  | 'cash'
  | 'other';

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  lastDigits?: string;
  isDefault: boolean;
  limit?: number;
  usedLimit?: number;
}

export type RecurringFrequency = 'monthly' | 'yearly' | 'weekly';

export interface RecurringExpense {
  id: string;
  name: string;
  value: number;
  category: string;
  frequency: RecurringFrequency;
  dayOfMonth?: number;
  dayOfWeek?: number;
  paymentMethod?: PaymentMethodType;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  description?: string;
}

export type Period = 'day' | 'week' | 'month' | 'year';
