
import React from 'react';
import { BillItem, ItemStatus } from '../types';
import { CashIcon, CreditCardIcon } from './icons/Icons';

interface SummaryWidgetProps {
  items: BillItem[];
}

const SummaryWidget: React.FC<SummaryWidgetProps> = ({ items }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthItems = items.filter(item => {
    const itemDate = new Date(item.status === ItemStatus.PAID && item.paidDate ? item.paidDate : item.dueDate);
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  });

  const totalPaid = thisMonthItems
    .filter(item => item.status === ItemStatus.PAID)
    .reduce((sum, item) => sum + item.amount, 0);

  const totalUpcoming = thisMonthItems
    .filter(item => item.status !== ItemStatus.PAID)
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">This Month's Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
            <CashIcon className="h-6 w-6 text-status-paid" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Paid</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">${totalPaid.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/50 rounded-lg">
          <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-800">
            <CreditCardIcon className="h-6 w-6 text-status-due-soon" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Upcoming</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">${totalUpcoming.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryWidget;
