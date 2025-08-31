
import React from 'react';
import { BillItem, ItemStatus } from '../types';
import SummaryWidget from './SummaryWidget';
import UpcomingItemsList from './UpcomingItemsList';
import PaidItemsHistory from './PaidItemsHistory';

interface DashboardProps {
  items: BillItem[];
  onMarkAsPaid: (id: string) => void;
  onMarkAsUnpaid: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: BillItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ items, onMarkAsPaid, onMarkAsUnpaid, onDeleteItem, onEditItem }) => {
  const upcomingItems = items.filter(item => item.status !== ItemStatus.PAID);
  const paidItems = items.filter(item => item.status === ItemStatus.PAID);

  return (
    <div className="space-y-8">
      <SummaryWidget items={items} />
      <div className="grid grid-cols-1 gap-8">
        <UpcomingItemsList items={upcomingItems} onMarkAsPaid={onMarkAsPaid} onDeleteItem={onDeleteItem} onEditItem={onEditItem} />
        <PaidItemsHistory items={paidItems} onDeleteItem={onDeleteItem} onMarkAsUnpaid={onMarkAsUnpaid} onEditItem={onEditItem} />
      </div>
    </div>
  );
};

export default Dashboard;
