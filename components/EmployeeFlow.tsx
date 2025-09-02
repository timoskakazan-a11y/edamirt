

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmployeeSplashScreen from './EmployeeSplashScreen';
import EmployeeReadyScreen from './EmployeeDashboard';
import EmployeeActiveScreen from './EmployeeActiveScreen';
import EmployeeHeader from './EmployeeHeader';
import { updateEmployeeStatus, getAssignedOrderForEmployee, updateOrderStatus, findAndAssignQueuedOrder } from '../services/airtableService';
import { useAuth } from '../contexts/AuthContext';
import type { FullOrderDetails, OrderStatus } from '../types';

type EmployeeAppStatus = 'offline' | 'online' | 'delivering';

const EmployeeFlow: React.FC = () => {
  const { user } = useAuth();
  const [isShowingSplash, setIsShowingSplash] = useState(true);
  
  const [status, setStatus] = useState<EmployeeAppStatus>(() => 
    user?.status === 'на линии' ? 'online' : 'offline'
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<FullOrderDetails | null>(null);

  useEffect(() => {
    setTimeout(() => setIsShowingSplash(false), 2000);
  }, []);

  // Unified polling logic for fetching and assigning orders.
  useEffect(() => {
    if (!user) return;

    let isMounted = true; // Prevent state updates on unmounted component

    const poll = async () => {
      try {
        // 1. Always check for an already assigned order first.
        const existingOrder = await getAssignedOrderForEmployee(user.id);
        if (!isMounted) return;

        if (existingOrder) {
            setActiveOrder(existingOrder);
            if (status !== 'delivering') setStatus('delivering');
            return; // Found an order, job done for this poll cycle.
        }

        // 2. If no assigned order, and we are online, try to pick one from the queue.
        if (status === 'online') {
            const newOrder = await findAndAssignQueuedOrder(user.id);
            if (!isMounted) return;

            if (newOrder) {
                setActiveOrder(newOrder);
                setStatus('delivering');
                return; // Got a new order, job done.
            }
        }
        
        // 3. If we reach here, there's no active order.
        // If we previously had an order, clear it.
        if (activeOrder) setActiveOrder(null); 
        // If we thought we were delivering, switch status back to online.
        if (status === 'delivering') setStatus('online');

      } catch (err) {
        console.error("Polling error in EmployeeFlow:", err);
      }
    };

    let intervalId: number | undefined;
    if (status === 'online' || status === 'delivering') {
        poll(); // Run once immediately
        intervalId = window.setInterval(poll, 5000); // Poll every 5 seconds
    }

    return () => {
        isMounted = false;
        if (intervalId) clearInterval(intervalId);
    };
  }, [user, status, activeOrder]);


  const handleStatusChange = async (newStatus: 'на линии' | 'не работает') => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      await updateEmployeeStatus(user.id, newStatus);
      setStatus(newStatus === 'на линии' ? 'online' : 'offline');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить статус');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (newStatus: OrderStatus, delay?: number) => {
    if (!activeOrder || !user) return;
    try {
        // The service function now fetches necessary details internally,
        // so we no longer need to pass notificationDetails.
        await updateOrderStatus(activeOrder.id, newStatus, delay);

        if (newStatus === 'доставлен' || newStatus === 'отменен') {
            setActiveOrder(null);
            setStatus('online'); // Go back to looking for new orders
        } else {
            // After updating, refetch the order to get latest data
            const updatedOrder = await getAssignedOrderForEmployee(user.id);
            setActiveOrder(updatedOrder);
        }
    } catch (err) {
        alert(`Не удалось обновить статус заказа: ${err instanceof Error ? err.message : ''}`);
    }
  };


  if (isShowingSplash) {
    return <EmployeeSplashScreen />;
  }

  const headerStatus = (status === 'online' || status === 'delivering') ? 'На линии' : 'Не в работе';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
        <EmployeeHeader status={headerStatus} employeeName={user?.name || ''} />
        <main className="flex-grow container mx-auto px-4 py-6 flex flex-col">
            <AnimatePresence mode="wait">
              {status === 'delivering' && activeOrder ? (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow flex flex-col"
                >
                  <EmployeeActiveScreen order={activeOrder} onStatusUpdate={handleUpdateOrderStatus}/>
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow flex flex-col"
                >
                  <EmployeeReadyScreen
                    isOnline={status === 'online' || status === 'delivering'}
                    onToggleStatus={handleStatusChange}
                    isLoading={isLoading}
                    error={error}
                  />
                </motion.div>
              )}
            </AnimatePresence>
        </main>
    </div>
  );
};

export default EmployeeFlow;