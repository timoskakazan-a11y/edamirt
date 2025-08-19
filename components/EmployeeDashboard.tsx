
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface EmployeeReadyScreenProps {
  isOnline: boolean;
  onToggleStatus: (newStatus: 'на линии' | 'не работает') => void;
  isLoading: boolean;
  error: string | null;
}

const EmployeeReadyScreen: React.FC<EmployeeReadyScreenProps> = ({ isOnline, onToggleStatus, isLoading, error }) => {
  const { user } = useAuth();
  
  const buttonClasses = "w-full max-w-xs px-8 py-4 text-white font-bold text-lg rounded-xl shadow-lg transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-wait";

  return (
    <div className="flex-grow flex flex-col justify-center items-center text-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-brand w-full max-w-lg">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {isOnline ? `Вы на линии, ${user?.name.split(' ')[0]}` : 'Готовы начать работу?'}
        </h1>
        <p className="text-slate-500 mb-8">{isOnline ? 'Ожидаем новые заказы для вас...' : 'Нажмите, чтобы получать заказы.'}</p>
        
        <div className="relative h-16 w-full max-w-xs mx-auto">
            <AnimatePresence mode="wait">
                {isOnline ? (
                    <motion.div
                        key="offline-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <motion.button
                            onClick={() => onToggleStatus('не работает')}
                            disabled={isLoading}
                            className={`${buttonClasses} bg-slate-600 hover:bg-slate-700`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? 'Загрузка...' : 'Сойти с линии'}
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="online-btn"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                         <motion.button
                            onClick={() => onToggleStatus('на линии')}
                            disabled={isLoading}
                            className={`${buttonClasses} bg-brand-orange hover:bg-brand-orange-dark`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? 'Загрузка...' : 'Встать в работу'}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default EmployeeReadyScreen;
