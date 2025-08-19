
import React from 'react';
import type { OrderDetailsModalData } from '../types';
import XMarkIcon from './icons/XMarkIcon';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: OrderDetailsModalData | null;
  isLoading: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, data, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Состав заказа</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <XMarkIcon className="h-6 w-6 text-slate-600" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <svg className="animate-spin h-8 w-8 text-brand-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : data ? (
            <div className="space-y-3">
              {data.productsInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-slate-800">{item.name}</h4>
                    <p className="text-slate-500">{item.quantity} шт.</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-10 text-slate-500">Не удалось загрузить детали заказа.</p>
          )}
        </div>
        <div className="p-4 border-t border-slate-200">
            <button onClick={onClose} className="w-full bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors">
                Закрыть
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;