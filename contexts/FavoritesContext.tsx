import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface FavoritesContextType {
  favoriteIds: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
  showFavoritesFilter: boolean;
  setShowFavoritesFilter: (show: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const getInitialFavorites = (): string[] => {
  try {
    const item = window.localStorage.getItem('favoriteProducts');
    return item ? JSON.parse(item) : [];
  } catch (error)
 {
    console.error('Error reading favorites from localStorage', error);
    return [];
  }
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getInitialFavorites);
  const [showFavoritesFilter, setShowFavoritesFilter] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem('favoriteProducts', JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Error saving favorites to localStorage', error);
    }
  }, [favoriteIds]);

  const addFavorite = (productId: string) => {
    setFavoriteIds(prev => [...prev, productId]);
  };

  const removeFavorite = (productId: string) => {
    setFavoriteIds(prev => prev.filter(id => id !== productId));
  };

  const isFavorite = (productId: string): boolean => {
    return favoriteIds.includes(productId);
  };
  
  const favoritesCount = useMemo(() => favoriteIds.length, [favoriteIds]);

  const value = {
    favoriteIds,
    addFavorite,
    removeFavorite,
    isFavorite,
    favoritesCount,
    showFavoritesFilter,
    setShowFavoritesFilter,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
