
import React, { useState } from 'react';
import { DELIVERY_ADDRESSES } from '../constants';
import LocationPinIcon from './icons/LocationPinIcon';

interface AddressSelectorProps {
  selectedAddress: string;
  onSelect: (address: string) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ selectedAddress, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (address: string) => {
    onSelect(address);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-brand"
      >
        <div className="flex items-center gap-3">
          <LocationPinIcon className="w-6 h-6 text-brand-orange" />
          <div>
            <p className="text-xs text-slate-500 text-left">Доставка</p>
            <p className="font-bold text-slate-800 text-left">{selectedAddress}</p>
          </div>
        </div>
        <svg className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg z-10 p-2 max-h-60 overflow-y-auto">
          {DELIVERY_ADDRESSES.map(address => (
            <button
              key={address}
              onClick={() => handleSelect(address)}
              className={`w-full text-left px-4 py-2 rounded-lg hover:bg-slate-100 ${selectedAddress === address ? 'font-bold text-brand-orange' : 'text-slate-700'}`}
            >
              {address}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
