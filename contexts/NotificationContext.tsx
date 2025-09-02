import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getNotificationsForUser } from '../services/airtableService';
import type { Notification } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const READ_NOTIFICATIONS_KEY = 'readNotifications';

const getReadNotificationIds = (): string[] => {
    try {
        const item = window.localStorage.getItem(READ_NOTIFICATIONS_KEY);
        return item ? JSON.parse(item) : [];
    } catch (error) {
        console.error("Error reading read notifications from localStorage", error);
        return [];
    }
};

const setReadNotificationIds = (ids: string[]) => {
    try {
        window.localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(ids));
    } catch (error) {
        console.error("Error saving read notifications to localStorage", error);
    }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!user || user.role !== 'customer') {
            setNotifications([]);
            setUnreadCount(0);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const fetchedNotifications = await getNotificationsForUser(user.id);
            setNotifications(fetchedNotifications);
            const readIds = new Set(getReadNotificationIds());
            const newUnreadCount = fetchedNotifications.filter(n => !readIds.has(n.id)).length;
            setUnreadCount(newUnreadCount);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 15000); // Poll for new notifications
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAllAsRead = () => {
        const allIds = notifications.map(n => n.id);
        setReadNotificationIds(allIds);
        setUnreadCount(0);
    };

    const value = {
        notifications,
        unreadCount,
        isLoading,
        markAllAsRead,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
