

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { FullOrderDetails, OrderStatus } from '../types';
import BarcodeIcon from './icons/BarcodeIcon';

interface EmployeeActiveScreenProps {
    order: FullOrderDetails;
    onStatusUpdate: (newStatus: OrderStatus, delay?: number) => void;
}

const MotionButton = ({ children, onClick, className }: { children: React.ReactNode, onClick: () => void, className: string }) => (
    <motion.button
        onClick={onClick}
        className={className}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
    >
        {children}
    </motion.button>
);

const EmployeeActiveScreen: React.FC<EmployeeActiveScreenProps> = ({ order, onStatusUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(order.deliveryTime * 60);

  useEffect(() => {
    setTimeLeft(order.deliveryTime * 60);
    const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [order.deliveryTime, order.id]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleDelay = () => {
    onStatusUpdate(order.status, order.deliveryTime + 15);
  };
  
  const actionButtons: { [key in OrderStatus]?: JSX.Element } = {
    'принят': <MotionButton onClick={() => onStatusUpdate('сборка')} className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-600 transition-colors">Начать сборку</MotionButton>,
    'сборка': <MotionButton onClick={() => onStatusUpdate('фасовка')} className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-600 transition-colors">Завершить сборку</MotionButton>,
    'фасовка': <MotionButton onClick={() => onStatusUpdate('ожидает курьера')} className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-blue-600 transition-colors">Готово к выдаче</MotionButton>,
    'ожидает курьера': <MotionButton onClick={() => onStatusUpdate('доставляется')} className="w-full bg-yellow-500 text-black font-bold py-4 rounded-xl text-lg hover:bg-yellow-600 transition-colors">Забрал заказ</MotionButton>,
    'доставляется': (
        <div className="flex gap-2">
            <MotionButton onClick={handleDelay} className="w-1/3 bg-slate-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-slate-600 transition-colors">+15 мин</MotionButton>
            <MotionButton onClick={() => onStatusUpdate('доставлен')} className="w-2/3 bg-green-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-green-600 transition-colors">Доставил</MotionButton>
        </div>
    )
  };
  
  const renderActionButtons = () => {
    return actionButtons[order.status] || <p className="text-center font-bold text-slate-600">Заказ в статусе: {order.status}</p>;
  }

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-2xl shadow-brand">
      <div className="flex-shrink-0 border-b pb-4 mb-4">
        <div className="flex justify-between items-center mb-1">
            <h1 className="text-3xl font-bold text-slate-900">Заказ #{order.orderNumber}</h1>
            <p className="font-mono text-3xl font-bold text-slate-900">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
        </div>
        <p className="text-slate-500 font-medium">Адрес: <span className="font-bold text-slate-700">{order.address}</span></p>
      </div>

      <div className="flex-grow overflow-y-auto -mx-2 px-2 space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Состав заказа:</h2>
        {order.productsInfo.map((p, index) => {
            const isWeightBased = p.weightStatus === 'на развес';
            const unit = isWeightBased ? 'кг' : 'шт';
            const approxPieces = (isWeightBased && p.weightPerPiece && p.quantity > 0)
                ? Math.round(p.quantity / p.weightPerPiece)
                : 0;
          
            return (
              <div key={index} className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg">
                  <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-grow">
                      <div className="flex justify-between items-start">
                          <p className="font-semibold text-slate-800 pr-2">{p.name}</p>
                          <p className="font-bold text-brand-orange text-lg whitespace-nowrap">{p.quantity} {unit}</p>
                      </div>

                      <div className="flex items-center justify-between text-slate-500 mt-1">
                          <div className="flex items-center gap-2 text-xs">
                              {isWeightBased && approxPieces > 0 && (
                                  <span className="font-medium bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">≈ {approxPieces} шт.</span>
                              )}
                              {!isWeightBased && p.weight && (
                                  <span className="font-medium">{p.weight}</span>
                              )}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                              <BarcodeIcon className="w-4 h-4" />
                              <p className="text-xs font-mono tracking-wider">{p.barcode}</p>
                          </div>
                      </div>
                  </div>
              </div>
            )
        })}
      </div>

      <div className="flex-shrink-0 mt-4">
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default EmployeeActiveScreen;