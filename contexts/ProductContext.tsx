import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { getAirtableProducts } from '../services/airtableService';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const productsFromApi = await getAirtableProducts();
      setProducts(productsFromApi);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить товары';
      setError(errorMessage);
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProducts();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', fetchProducts);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchProducts);
    };
  }, [fetchProducts]);

  const value = {
    products,
    isLoading,
    error,
    refetchProducts: fetchProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
