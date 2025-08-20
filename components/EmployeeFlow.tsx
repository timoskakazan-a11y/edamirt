import React, { useState, useEffect, useCallback } from 'react';
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

  const fetchActiveOrder = useCallback(async () => {
    if (!user) return;
    try {
        const order = await getAssignedOrderForEmployee(user.id);
        setActiveOrder(order);

        if (order && status !== 'delivering') {
            setStatus('delivering');
        } else if (!order && status === 'delivering') {
            setStatus('online');
        }
    } catch (err) {
      console.error("Error fetching active order:", err);
    }
  }, [user, status]);

  // This effect runs when the employee is online and not delivering,
  // trying to pick up a queued order.
  useEffect(() => {
      let intervalId: number | undefined;
      const assignQueuedOrder = async () => {
          if (user && status === 'online' && !activeOrder) {
              await findAndAssignQueuedOrder(user.id);
              await fetchActiveOrder(); // Check immediately if an order was assigned
          }
      };
      
      if (status === 'online') {
          assignQueuedOrder();
          intervalId = window.setInterval(assignQueuedOrder, 10000); // Check for queued orders every 10 seconds
      }

      return () => clearInterval(intervalId);
  }, [status, user, activeOrder, fetchActiveOrder]);
  
  // This effect runs when the employee is already delivering an order,
  // to poll for status updates on that specific order.
  useEffect(() => {
    let intervalId: number | undefined;
    if (user && status === 'delivering') {
      fetchActiveOrder(); // Initial fetch
      intervalId = window.setInterval(fetchActiveOrder, 8000); // Poll for updates
    }
    return () => clearInterval(intervalId);
  }, [status, user, fetchActiveOrder]);


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