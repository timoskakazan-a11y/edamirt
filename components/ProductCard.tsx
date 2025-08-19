import React, { useState } from 'react';
import type { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';
import StarIcon from './icons/StarIcon';
import HeartIcon from './icons/HeartIcon';
import BarcodeIcon from './icons/BarcodeIcon';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const cartItem = cartItems.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isProdFavorite = isFavorite(product.id);

  const isOutOfStock = product.availableStock <= 0;
  const isMaxStockReached = quantity >= product.availableStock;

  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProdFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite(product.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-brand overflow-hidden flex flex-col transition-all duration-300 border border-transparent hover:border-slate-200 hover:shadow-lg">
      <div className="overflow-hidden h-40 relative bg-slate-200">
        {!isImageLoaded && <div className="absolute inset-0 bg-slate-200 animate-pulse"></div>}
        <img
            className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} 
            src={product.imageUrl} 
            alt={product.name}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
        />
        {hasDiscount && (
            <div className={`absolute top-3 left-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                -{product.discount}%
            </div>
        )}
        <div className={`absolute top-3 right-3 flex items-center gap-2 transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-sm font-bold text-slate-800">
            <StarIcon className="w-4 h-4 text-yellow-500" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
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
        <h3 className="text-base font-semibold text-slate-800">{product.name}</h3>
        {product.barcode && (
          <div className="flex items-center gap-2 text-slate-400 mt-1">
            <BarcodeIcon className="w-4 h-4" />
            <p className="text-xs font-mono tracking-wider">{product.barcode}</p>
          </div>
        )}
        
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2 mb-3 h-8">
            {hasDiscount ? (
              <>
                <p className="text-xl font-black text-red-500">
                  {discountedPrice.toFixed(0)}
                  <span className="text-base font-bold"> ₽</span>
                </p>
                <p className="text-sm font-bold text-slate-400 line-through">
                  {product.price.toFixed(0)} ₽
                </p>
              </>
            ) : (
              <p className="text-xl font-black text-slate-900">
                {product.price.toFixed(0)}
                <span className="text-base font-bold text-slate-500"> ₽</span>
              </p>
            )}
          </div>
          
          <div className="h-11 relative">
            <div className={`absolute inset-0 transition-all duration-300 ${quantity > 0 ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
              <button
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
                className="w-full h-full bg-brand-orange/10 border-2 border-brand-orange text-brand-orange rounded-xl font-bold transition-all duration-200 flex items-center justify-center transform active:scale-95 hover:bg-brand-orange hover:text-white disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                aria-label={`Add ${product.name} to cart`}
              >
                {isOutOfStock ? (
                  <span>Нет в наличии</span>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    <span>Добавить</span>
                  </>
                )}
              </button>
            </div>

            <div className={`absolute inset-0 transition-all duration-300 ${quantity > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
              <div className="w-full h-full flex items-center justify-between bg-slate-100 rounded-xl">
                <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-4 h-full text-slate-600 hover:text-brand-orange rounded-l-xl"><MinusIcon className="h-5 w-5"/></button>
                <span className="font-bold text-lg text-slate-800">{quantity}</span>
                <button 
                  onClick={() => updateQuantity(product.id, quantity + 1)} 
                  disabled={isMaxStockReached}
                  className="px-4 h-full text-slate-600 hover:text-brand-orange rounded-r-xl disabled:text-slate-300 disabled:cursor-not-allowed">
                  <PlusIcon className="h-5 w-5"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;