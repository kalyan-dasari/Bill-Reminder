
import React from 'react';
import { BillItem } from '../types';
import ItemCard from './ItemCard';

interface UpcomingItemsListProps {
  items: BillItem[];
  onMarkAsPaid: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: BillItem) => void;
}

const UpcomingItemsList: React.FC<UpcomingItemsListProps> = ({ items, onMarkAsPaid, onDeleteItem, onEditItem }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Upcoming & Overdue</h2>
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map(item => (
            <ItemCard key={item.id} item={item} onMarkAsPaid={onMarkAsPaid} onDeleteItem={onDeleteItem} onEditItem={onEditItem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No upcoming items. You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingItemsList;
