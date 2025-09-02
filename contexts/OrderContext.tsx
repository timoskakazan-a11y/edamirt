

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getUserActiveOrder, getFullOrderDetails, getReviewedProductIdsForUser } from '../services/airtableService';
import type { Order, FullOrderDetails } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  activeOrder: Order | null;
  isLoading: boolean;
  isRefetching: boolean;
  error: string | null;
  refetchOrder: () => Promise<void>;
  clearOrder: () => void; // Used for completing review or cancelling
  reviewableOrder: FullOrderDetails | null;
  dismissReview: () => void; // Used for dismissing the review banner
  setActiveOrderDirectly: (order: Order) => void;
  thankYouOrderId: string | null;
  dismissThankYou: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// --- LocalStorage helpers ---
const DISMISSED_ORDERS_KEY = 'dismissedReviewOrders';
const THANK_YOU_ORDER_KEY = 'thankYouOrder';
const ACTIVE_ORDER_STORAGE_KEY = 'activeOrderSnapshot';
const THANK_YOU_DURATION = 5 * 60 * 1000; // 5 minutes

const getDismissedOrders = (): string[] => {
    try {
        const item = window.localStorage.getItem(DISMISSED_ORDERS_KEY);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Error reading dismissed orders from localStorage", error);
        return [];
    }
};

const addDismissedOrder = (orderId: string) => {
    try {
        const dismissed = getDismissedOrders();
        if (!dismissed.includes(orderId)) {
            window.localStorage.setItem(DISMISSED_ORDERS_KEY, JSON.stringify([...dismissed, orderId]));
        }
    } catch (error) {
        console.error("Error saving dismissed order to localStorage", error);
    }
};

const saveActiveOrder = (order: Order | null) => {
    try {
        if (order) {
            window.localStorage.setItem(ACTIVE_ORDER_STORAGE_KEY, JSON.stringify(order));
        } else {
            window.localStorage.removeItem(ACTIVE_ORDER_STORAGE_KEY);
        }
    } catch (e) {
        console.error("Failed to update active order in localStorage", e);
    }
};

const loadActiveOrder = (): Order | null => {
    try {
        const item = window.localStorage.getItem(ACTIVE_ORDER_STORAGE_KEY);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error("Failed to load active order from localStorage", e);
        return null;
    }
};


export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewableOrder, setReviewableOrder] = useState<FullOrderDetails | null>(null);
  const [thankYouOrderId, setThankYouOrderId] = useState<string | null>(null);
  
  const intervalIdRef = useRef<number | null>(null);

  useEffect(() => {
    // On mount, immediately restore state from localStorage
    setActiveOrder(loadActiveOrder());

    // Also check for a lingering "thank you" message
    try {
        const thankYouItem = window.localStorage.getItem(THANK_YOU_ORDER_KEY);
        if (thankYouItem) {
            const { id, timestamp } = JSON.parse(thankYouItem);
            if (Date.now() - timestamp < THANK_YOU_DURATION) {
                setThankYouOrderId(id);
            } else {
                window.localStorage.removeItem(THANK_YOU_ORDER_KEY);
            }
        }
    } catch (error) {
        console.error("Error reading thank you order from localStorage", error);
    }
  }, []);

  const dismissThankYou = useCallback(() => {
    setThankYouOrderId(currentId => {
      if (currentId) {
        addDismissedOrder(currentId);
      }
      return null;
    });
    try {
        window.localStorage.removeItem(THANK_YOU_ORDER_KEY);
    } catch (error) {
        console.error("Error removing thank you order from localStorage", error);
    }
  }, []);

  const fetchOrder = useCallback(async (isBackground = false) => {
    if (!user || user.role !== 'customer') {
      setIsLoading(false);
      setActiveOrder(null);
      saveActiveOrder(null);
      setReviewableOrder(null);
      return;
    }

    if (isBackground) setIsRefetching(true); else setIsLoading(true);

    try {
      // The primary source of truth is the order stored in localStorage.
      const cachedOrder = loadActiveOrder();

      if (cachedOrder) {
        // If we have a cached order, we poll its details directly.
        // We will NOT clear this order unless the server confirms it's finished.
        const latestOrderDetails = await getFullOrderDetails(cachedOrder.id);

        if (latestOrderDetails) {
          // Server gave a valid response.
          if (latestOrderDetails.status === 'доставлен' || latestOrderDetails.status === 'отменен') {
            // The order is finished. Clear state and storage.
            setActiveOrder(null);
            saveActiveOrder(null);

            if (latestOrderDetails.status === 'доставлен') {
              const dismissedOrders = getDismissedOrders();
              if (!dismissedOrders.includes(latestOrderDetails.id)) {
                // Determine if we show review modal or thank you banner
                 const reviewedProductIds = await getReviewedProductIdsForUser(user.email);
                 const productsAwaitingReview = latestOrderDetails.productsInfo.filter(p => !reviewedProductIds.includes(p.id));
                 if (productsAwaitingReview.length > 0) {
                     setReviewableOrder({ ...latestOrderDetails, productsInfo: productsAwaitingReview });
                 } else {
                     setThankYouOrderId(latestOrderDetails.id);
                     try { window.localStorage.setItem(THANK_YOU_ORDER_KEY, JSON.stringify({ id: latestOrderDetails.id, timestamp: Date.now() })); } catch (err) {/* ignore */}
                 }
              }
            }
          } else {
            // The order is still active. Update state and storage.
            setActiveOrder(latestOrderDetails);
            saveActiveOrder(latestOrderDetails);
            setReviewableOrder(null);
          }
        }
        // If latestOrderDetails is null (e.g., temporary network error or API lag), we do nothing.
        // The banner will continue to show the data from the last successful poll.
      } else {
        // There is no cached order. Check if one exists on the server.
        // This covers cases like logging in on a new device.
        const foundOrder = await getUserActiveOrder(user.id);
        if (foundOrder && foundOrder.status !== 'доставлен' && foundOrder.status !== 'отменен') {
            setActiveOrder(foundOrder);
            saveActiveOrder(foundOrder);
            setReviewableOrder(null);
            dismissThankYou();
        } else {
             // Ensure any lingering state is cleared if no active order is found.
             setActiveOrder(null);
        }
      }
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить заказ';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  }, [user, dismissThankYou]);

  useEffect(() => {
    if (user) {
        fetchOrder();
        intervalIdRef.current = window.setInterval(() => fetchOrder(true), 4000);
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }
  }, [user, fetchOrder]);
  
  const setActiveOrderDirectly = useCallback((order: Order) => {
    setActiveOrder(order);
    saveActiveOrder(order);
    setReviewableOrder(null);
    dismissThankYou();
  }, [dismissThankYou]);

  const clearOrder = () => {
    if (reviewableOrder) {
        addDismissedOrder(reviewableOrder.id);
    }
    setActiveOrder(null);
    saveActiveOrder(null);
    setReviewableOrder(null);
    dismissThankYou();
  };
  
  const dismissReview = () => {
      if (reviewableOrder) {
          addDismissedOrder(reviewableOrder.id);
          setReviewableOrder(null);
      }
  };

  const value = {
    activeOrder,
    isLoading,
    isRefetching,
    error,
    refetchOrder: () => fetchOrder(),
    clearOrder,
    reviewableOrder,
    dismissReview,
    setActiveOrderDirectly,
    thankYouOrderId,
    dismissThankYou,
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
