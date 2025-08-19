import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserActiveOrder, getFullOrderDetails } from '../services/airtableService';
import type { Order, FullOrderDetails } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  activeOrder: Order | null;
  isLoading: boolean;
  isRefetching: boolean;
  error: string | null;
  refetchOrder: () => Promise<void>;
  clearOrder: () => void;
  reviewableOrder: FullOrderDetails | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewableOrder, setReviewableOrder] = useState<FullOrderDetails | null>(null);

  const fetchOrder = useCallback(async (isBackground = false) => {
    if (!user || user.role !== 'customer') {
      setIsLoading(false);
      setActiveOrder(null);
      return;
    }
    
    if (isBackground) {
        setIsRefetching(true);
    } else {
        setIsLoading(true);
    }

    try {
      const order = await getUserActiveOrder(user.name);
      
      if (order && order.status === 'доставлен' && !reviewableOrder) {
          const fullDetails = await getFullOrderDetails(order.id);
          if (fullDetails) {
            const reviewable: FullOrderDetails = {
                ...fullDetails.order,
                productsInfo: fullDetails.productsInfo
            };
            setReviewableOrder(reviewable);
             // Set activeOrder to null to hide the status banner and show the review banner
            setActiveOrder(null);
          }
      } else if (!order) {
         // If there is no active order, don't clear reviewableOrder
         // It should be cleared manually by the user
         setActiveOrder(null);
      } else {
        // There is an active, non-delivered order
        setActiveOrder(order);
        setReviewableOrder(null);
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить заказ';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [user, reviewableOrder]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(() => fetchOrder(true), 7000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const clearOrder = () => {
    setActiveOrder(null);
    setReviewableOrder(null);
  };

  const value = {
    activeOrder,
    isLoading,
    isRefetching,
    error,
    refetchOrder: () => fetchOrder(),
    clearOrder,
    reviewableOrder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
