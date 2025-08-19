
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { createOrder, updateProductStock } from '../services/airtableService';
import XMarkIcon from './icons/XMarkIcon';
import { useOrder } from '../contexts/OrderContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddress: string;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, selectedAddress }) => {
  const { cartTotal, cartItems, finalizeOrder } = useCart();
  const { user } = useAuth();
  const { refetchProducts } = useProducts();
  const { activeOrder, refetchOrder } = useOrder();
  const deliveryFee = cartItems.length > 0 ? 99.00 : 0;
  const finalTotal = cartTotal + deliveryFee;
  
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('Заказ принят!');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeOrder) {
        setErrorMessage('У вас уже есть активный заказ. Дождитесь его завершения.');
        setFormState('error');
        return;
    }

    setFormState('loading');
    setErrorMessage('');
    setSuccessMessage('Заказ принят!');

    if (!user?.id) {
        setErrorMessage('Ошибка: сессия пользователя не найдена.');
        setFormState('error');
        return;
    }

    try {
      const itemsToPurchase = cartItems.filter(item => item.availableStock >= item.quantity && item.availableStock > 0);
      if (itemsToPurchase.length === 0) {
        throw new Error("Все товары в вашей корзине закончились.");
      }
      
      await createOrder(user.id, itemsToPurchase, finalTotal, selectedAddress);
      
      await updateProductStock(itemsToPurchase);
      
      await refetchProducts();

      setFormState('success');
      setTimeout(async () => {
        finalizeOrder();
        await refetchOrder();
        handleClose();
      }, 3000);

    } catch (error) {
       // This error is now just a notification, as orders are queued.
      if (error instanceof Error && error.message.includes("нет свободных курьеров")) {
          setSuccessMessage("Все курьеры заняты. Ваш заказ в очереди!");
          // Proceed with success flow because the order IS created.
          await updateProductStock(cartItems.filter(item => item.availableStock > 0));
          await refetchProducts();
          setFormState('success');
          setTimeout(async () => {
              finalizeOrder();
              await refetchOrder();
              handleClose();
          }, 4000);
      } else {
        setFormState('error');
        setErrorMessage(error instanceof Error ? error.message : 'Произошла неизвестная ошибка.');
      }
    }
  };

  const handleClose = () => {
    setFormState('idle');
    setErrorMessage('');
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Подтверждение заказа</h2>
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100">
                <XMarkIcon className="h-6 w-6 text-slate-600" />
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            {formState === 'success' ? (
                <div className="text-center py-10">
                    <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <h3 className="text-2xl font-bold mt-4">{successMessage}</h3>
                    <p className="text-slate-600 mt-2">Отслеживайте статус на главном экране.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Адрес доставки</span>
                            <span className="font-semibold text-slate-800">{selectedAddress}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Получатель</span>
                            <span className="font-semibold text-slate-800">{user?.name}</span>
                        </div>
                         <div className="flex justify-between items-center text-xl font-bold pt-3 border-t">
                            <span>Итог к оплате</span>
                            <span>{finalTotal.toFixed(0)} ₽</span>
                        </div>
                    </div>

                    {formState === 'error' && <p className="text-sm text-center text-red-600 mb-4">{errorMessage}</p>}
                    
                    <button type="submit" disabled={formState === 'loading'} className="w-full bg-brand-orange text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-orange-dark transition-all duration-300 text-lg shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed flex justify-center items-center">
                        {formState === 'loading' ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : `Заказать за ${finalTotal.toFixed(0)} ₽`}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
