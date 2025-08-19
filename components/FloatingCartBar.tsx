
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';

interface FloatingCartBarProps {
  onCartClick: () => void;
}

const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ onCartClick }) => {
  const { cartCount, isCartLoading } = useCart();
  const { activeOrder } = useOrder();

  if (cartCount === 0 && !isCartLoading) {
    return null;
  }

  const isDisabled = !!activeOrder || isCartLoading;

  return (
    <div className="fixed bottom-6 right-6 z-30">
        <button
            id="floating-cart-button"
            onClick={onCartClick}
            disabled={isDisabled}
            className={`relative w-16 h-16 bg-brand-orange text-white rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            aria-label={`Open cart with ${cartCount} items`}
        >
            {isCartLoading ? (
                 <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <>
                    <img 
                      width="36" 
                      height="36" 
                      src="https://img.icons8.com/pulsar-line/100/shopping-cart.png" 
                      alt="shopping-cart"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                            {cartCount}
                        </span>
                    )}
                </>
            )}
        </button>
    </div>
  );
};

export default FloatingCartBar;