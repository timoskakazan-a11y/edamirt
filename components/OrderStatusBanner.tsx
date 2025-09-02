

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../contexts/OrderContext';
import { getFullOrderDetails } from '../services/airtableService';
import type { FullOrderDetails } from '../types';
import OrderDetailsModal from './OrderDetailsModal';
import StatusTracker from './StatusTracker';
import ReviewModal from './ReviewModal';
import { useProducts } from '../contexts/ProductContext';
import XMarkIcon from './icons/XMarkIcon';
import StarIcon from './icons/StarIcon';

const calculateArrivalTime = (createdAt: string, deliveryTime: number): string => {
    const createdDate = new Date(createdAt);
    createdDate.setMinutes(createdDate.getMinutes() + deliveryTime);
    const hours = String(createdDate.getHours()).padStart(2, '0');
    const minutes = String(createdDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const OrderStatusBanner: React.FC = () => {
    const { activeOrder, reviewableOrder, clearOrder, dismissReview, isRefetching, thankYouOrderId, dismissThankYou } = useOrder();
    const { refetchProducts } = useProducts();
    const [modalData, setModalData] = useState<FullOrderDetails | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [isDelayed, setIsDelayed] = useState(false);

    useEffect(() => {
        if (activeOrder && activeOrder.deliveryTime > 15) {
            setIsDelayed(true);
        } else {
            setIsDelayed(false);
        }
    }, [activeOrder]);

    useEffect(() => {
        if (thankYouOrderId) {
            const timer = setTimeout(() => {
                dismissThankYou();
            }, 5 * 60 * 1000); // 5 minutes

            return () => clearTimeout(timer);
        }
    }, [thankYouOrderId, dismissThankYou]);

    if (!activeOrder && !reviewableOrder && !thankYouOrderId) {
        return null;
    }
    
    const handleBannerClick = async () => {
        if (!activeOrder) return;
        setIsLoadingDetails(true);
        setIsDetailsModalOpen(true);
        try {
            const details = await getFullOrderDetails(activeOrder.id);
            if (details) setModalData(details);
            else setIsDetailsModalOpen(false);
        } catch (error) {
            console.error("Failed to fetch order details:", error);
            setIsDetailsModalOpen(false);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const handleReviewComplete = () => {
        setIsReviewModalOpen(false);
        clearOrder();
        refetchProducts(); // Refetch products to show updated ratings
    };

    const bannerContent = () => {
        if (thankYouOrderId) {
            return (
                <motion.div
                    key="thank-you"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="w-full p-5 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-400 text-white shadow-lg flex items-center justify-between gap-4"
                >
                    <div>
                        <h3 className="text-xl font-extrabold tracking-tight">Заказ доставлен! 🫰</h3>
                        <p className="text-sm text-white/90">Спасибо!</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); dismissThankYou(); }}
                        className="bg-white text-green-600 font-bold py-2.5 px-6 rounded-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                       ОК
                    </button>
                </motion.div>
            );
        }

        if (reviewableOrder) {
             return (
                <motion.div
                    key="review"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="relative w-full p-5 rounded-xl bg-gradient-to-tr from-brand-orange to-yellow-400 text-white shadow-lg flex items-center justify-between gap-4 overflow-hidden"
                >
                    <StarIcon className="absolute -right-8 -top-8 w-40 h-40 text-white/10 transform rotate-12" />

                    <div className="flex items-center gap-4 z-10">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full hidden sm:block">
                            <StarIcon className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-extrabold tracking-tight">Оцените ваш заказ!</h3>
                            <p className="text-sm text-white/90">Поделитесь впечатлениями о товарах.</p>
                        </div>
                    </div>
                    <div className="z-10 flex-shrink-0">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsReviewModalOpen(true); }}
                            className="bg-white text-brand-orange font-bold py-2.5 px-6 rounded-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                           Начать
                        </button>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); dismissReview(); }}
                        className="absolute top-2 right-2 bg-black/10 text-white/70 rounded-full p-1 hover:bg-black/30 z-20"
                        aria-label="Скрыть"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>
                </motion.div>
            );
        }

        if (activeOrder) {
            const arrivalTime = calculateArrivalTime(activeOrder.createdAt, activeOrder.deliveryTime);
            const isCancelled = activeOrder.status === 'отменен';
            let message = `Доставим к ${arrivalTime}`;
            if (isCancelled) message = `Заказ #${activeOrder.orderNumber} отменен`;

            return (
                <motion.button 
                    key="active_order"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleBannerClick}
                    className={`relative w-full p-4 rounded-xl text-white text-left shadow-lg overflow-hidden transition-colors duration-300 ${isCancelled ? 'bg-red-500' : 'bg-brand-orange hover:bg-brand-orange-dark'}`}
                >
                     {isRefetching && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer -translate-x-full"></div>
                    )}
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold">{message}</p>
                            <p className="text-sm opacity-90">Нажмите, чтобы посмотреть состав</p>
                        </div>
                        {isCancelled && (
                             <button 
                                onClick={(e) => { e.stopPropagation(); clearOrder(); }} 
                                className="bg-white/20 rounded-full p-1 hover:bg-white/40 z-10"
                                aria-label="Скрыть"
                            >
                                <XMarkIcon className="h-4 w-4"/>
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                    {isDelayed && !isCancelled && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: '8px' }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="bg-black/20 rounded-lg px-3 py-1 text-xs"
                        >
                           Извините, мы немного задерживаемся.
                        </motion.div>
                    )}
                    </AnimatePresence>
                    {!isCancelled && <StatusTracker currentStatus={activeOrder.status} />}
                </motion.button>
            );
        }
        return null;
    };

    return (
        <div className="relative mb-6 shadow-lg rounded-xl">
            <AnimatePresence mode="wait">
                {bannerContent()}
            </AnimatePresence>
            <OrderDetailsModal 
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                data={modalData}
                isLoading={isLoadingDetails}
            />
            {reviewableOrder && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    orderToReview={reviewableOrder}
                    onReviewComplete={handleReviewComplete}
                />
            )}
        </div>
    );
};

export default OrderStatusBanner;