
import React, { useState, useCallback, useEffect } from 'react';
import { BillItem, ItemStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import AddItemForm from './components/AddItemForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [items, setItems] = useLocalStorage<BillItem[]>('billItems', []);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItem | null>(null);

  const updateItemStatus = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const updatedItems = items.map(item => {
      if (item.status === ItemStatus.PAID) {
        return item;
      }
      const dueDate = new Date(item.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Normalize to start of day

      if (dueDate < today) {
        return { ...item, status: ItemStatus.OVERDUE };
      }
      return { ...item, status: ItemStatus.UPCOMING };
    });

    if (JSON.stringify(items) !== JSON.stringify(updatedItems)) {
        setItems(updatedItems);
    }
  }, [items, setItems]);

  useEffect(() => {
    updateItemStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on initial mount

  const handleOpenAddForm = () => {
    setEditingItem(null);
    setIsFormVisible(true);
  };

  const handleOpenEditForm = (item: BillItem) => {
    setEditingItem(item);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setEditingItem(null);
    setIsFormVisible(false);
  };

  const addItem = (item: Omit<BillItem, 'id' | 'status'>) => {
    const newItem: BillItem = {
      ...item,
      id: Date.now().toString(),
      status: new Date(item.dueDate) < new Date() ? ItemStatus.OVERDUE : ItemStatus.UPCOMING,
    };
    setItems(prevItems => [...prevItems, newItem].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    handleCloseForm();
  };

  const editItem = (updatedItem: BillItem) => {
    setItems(items.map(item => (item.id === updatedItem.id ? updatedItem : item))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    handleCloseForm();
  };

  const markAsPaid = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, status: ItemStatus.PAID, paidDate: new Date().toISOString() } : item));
  };
  
  const markAsUnpaid = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(item.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        const newStatus = dueDate < today ? ItemStatus.OVERDUE : ItemStatus.UPCOMING;
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { paidDate, ...rest } = item;
        return { ...rest, status: newStatus };
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleOpenAddForm}
            className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition duration-200 ease-in-out flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Item
          </button>
        </div>

        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8 w-11/12 md:w-2/3 lg:w-1/2 max-w-2xl max-h-full overflow-y-auto">
               <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                aria-label="Close form"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <AddItemForm 
                onAddItem={addItem} 
                onEditItem={editItem}
                itemToEdit={editingItem}
                onCancel={handleCloseForm} 
              />
            </div>
          </div>
        )}
        
        <Dashboard 
          items={items} 
          onMarkAsPaid={markAsPaid}
          onMarkAsUnpaid={markAsUnpaid}
          onDeleteItem={deleteItem}
          onEditItem={handleOpenEditForm}
        />
      </main>
    </div>
  );
};

export default App;
