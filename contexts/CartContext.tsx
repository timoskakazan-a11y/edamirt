

import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import type { Product, CartItem } from '../types';
import { useProducts } from './ProductContext';
import { useAuth } from './AuthContext';
import { getUserCart, updateUserCart } from '../services/airtableService';

const MAX_WEIGHT = 10; // 10 kg

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartWeight: number;
  finalizeOrder: () => void;
  adjustmentNotifications: Map<string, number>;
  isCartLoading: boolean;
  toastMessage: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products, isLoading: areProductsLoading } = useProducts();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [adjustmentNotifications, setAdjustmentNotifications] = useState<Map<string, number>>(new Map());
  const [isCartLoading, setIsCartLoading] = useState(true);
  const isInitialLoad = useRef(true);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };


  // Load cart from Airtable on user login
  useEffect(() => {
    const loadCart = async () => {
      if (user && user.role === 'customer') {
        setIsCartLoading(true);
        isInitialLoad.current = true;
        try {
          const storedCart = await getUserCart(user.id);
          setCartItems(storedCart);
        } catch (error) {
          console.error("Failed to load cart from Airtable:", error);
        } finally {
          setIsCartLoading(false);
          setTimeout(() => { isInitialLoad.current = false; }, 500);
        }
      } else {
        setCartItems([]);
        setIsCartLoading(false);
        isInitialLoad.current = true;
      }
    };
    loadCart();
  }, [user]);
  
  // Debounced save to Airtable
  useEffect(() => {
    if (isInitialLoad.current || !user || areProductsLoading || isCartLoading) {
      return;
    }

    const handler = setTimeout(() => {
      updateUserCart(user.id, cartItems, cartTotal).catch(error => {
        console.error("Failed to save cart to Airtable:", error);
      });
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [cartItems, user, areProductsLoading, isCartLoading]);


  useEffect(() => {
    if (!areProductsLoading && products.length > 0) {
      setCartItems(currentCartItems => {
        let hasChanged = false;
        const newNotifications = new Map<string, number>();

        const updatedCartItems = currentCartItems.map(cartItem => {
          const freshProduct = products.find(p => p.id === cartItem.id);
          const newStock = freshProduct ? freshProduct.availableStock : 0;

          if (newStock !== cartItem.availableStock || (cartItem.quantity > newStock && newStock > 0)) {
            hasChanged = true;
            
            if (cartItem.quantity > newStock && newStock > 0) {
              const removedCount = cartItem.quantity - newStock;
              newNotifications.set(cartItem.id, removedCount);
              return { ...cartItem, availableStock: newStock, quantity: newStock };
            }
            
            return { ...cartItem, availableStock: newStock };
          }
          
          return cartItem;
        }).filter(item => item.availableStock > 0 || currentCartItems.some(ci => ci.id === item.id)); 
        
        if (newNotifications.size > 0) {
            setAdjustmentNotifications(newNotifications);
            setTimeout(() => {
                setAdjustmentNotifications(new Map());
            }, 4000);
        }

        return hasChanged ? updatedCartItems : currentCartItems;
      });
    }
  }, [products, areProductsLoading]);


  const inStockItems = useMemo(() => {
    return cartItems.filter(item => item.availableStock > 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return inStockItems.reduce((total, item) => {
        let effectivePrice;
        if (item.weightStatus === 'на развес' && item.pricePerKg) {
            effectivePrice = item.pricePerKg;
        } else {
            effectivePrice = item.price;
        }
        
        const priceWithDiscount = (item.discount && item.discount > 0)
            ? effectivePrice * (1 - item.discount / 100)
            : effectivePrice;

        const itemQuantity = Math.min(item.quantity, item.availableStock);
        const itemTotal = priceWithDiscount * itemQuantity;

        return total + itemTotal;
    }, 0);
  }, [inStockItems]);

  const cartWeight = useMemo(() => {
    return inStockItems.reduce((total, item) => {
        if (item.weightStatus === 'на развес') {
            return total + item.quantity;
        }
        const itemWeight = (item.weightPerPiece || 0.5) * item.quantity;
        return total + itemWeight;
    }, 0);
  }, [inStockItems]);

  const addToCart = (product: Product) => {
    let addAmount = 1;
    if (product.weightStatus === 'на развес') {
        // weightPerPiece is in kg.
        if (product.weightPerPiece && product.weightPerPiece >= 1) { // >= 1kg
            addAmount = 1;
        } else if (product.weightPerPiece && product.weightPerPiece < 0.04) { // < 40g
            addAmount = 0.1;
        } else { // default for weight based
            addAmount = 0.5;
        }
    }
    
    const potentialWeight = (product.weightStatus === 'на развес')
        ? addAmount
        : (product.weightPerPiece || 0.5) * addAmount;
        
    if (cartWeight + potentialWeight > MAX_WEIGHT) {
        showToast(`Максимальный вес заказа ${MAX_WEIGHT} кг. Курьеру будет тяжело.`);
        return;
    }
    
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem && (existingItem.quantity + addAmount) > product.availableStock) {
        showToast(`Извините, в наличии только ${product.availableStock} ${product.weightStatus === 'на развес' ? 'кг' : 'шт'}.`);
        return;
    }
    if (!existingItem && addAmount > product.availableStock) {
       showToast('Товара нет в наличии.');
       return;
    }

    let newItems;
    if (existingItem) {
      newItems = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: Number((item.quantity + addAmount).toFixed(2)) } : item
      );
    } else {
      newItems = [...cartItems, { ...product, quantity: addAmount }];
    }
    setCartItems(newItems);
  };

  const removeFromCart = (productId: string) => {
    const newItems = cartItems.filter(item => item.id !== productId);
    setCartItems(newItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const itemToUpdate = cartItems.find(item => item.id === productId);
    if (!itemToUpdate) return;
  
    const originalQuantity = itemToUpdate.quantity;
  
    // Only check weight limit if the quantity is increasing.
    if (quantity > originalQuantity) {
      const quantityDiff = quantity - originalQuantity;
      const weightDiff = (itemToUpdate.weightStatus === 'на развес')
        ? quantityDiff
        : (itemToUpdate.weightPerPiece || 0.5) * quantityDiff;
  
      if (cartWeight + weightDiff > MAX_WEIGHT) {
        showToast(`Максимальный вес заказа ${MAX_WEIGHT} кг. Курьеру будет тяжело.`);
        return;
      }
    }
  
    if (quantity > itemToUpdate.availableStock) {
      showToast(`Извините, в наличии только ${itemToUpdate.availableStock} ${itemToUpdate.weightStatus === 'на развес' ? 'кг' : 'шт'}.`);
      quantity = itemToUpdate.availableStock;
    }
  
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      const newItems = cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      setCartItems(newItems);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const finalizeOrder = () => {
      setCartItems([]);
  };
  
  const cartCount = useMemo(() => {
    // For weight-based items, we count them as 1 position in the cart, not the total weight
    return inStockItems.reduce((count, item) => {
      const quantityInStock = Math.min(item.quantity, item.availableStock);
      if (item.weightStatus === 'на развес') {
          return quantityInStock > 0 ? count + 1 : count;
      }
      return count + quantityInStock;
    }, 0);
  }, [inStockItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    cartWeight,
    finalizeOrder,
    adjustmentNotifications,
    isCartLoading,
    toastMessage
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
