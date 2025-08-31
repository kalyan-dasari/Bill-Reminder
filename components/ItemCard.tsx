
import React from 'react';
import { BillItem, ItemStatus, ItemType } from '../types';
import { TrashIcon, CheckIcon, CalendarIcon, RechargeIcon, EmiIcon, EventIcon, BillIcon, OtherIcon, EditIcon } from './icons/Icons';

interface ItemCardProps {
  item: BillItem;
  onMarkAsPaid: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (item: BillItem) => void;
}

const getStatusStyles = (item: BillItem) => {
  switch (item.status) {
    case ItemStatus.OVERDUE:
      return {
        borderColor: 'border-status-overdue',
        textColor: 'text-status-overdue',
        bgColor: 'bg-red-50 dark:bg-red-900/50',
      };
    case ItemStatus.UPCOMING:
      const today = new Date();
      const dueDate = new Date(item.dueDate);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 3) {
        return {
          borderColor: 'border-status-due-soon',
          textColor: 'text-status-due-soon',
          bgColor: 'bg-orange-50 dark:bg-orange-900/50',
        };
      }
      return {
        borderColor: 'border-gray-300 dark:border-gray-600',
        textColor: 'text-gray-500 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-700/50',
      };
    default:
      return {
        borderColor: 'border-gray-200 dark:border-gray-700',
        textColor: 'text-gray-500 dark:text-gray-400',
        bgColor: 'bg-white dark:bg-gray-800',
      };
  }
};

const getItemIcon = (type: ItemType) => {
    const className="h-6 w-6 text-brand-primary";
    switch(type) {
        case ItemType.RECHARGE: return <RechargeIcon className={className} />;
        case ItemType.EMI: return <EmiIcon className={className} />;
        case ItemType.EVENT: return <EventIcon className={className} />;
        case ItemType.MONTHLY_BILL: return <BillIcon className={className} />;
        case ItemType.OTHER: return <OtherIcon className={className} />;
        default: return <BillIcon className={className} />;
    }
}


const ItemCard: React.FC<ItemCardProps> = ({ item, onMarkAsPaid, onDeleteItem, onEditItem }) => {
  const { borderColor, textColor, bgColor } = getStatusStyles(item);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(item.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getRemainingDaysText = () => {
    if (item.status === ItemStatus.OVERDUE) {
      return `Overdue by ${Math.abs(diffDays)} day(s)`;
    }
    if (diffDays === 0) {
      return 'Due today';
    }
    if (diffDays === 1) {
        return 'Due tomorrow';
    }
    return `${diffDays} days left`;
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-shadow hover:shadow-md ${borderColor} ${bgColor}`}>
      <div className="flex items-center gap-4 flex-grow">
        <div className="flex-shrink-0">{getItemIcon(item.type)}</div>
        <div>
          <p className="font-bold text-lg text-gray-800 dark:text-white">{item.name}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{new Date(item.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
           {item.type === ItemType.RECHARGE && item.validityDays && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">({item.validityDays} days validity)</p>
            )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <div className="flex flex-col items-start sm:items-end flex-grow">
           {item.type !== ItemType.EVENT && (
            <p className="text-xl font-semibold text-gray-900 dark:text-white">${item.amount.toFixed(2)}</p>
           )}
          <p className={`text-sm font-medium ${textColor}`}>{getRemainingDaysText()}</p>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {item.type !== ItemType.EVENT && (
            <button
              onClick={() => onMarkAsPaid(item.id)}
              className="p-2 bg-green-100 dark:bg-green-800 text-status-paid rounded-full hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
              aria-label="Mark as Paid"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
          )}
           <button
            onClick={() => onEditItem(item)}
            className="p-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-500 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors"
            aria-label="Edit Item"
          >
            <EditIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDeleteItem(item.id)}
            className="p-2 bg-red-100 dark:bg-red-800 text-status-overdue rounded-full hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            aria-label="Delete Item"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
