export type TransactionType = 'income' | 'expense' | 'receivable' | 'payable';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  person?: string;
  note: string;
  date: string;
}

export interface SavingsHistoryItem {
  id: string;
  amount: number;
  type: 'plus' | 'minus';
  date: string;
  note?: string;
}

export interface SavingsSector {
  id: string;
  name: string;
  balance: number;
  history: SavingsHistoryItem[];
}

export interface Person {
  id: string;
  name: string;
  phone?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  currency: string;
}
