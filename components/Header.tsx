
import React from 'react';
import { WalletIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
        <WalletIcon className="h-8 w-8 text-brand-primary" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          Personal Bill & Reminder Dashboard
        </h1>
      </div>
    </header>
  );
};

export default Header;
