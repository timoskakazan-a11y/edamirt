import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../contexts/NotificationContext';
import BellIcon from './icons/BellIcon';
import XMarkIcon from './icons/XMarkIcon';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - date.getTime()) / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds} сек назад`;
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} мин назад`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ч назад`;
    
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
    const { notifications, isLoading, markAllAsRead } = useNotifications();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            markAllAsRead();
        }
    }, [isOpen, markAllAsRead]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-20 right-4 w-full max-w-sm bg-white rounded-2xl shadow-2xl border z-50 flex flex-col max-h-[70vh]"
                >
                    <div className="flex justify-between items-center p-4 border-b">
                        <h3 className="font-bold text-lg">Уведомления</h3>
                        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                            <XMarkIcon className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {isLoading ? (
                            <p className="p-6 text-center text-slate-500">Загрузка...</p>
                        ) : notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div key={notification.id} className="flex items-start gap-4 p-4 border-b hover:bg-slate-50">
                                    <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                        <img src={notification.iconUrl} alt="" className="w-6 h-6 object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-700">{notification.text}</p>
                                        <p className="text-xs text-slate-400 mt-1">{formatDate(notification.createdAt)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-slate-500">
                                <BellIcon className="w-12 h-12 mx-auto text-slate-300 mb-2"/>
                                <p className="font-semibold">Пока ничего нет</p>
                                <p className="text-sm">Здесь будут появляться уведомления о заказах и акциях.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationsPanel;
