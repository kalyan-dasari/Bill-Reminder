
export enum ItemType {
  RECHARGE = 'Recharge',
  EMI = 'EMI',
  EVENT = 'Event',
  MONTHLY_BILL = 'Monthly Bill',
  OTHER = 'Other',
}

export enum ItemStatus {
  UPCOMING = 'Upcoming',
  PAID = 'Paid',
  OVERDUE = 'Overdue',
}

export interface BillItem {
  id: string;
  name: string;
  type: ItemType;
  amount: number;
  dueDate: string; // ISO string format
  status: ItemStatus;
  notes?: string;
  rechargeDate?: string; // ISO string format
  validityDays?: number;
  paidDate?: string; // ISO string format
}
