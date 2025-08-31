
import React, { useState, useMemo } from 'react';
import { BillItem } from '../types';
import { TrashIcon, CheckCircleIcon, SearchIcon, EditIcon, UndoIcon } from './icons/Icons';

interface PaidItemsHistoryProps {
  items: BillItem[];
  onDeleteItem: (id: string) => void;
  onMarkAsUnpaid: (id: string) => void;
  onEditItem: (item: BillItem) => void;
}

const PaidItemsHistory: React.FC<PaidItemsHistoryProps> = ({ items, onDeleteItem, onMarkAsUnpaid, onEditItem }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items
      .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime());
  }, [items, searchTerm]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Paid History</h2>
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <SearchIcon className="h-5 w-5 text-gray-400"/>
        </span>
        <input
            type="text"
            placeholder="Search paid items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>
      <div className="max-h-96 overflow-y-auto pr-2">
        {filteredItems.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems.map(item => (
              <li key={item.id} className="py-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <CheckCircleIcon className="h-6 w-6 text-status-paid flex-shrink-0" />
                    <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Paid on {new Date(item.paidDate!).toLocaleDateString()}
                             {item.type !== 'Event' && ` - $${item.amount.toFixed(2)}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center flex-shrink-0 gap-1">
                  <button
                    onClick={() => onMarkAsUnpaid(item.id)}
                    className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    aria-label="Mark as Unpaid"
                  >
                    <UndoIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onEditItem(item)}
                    className="p-2 text-gray-400 hover:text-yellow-500 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-colors"
                    aria-label="Edit Item"
                  >
                    <EditIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    aria-label="Delete Item"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No paid items match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaidItemsHistory;
