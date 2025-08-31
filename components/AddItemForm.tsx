
import React, { useState, useEffect } from 'react';
import { BillItem, ItemType, ItemStatus } from '../types';

interface AddItemFormProps {
  onAddItem: (item: Omit<BillItem, 'id' | 'status'>) => void;
  onEditItem: (item: BillItem) => void;
  itemToEdit: BillItem | null;
  onCancel: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, onEditItem, itemToEdit, onCancel }) => {
  const [type, setType] = useState<ItemType>(ItemType.MONTHLY_BILL);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [dueDate, setDueDate] = useState('');
  const [rechargeDate, setRechargeDate] = useState('');
  const [validityDays, setValidityDays] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const isEditing = !!itemToEdit;

  useEffect(() => {
    if (itemToEdit) {
      setType(itemToEdit.type);
      setName(itemToEdit.name);
      setAmount(itemToEdit.type === ItemType.EVENT ? '' : itemToEdit.amount);
      setDueDate(itemToEdit.dueDate ? new Date(itemToEdit.dueDate).toISOString().split('T')[0] : '');
      setRechargeDate(itemToEdit.rechargeDate ? new Date(itemToEdit.rechargeDate).toISOString().split('T')[0] : '');
      setValidityDays(itemToEdit.validityDays || '');
      setNotes(itemToEdit.notes || '');
    } else {
      // Reset form when adding a new item
      setType(ItemType.MONTHLY_BILL);
      setName('');
      setAmount('');
      setDueDate('');
      setRechargeDate('');
      setValidityDays('');
      setNotes('');
    }
  }, [itemToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || (type !== ItemType.EVENT && (amount === '' || amount < 0))) {
      alert('Please fill all required fields correctly.');
      return;
    }

    let calculatedDueDate = dueDate;

    if (type === ItemType.RECHARGE) {
      if (!rechargeDate || validityDays === '' || validityDays <= 0) {
        alert('Please fill all recharge details correctly.');
        return;
      }
      const rechargeDt = new Date(rechargeDate);
      rechargeDt.setDate(rechargeDt.getDate() + Number(validityDays));
      calculatedDueDate = rechargeDt.toISOString().split('T')[0];
    } else {
      if (!dueDate) {
        alert('Please provide a due/event date.');
        return;
      }
    }

    const itemData = {
      name,
      type,
      amount: type === ItemType.EVENT ? 0 : Number(amount),
      dueDate: calculatedDueDate,
      notes,
      ...(type === ItemType.RECHARGE && { 
        rechargeDate: new Date(rechargeDate).toISOString(), 
        validityDays: Number(validityDays) 
      }),
    };
    
    if (isEditing) {
      const newStatus = itemToEdit.status === ItemStatus.PAID
          ? ItemStatus.PAID
          : new Date(itemData.dueDate) < new Date() ? ItemStatus.OVERDUE : ItemStatus.UPCOMING;
      
      const updatedItem: BillItem = {
        ...itemToEdit,
        ...itemData,
        status: newStatus,
      };
      onEditItem(updatedItem);
    } else {
      onAddItem(itemData);
    }
  };
  
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {isEditing ? 'Edit Item' : 'Add New Item'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as ItemType)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {Object.values(ItemType).map(itemType => (
              <option key={itemType} value={itemType}>{itemType}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            placeholder={
                type === ItemType.RECHARGE ? 'e.g., Airtel Mobile' :
                type === ItemType.EMI ? 'e.g., Home Loan EMI' :
                type === ItemType.EVENT ? 'e.g., John\'s Birthday' :
                type === ItemType.MONTHLY_BILL ? 'e.g., Netflix Subscription' :
                'e.g., Water Bill'
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {type !== ItemType.EVENT && (
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
              <input
                type="number"
                id="amount"
                placeholder="e.g., 50.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min="0"
                step="0.01"
              />
            </div>
        )}

        {type !== ItemType.RECHARGE && (
            <div className={type === ItemType.EVENT ? 'md:col-span-2' : ''}>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {type === ItemType.EVENT ? 'Event Date' : 'Due Date'}
                </label>
                <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
            </div>
        )}

        {type === ItemType.RECHARGE && (
          <>
            <div>
              <label htmlFor="rechargeDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recharge Date</label>
              <input
                type="date"
                id="rechargeDate"
                value={rechargeDate}
                onChange={(e) => setRechargeDate(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                max={today}
              />
            </div>
            <div>
              <label htmlFor="validityDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plan Validity (Days)</label>
              <input
                type="number"
                id="validityDays"
                placeholder="e.g., 84"
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min="1"
              />
            </div>
          </>
        )}
        
        {type !== ItemType.RECHARGE && (
            <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g., Buy a gift"
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
        )}
        
        <div className="md:col-span-2 flex justify-end gap-4">
          <button type="button" onClick={onCancel} className="w-full md:w-auto inline-flex justify-center py-3 px-8 border border-gray-300 dark:border-gray-500 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
            Cancel
          </button>
          <button type="submit" className="w-full md:w-auto inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {isEditing ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;
