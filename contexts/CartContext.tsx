
import React, { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react';
import type { Product, CartItem } from '../types';
import { useProducts } from './ProductContext';
import { useAuth } from './AuthContext';
import { getUserCart, updateUserCart } from '../services/airtableService';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  finalizeOrder: () => void;
  adjustmentNotifications: Map<string, number>;
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products, isLoading: areProductsLoading } = useProducts();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [adjustmentNotifications, setAdjustmentNotifications] = useState<Map<string, number>>(new Map());
  const [isCartLoading, setIsCartLoading] = useState(true);
  const isInitialLoad = useRef(true);

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
      const price = (item.discount && item.discount > 0)
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + price * Math.min(item.quantity, item.availableStock);
    }, 0);
  }, [inStockItems]);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem && existingItem.quantity >= product.availableStock) {
      alert(`Извините, в наличии только ${product.availableStock} шт.`);
      return;
    }
    if (!existingItem && product.availableStock < 1) {
       alert('Товара нет в наличии.');
       return;
    }

    let newItems;
    if (existingItem) {
      newItems = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [...cartItems, { ...product, quantity: 1 }];
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

    if (quantity > itemToUpdate.availableStock) {
      alert(`Извините, в наличии только ${itemToUpdate.availableStock} шт.`);
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
    return inStockItems.reduce((count, item) => count + Math.min(item.quantity, item.availableStock), 0);
  }, [inStockItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    finalizeOrder,
    adjustmentNotifications,
    isCartLoading
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