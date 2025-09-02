

import React, { useMemo } from 'react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import StarIcon from './icons/StarIcon';
import HeartIcon from './icons/HeartIcon';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  const cartItem = cartItems.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : null;
  const isProdFavorite = isFavorite(product.id);

  const isOutOfStock = product.availableStock <= 0;
  const isMaxStockReached = quantity !== null && quantity >= product.availableStock;

  const hasDiscount = product.discount && product.discount > 0;
  const isWeightBased = product.weightStatus === 'на развес' && product.pricePerKg;

  const step = useMemo(() => {
    if (!isWeightBased) return 1;
    if (product.weightPerPiece && product.weightPerPiece >= 1) {
        return 1;
    }
    if (product.weightPerPiece && product.weightPerPiece < 0.04) {
        return 0.1;
    }
    return 0.5;
  }, [isWeightBased, product.weightPerPiece]);

  const basePriceText = isWeightBased ? product.pricePerKg?.toFixed(0) : product.price.toFixed(0);
  const priceUnit = isWeightBased ? '₽/кг' : '₽';
  
  const discountedPrice = hasDiscount 
    ? (isWeightBased ? product.pricePerKg! : product.price) * (1 - product.discount / 100)
    : (isWeightBased ? product.pricePerKg! : product.price);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProdFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };
  
  const handleQuantityChange = (newQuantity: number) => {
      // Round to 2 decimal places to avoid floating point issues
      const roundedQuantity = Number(newQuantity.toFixed(2));
      if (roundedQuantity < 0) return;
      updateQuantity(product.id, roundedQuantity);
  }

  return (
    <div className="bg-white rounded-2xl shadow-brand overflow-hidden flex flex-col transition-all duration-300 border border-transparent hover:border-slate-200 hover:shadow-lg">
       <div className="relative cursor-pointer" onClick={() => onProductClick(product)}>
        <div className="relative aspect-square overflow-hidden bg-slate-200">
            {product.thumbnailUrl && (
                <img
                    src={product.thumbnailUrl}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover filter blur-md scale-105"
                />
            )}
            <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                onLoad={(e) => { e.currentTarget.classList.add('opacity-100'); }}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0"
            />
        </div>
          {hasDiscount && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  -{product.discount}%
              </div>
          )}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {product.rating > 0 && (
              <div className="flex items-center gap-1 text-sm font-bold bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span>{product.rating.toFixed(1)}</span>
              </div>
          )}
          <button 
            onClick={handleFavoriteToggle}
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-red-500 transition-transform duration-200 active:scale-75"
            aria-label={isProdFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon className="w-5 h-5 transition-all duration-200" isFilled={isProdFavorite} />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="cursor-pointer" onClick={() => onProductClick(product)}>
          <h3 className="text-base font-semibold text-slate-800 min-h-[2.5rem]">{product.name}</h3>
           {product.weight && !isWeightBased && (
              <p className="text-sm text-slate-400 mt-1">{product.weight}</p>
            )}
        </div>
        
        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between gap-2 mb-3 h-8">
            <div className="flex items-baseline gap-2">
                {hasDiscount ? (
                  <>
                    <p className="text-xl font-black text-red-500">
                      {discountedPrice.toFixed(0)}
                      <span className="text-base font-bold"> {priceUnit}</span>
                    </p>
                    <p className="text-sm font-bold text-slate-400 line-through">
                      {basePriceText} {priceUnit}
                    </p>
                  </>
                ) : (
                  <p className="text-xl font-black text-slate-900">
                    {basePriceText}
                    <span className="text-base font-bold text-slate-500"> {priceUnit}</span>
                  </p>
                )}
            </div>
          </div>
          
          <div className="h-11 relative">
            {isOutOfStock ? (
                 <div className="w-full h-full flex items-center justify-center bg-slate-100 border-slate-200 text-slate-400 rounded-xl font-bold">
                    Нет в наличии
                 </div>
            ) : quantity !== null && quantity > 0 ? (
                <div className="w-full h-full flex items-center justify-between bg-slate-100 rounded-xl">
                    <button onClick={() => handleQuantityChange(quantity - step)} className="px-4 h-full text-slate-600 hover:text-brand-orange rounded-l-xl"><MinusIcon className="h-5 w-5"/></button>
                    <span className="font-bold text-lg text-slate-800 whitespace-nowrap">{quantity} {isWeightBased ? 'кг' : 'шт'}</span>
                    <button 
                      onClick={() => handleQuantityChange(quantity + step)} 
                      disabled={isMaxStockReached}
                      className="px-4 h-full text-slate-600 hover:text-brand-orange rounded-r-xl disabled:text-slate-300 disabled:cursor-not-allowed">
                      <PlusIcon className="h-5 w-5"/>
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => addToCart(product)}
                    className="w-full h-full bg-brand-orange/10 border-2 border-brand-orange text-brand-orange rounded-xl font-bold transition-all duration-200 flex items-center justify-center transform active:scale-95 hover:bg-brand-orange hover:text-white"
                    aria-label={`Add ${product.name} to cart`}
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>{isWeightBased ? 'Выбрать вес' : 'Добавить'}</span>
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
