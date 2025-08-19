
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AirtableUserRecord, AirtableEmployeeRecord } from '../types';
import { findUserByEmail, registerUser, findEmployeeByPassword, updateEmployeeStatus } from '../services/airtableService';

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapCustomerRecordToUser = (record: AirtableUserRecord): User => {
    return {
        id: record.id,
        name: record.fields.name || '',
        email: record.fields.email || '',
        phone: record.fields.phone || '',
        role: 'customer',
    };
};

const mapEmployeeRecordToUser = (record: AirtableEmployeeRecord): User => {
    return {
        id: record.id,
        name: record.fields['имя'] || '',
        email: record.fields['почта'] || 'work',
        role: 'employee',
        status: record.fields['статус'],
    };
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Could not retrieve user from localStorage:", error);
    } finally {
        setIsAuthLoading(false);
    }
  }, []);

  const handleAuthSuccess = (record: AirtableUserRecord | AirtableEmployeeRecord, role: 'customer' | 'employee') => {
    const appUser = role === 'customer'
        ? mapCustomerRecordToUser(record as AirtableUserRecord)
        : mapEmployeeRecordToUser(record as AirtableEmployeeRecord);
    
    setUser(appUser);
    try {
        window.localStorage.setItem('authUser', JSON.stringify(appUser));
    } catch (error) {
        console.error("Could not save user to localStorage:", error);
    }
  };

  const login = async (email: string, password: string) => {
    if (email.toLowerCase() === 'work') {
      const record = await findEmployeeByPassword(password);
      if (!record) {
        throw new Error('Неверный пароль сотрудника.');
      }
      handleAuthSuccess(record, 'employee');
    } else {
      const record = await findUserByEmail(email);
      if (!record) {
        throw new Error('Пользователь с таким email не найден.');
      }
      if (record.fields.password !== password) {
        throw new Error('Неверный пароль.');
      }
      handleAuthSuccess(record, 'customer');
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    if (email.toLowerCase() === 'work') {
        throw new Error('Этот email зарезервирован для сотрудников.');
    }
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error('Пользователь с таким email уже существует. Пожалуйста, войдите.');
    }
    const newUserRecord = await registerUser({ name, email, phone, password });
    handleAuthSuccess(newUserRecord, 'customer');
  };

  const logout = async () => {
    if (user && user.role === 'employee') {
      try {
        await updateEmployeeStatus(user.id, 'не работает');
      } catch (error) {
        console.error("Failed to set employee status to 'offline':", error);
        // We still log out on the client-side even if the API call fails
      }
    }
    
    setUser(null);
    try {
        window.localStorage.removeItem('authUser');
        window.localStorage.removeItem('airtableOrderId');
    } catch (error) {
        console.error("Could not clear user session from localStorage:", error);
    }
  };

  const value = {
    user,
    isAuthLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};