

import React from 'react';
import { useCart } from '../contexts/CartContext';
import type { CartItem } from '../types';
import XMarkIcon from './icons/XMarkIcon';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import TrashIcon from './icons/TrashIcon';
import EmptyCartIcon from './icons/EmptyCartIcon';
import StarIcon from './icons/StarIcon';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, adjustmentNotifications, cartWeight } = useCart();
  const deliveryFee = cartItems.length > 0 ? 99.00 : 0;
  const finalTotal = cartTotal + deliveryFee;
  const MAX_WEIGHT = 10;
  const isOverweight = cartWeight > MAX_WEIGHT;

  const getItemFinalPrice = (item: CartItem) => {
      const isWeightBased = item.weightStatus === 'на развес' && item.pricePerKg;
      const unitPrice = isWeightBased ? item.pricePerKg! : item.price;
      const finalUnitPrice = (item.discount && item.discount > 0)
          ? unitPrice * (1 - item.discount / 100)
          : unitPrice;
      return finalUnitPrice * item.quantity;
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-5 bg-white border-b border-slate-200">
            <h2 className="text-2xl font-bold">Корзина</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
              <XMarkIcon className="h-6 w-6 text-slate-600" />
            </button>
          </div>
          
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col justify-center items-center text-center p-5">
              <EmptyCartIcon className="w-40 h-40 text-slate-200 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700">Ваша корзина пуста</h3>
              <p className="text-slate-500 mt-2">Похоже, вы еще ничего не добавили.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {cartItems.map(item => {
                const itemTotal = getItemFinalPrice(item);
                const isUnavailable = item.availableStock <= 0;
                const adjustment = adjustmentNotifications.get(item.id);
                const isWeightBased = item.weightStatus === 'на развес';
                const unit = isWeightBased ? 'кг' : 'шт';
                
                let step = 1;
                if (isWeightBased) {
                    if (item.weightPerPiece && item.weightPerPiece >= 1) {
                        step = 1;
                    } else if (item.weightPerPiece && item.weightPerPiece < 0.04) {
                        step = 0.1;
                    } else {
                        step = 0.5;
                    }
                }

                const pricePerUnit = isWeightBased && item.pricePerKg
                    ? item.pricePerKg
                    : item.price;
                
                const discountedUnitPrice = (item.discount && item.discount > 0)
                    ? pricePerUnit * (1 - item.discount/100)
                    : pricePerUnit;
                
                const originalItemTotal = pricePerUnit * item.quantity;

                return (
                  <div key={item.id} className={`relative flex items-center gap-4 bg-white p-4 rounded-xl shadow-brand transition-all duration-300 ${isUnavailable ? 'opacity-60 grayscale' : ''}`}>
                    {adjustment && (
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-full ml-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-md shadow-lg animate-pulse-and-fade z-10">
                            -{adjustment} {unit}
                        </div>
                    )}
                    <div className="relative flex-shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                        {item.discount > 0 && (
                            <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                                -{item.discount}%
                            </div>
                        )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm leading-tight text-slate-800 pr-2">{item.name}</h4>
                            {item.rating > 0 && (
                                <div className="flex items-center gap-1 text-slate-500 text-xs flex-shrink-0">
                                    <StarIcon className="w-4 h-4 text-yellow-500" />
                                    <span className="font-bold">{item.rating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                      </div>
                      
                      <div className="flex items-baseline gap-2">
                          {item.discount > 0 ? (
                            <>
                              <p className="text-sm font-bold text-red-500">{discountedUnitPrice.toFixed(0)} ₽/{isWeightBased ? 'кг' : 'шт'}</p>
                              <p className="text-xs text-slate-400 line-through">{pricePerUnit.toFixed(0)} ₽</p>
                            </>
                          ) : (
                            <p className="text-sm font-semibold text-slate-800">{pricePerUnit.toFixed(0)} ₽/{isWeightBased ? 'кг' : 'шт'}</p>
                          )}
                      </div>
                      
                      {isUnavailable ? (
                         <div className="mt-2 text-center">
                            <p className="font-bold text-red-600 text-xs mb-1">Раскупили</p>
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="w-full bg-red-500 text-white font-bold py-1.5 px-2 rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-red-600 transition-colors"
                            >
                                <TrashIcon className="w-4 h-4" />
                                <span>Удалить</span>
                            </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-slate-100 rounded-lg h-9 w-36 mt-2">
                          <button onClick={() => updateQuantity(item.id, Number((item.quantity - step).toFixed(2)))} className="px-3 h-full text-slate-600 hover:text-brand-orange rounded-l-lg"><MinusIcon className="h-4 w-4"/></button>
                          <span className="font-bold text-base text-center text-slate-800 whitespace-nowrap">{item.quantity} {unit}</span>
                          <button onClick={() => updateQuantity(item.id, Number((item.quantity + step).toFixed(2)))} className="px-3 h-full text-slate-600 hover:text-brand-orange rounded-r-lg"><PlusIcon className="h-4 w-4"/></button>
                        </div>
                      )}
                    </div>
                    {!isUnavailable && (
                        <div className="text-right flex flex-col h-full justify-between items-end">
                          <div className="mb-auto">
                              {item.discount > 0 ? (
                                <>
                                  <p className="font-bold text-lg text-red-500">{itemTotal.toFixed(0)} ₽</p>
                                  <p className="text-xs text-slate-400 line-through">{originalItemTotal.toFixed(0)} ₽</p>
                                </>
                              ) : (
                                <p className="font-bold text-lg text-slate-900">{itemTotal.toFixed(0)} ₽</p>
                              )}
                          </div>
                           <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                             <TrashIcon className="h-5 w-5"/>
                           </button>
                        </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white">
                <div className="space-y-1 mb-4 text-sm">
                    <div className="flex justify-between items-center font-semibold">
                        <span>Вес заказа</span>
                        <span className={`${isOverweight ? 'text-red-600' : 'text-slate-700'}`}>
                            {cartWeight.toFixed(2)} / {MAX_WEIGHT.toFixed(2)} кг
                        </span>
                    </div>
                    {isOverweight && (
                        <p className="text-xs text-red-600 text-center bg-red-100 p-2 rounded-lg">
                            Курьеру будет тяжело. Уменьшите вес заказа.
                        </p>
                    )}
                </div>
                <div className="space-y-2 mb-4 text-slate-600">
                    <div className="flex justify-between items-center">
                        <span>Сумма к оплате</span>
                        <span className="font-medium text-slate-900">{cartTotal.toFixed(0)} ₽</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Доставка</span>
                        <span className="font-medium text-slate-900">{deliveryFee.toFixed(0)} ₽</span>
                    </div>
                </div>
                <div className="flex justify-between items-center font-bold text-xl mb-4 pt-2 border-t border-slate-200">
                    <span>Итог</span>
                    <span>{finalTotal.toFixed(0)} ₽</span>
                </div>
                <button
                    onClick={onCheckout}
                    disabled={cartTotal <= 0 || isOverweight}
                    className="w-full bg-brand-orange text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-orange-dark transition-all duration-300 text-lg shadow-md hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isOverweight ? 'Превышен лимит веса' : cartTotal > 0 ? 'Перейти к оформлению' : 'Корзина пуста'}
                </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
