import React from 'react';
import { useCart } from '../contexts/CartContext';
import type { CartItem } from '../types';
import XMarkIcon from './icons/XMarkIcon';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import TrashIcon from './icons/TrashIcon';
import EmptyCartIcon from './icons/EmptyCartIcon';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onCheckout }) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, adjustmentNotifications } = useCart();
  const deliveryFee = cartItems.length > 0 ? 99.00 : 0;
  const finalTotal = cartTotal + deliveryFee;

  const getItemFinalPrice = (item: CartItem) => {
    return (item.discount && item.discount > 0)
      ? item.price * (1 - item.discount / 100)
      : item.price;
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
                const finalPrice = getItemFinalPrice(item);
                const isUnavailable = item.availableStock <= 0;
                const adjustment = adjustmentNotifications.get(item.id);

                return (
                  <div key={item.id} className={`relative flex items-center gap-4 bg-white p-4 rounded-xl shadow-brand transition-all duration-300 ${isUnavailable ? 'opacity-60 grayscale' : ''}`}>
                    {adjustment && (
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-full ml-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-md shadow-lg animate-pulse-and-fade z-10">
                            -{adjustment} шт.
                        </div>
                    )}
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-sm leading-tight text-slate-800">{item.name}</h4>
                      <div className="flex items-baseline gap-2 mt-1">
                          <p className="text-sm font-semibold text-slate-800">{finalPrice.toFixed(0)} ₽</p>
                          {item.discount && item.discount > 0 && (
                              <p className="text-xs text-slate-400 line-through">{item.price.toFixed(0)} ₽</p>
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
                        <div className="flex items-center justify-between bg-slate-100 rounded-lg h-9 w-24 mt-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 h-full text-slate-600 hover:text-brand-orange rounded-l-lg"><MinusIcon className="h-4 w-4"/></button>
                          <span className="font-bold text-base text-center text-slate-800">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 h-full text-slate-600 hover:text-brand-orange rounded-r-lg"><PlusIcon className="h-4 w-4"/></button>
                        </div>
                      )}
                    </div>
                    {!isUnavailable && (
                        <div className="text-right flex flex-col h-full justify-between items-end">
                           <p className="font-bold text-lg">{(finalPrice * item.quantity).toFixed(0)} ₽</p>
                           <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors mt-auto">
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
                    disabled={cartTotal <= 0}
                    className="w-full bg-brand-orange text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-orange-dark transition-all duration-300 text-lg shadow-md hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {cartTotal > 0 ? 'Перейти к оформлению' : 'Корзина пуста'}
                </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;