import React, { useState, useMemo, useEffect } from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import { useFavorites } from '../contexts/FavoritesContext';
import { useProducts } from '../contexts/ProductContext';
import HeartIcon from './icons/HeartIcon';

const FAVORITES_CATEGORY = 'Избранное';

const ProductList: React.FC = () => {
  const { products: allProducts, isLoading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { favoriteIds, showFavoritesFilter, setShowFavoritesFilter } = useFavorites();

  useEffect(() => {
    if (showFavoritesFilter) {
      setSelectedCategory(FAVORITES_CATEGORY);
    }
  }, [showFavoritesFilter]);

  const categories = useMemo(() => {
    const baseCategories = ['All', ...new Set(allProducts.map(p => p.category).filter(Boolean))];
    if (favoriteIds.length > 0) {
      const favIndex = baseCategories.indexOf(FAVORITES_CATEGORY);
      if (favIndex > -1) {
        baseCategories.splice(favIndex, 1);
      }
      return [baseCategories[0], FAVORITES_CATEGORY, ...baseCategories.slice(1)];
    }
    return baseCategories;
  }, [allProducts, favoriteIds]);

  const filteredProducts = useMemo(() => {
    let productsToFilter = allProducts;
    
    if (selectedCategory === FAVORITES_CATEGORY) {
        productsToFilter = allProducts.filter(p => favoriteIds.includes(p.id));
    } else if (selectedCategory !== 'All') {
        productsToFilter = allProducts.filter(p => p.category === selectedCategory);
    }

    return productsToFilter.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, selectedCategory, allProducts, favoriteIds]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (category === FAVORITES_CATEGORY) {
      setShowFavoritesFilter(true);
    } else {
      setShowFavoritesFilter(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-16 text-slate-500">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">Ошибка: {error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <div className="relative mb-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </span>
            <input
                type="text"
                placeholder="Найти продукты..."
                className="w-full p-3 pl-11 border border-transparent bg-slate-100 rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-transparent transition duration-300"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
            {categories.map(category => (
            <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors duration-200 flex items-center gap-2 ${
                selectedCategory === category
                    ? 'bg-brand-orange text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
            >
                {category === FAVORITES_CATEGORY && <HeartIcon className="w-4 h-4" />}
                {category}
            </button>
            ))}
        </div>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-slate-700">Товары не найдены</h2>
            <p className="text-slate-500 mt-2">Попробуйте изменить поиск или фильтры.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;