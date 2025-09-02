
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import ExclamationTriangleIcon from './icons/ExclamationTriangleIcon';

const Toast: React.FC = () => {
    const { toastMessage } = useCart();

    return (
        <div className="fixed bottom-24 right-0 sm:right-6 z-[60] w-full sm:w-auto px-4 sm:px-0">
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                        <div className="bg-slate-800 text-white font-semibold rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                            <span>{toastMessage}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Toast;
