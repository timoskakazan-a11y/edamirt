

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Review } from '../types';
import { getReviewsForProduct } from '../services/airtableService';
import { useCart } from '../contexts/CartContext';
import XMarkIcon from './icons/XMarkIcon';
import StarIcon from './icons/StarIcon';
import PlusIcon from './icons/PlusIcon';
import MinusIcon from './icons/MinusIcon';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
                key={star}
                className={`w-4 h-4 ${rating >= star ? 'text-yellow-400' : 'text-slate-300'}`}
            />
        ))}
    </div>
);


const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const { cartItems, addToCart, updateQuantity } = useCart();
  
  const cartItem = useMemo(() => cartItems.find(item => item.id === product?.id), [cartItems, product]);
  const quantity = cartItem ? cartItem.quantity : 0;

  const isWeightBased = product?.weightStatus === 'на развес' && !!product?.pricePerKg;

  const step = useMemo(() => {
    if (!isWeightBased) return 1;
    if (product?.weightPerPiece && product.weightPerPiece >= 1) {
        return 1;
    }
    if (product?.weightPerPiece && product.weightPerPiece < 0.04) {
        return 0.1;
    }
    return 0.5;
  }, [isWeightBased, product?.weightPerPiece]);

  useEffect(() => {
    if (product) {
      setIsLoadingReviews(true);
      setReviews([]); // Clear old reviews
      getReviewsForProduct(product.id)
        .then(setReviews)
        .catch(console.error)
        .finally(() => setIsLoadingReviews(false));
    }
  }, [product]);

  if (!product) return null;

  const isOutOfStock = product.availableStock <= 0;
  const isMaxStockReached = quantity >= product.availableStock;
  
  const hasDiscount = product.discount && product.discount > 0;
  
  const basePriceText = isWeightBased ? product.pricePerKg?.toFixed(0) : product.price.toFixed(0);
  const priceUnit = isWeightBased ? '₽/кг' : '₽';
  const discountedPriceValue = hasDiscount 
    ? (isWeightBased ? product.pricePerKg! : product.price) * (1 - product.discount / 100)
    : (isWeightBased ? product.pricePerKg! : product.price);
    
  const estimatedPieces = product.weightPerPiece && quantity > 0
    ? Math.round(quantity / product.weightPerPiece)
    : 0;

  const handleAddToCart = () => {
      if (product) addToCart(product);
  }

  const handleUpdateQuantity = (newQuantity: number) => {
      if (product) {
          const roundedQuantity = Number(newQuantity.toFixed(2));
          if (roundedQuantity < 0) return;
          updateQuantity(product.id, roundedQuantity);
      }
  }

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            >
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                >
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                        <h2 className="text-xl font-bold truncate pr-4">{product.name}</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                            <XMarkIcon className="h-6 w-6 text-slate-600" />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {/* Image Column */}
                            <div className="w-full h-64 md:h-auto bg-slate-100 rounded-xl overflow-hidden">
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover"/>
                            </div>

                            {/* Details Column */}
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{product.name}</h1>
                                {product.rating > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                        <StarRatingDisplay rating={product.rating} />
                                        <span>{product.rating.toFixed(1)}</span>
                                    </div>
                                )}
                                
                                <div className="flex items-baseline gap-3 mb-4">
                                    {hasDiscount ? (
                                    <>
                                        <p className="text-4xl font-black text-red-500">{discountedPriceValue.toFixed(0)} {priceUnit}</p>
                                        <p className="text-xl font-bold text-slate-400 line-through">{basePriceText} {priceUnit}</p>
                                    </>
                                    ) : (
                                    <p className="text-4xl font-black text-slate-900">{basePriceText} {priceUnit}</p>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm mb-4 border-t border-b py-3">
                                    <div>
                                        <p className="text-slate-500">В наличии</p>
                                        <p className="font-bold text-slate-800">{product.availableStock} {isWeightBased ? 'кг' : 'шт'}</p>
                                    </div>
                                    {product.weight && (
                                        <div>
                                            <p className="text-slate-500">{isWeightBased ? 'Цена за' : 'Вес'}</p>
                                            <p className="font-bold text-slate-800">{product.weight}</p>
                                        </div>
                                    )}
                                </div>

                                <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
                                
                                {isWeightBased && product.weightPerPiece && (
                                    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm animate-fadeInUp">
                                        {quantity > 0 ? (
                                            <>
                                                <p className="font-semibold text-slate-800">
                                                    В вашем заказе примерно: <span className="font-bold text-brand-orange">{estimatedPieces} шт.</span>
                                                </p>
                                                <p className="text-slate-500 mt-1 text-xs">
                                                    Вес одной единицы у товаров на развес (например, огурца) может незначительно отличаться.
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-semibold text-slate-800">
                                                    Примерный вес 1 шт: <span className="font-bold text-brand-orange">{(product.weightPerPiece * 1000).toFixed(0)} г</span>
                                                </p>
                                                 <p className="text-slate-500 mt-1 text-xs">
                                                    Это поможет вам лучше ориентироваться в количестве.
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                                
                                <div className="mt-auto h-12 pt-4">
                                     {quantity > 0 ? (
                                        <div className="w-full h-full flex items-center justify-between bg-slate-100 rounded-xl">
                                            <button onClick={() => handleUpdateQuantity(quantity - step)} className="px-5 h-full text-slate-600 hover:text-brand-orange rounded-l-xl"><MinusIcon className="h-5 w-5"/></button>
                                            <span className="font-bold text-lg text-slate-800 whitespace-nowrap">{quantity} {isWeightBased ? 'кг' : 'шт'}</span>
                                            <button 
                                                onClick={() => handleUpdateQuantity(quantity + step)} 
                                                disabled={isMaxStockReached}
                                                className="px-5 h-full text-slate-600 hover:text-brand-orange rounded-r-xl disabled:text-slate-300 disabled:cursor-not-allowed">
                                                <PlusIcon className="h-5 w-5"/>
                                            </button>
                                        </div>
                                     ) : (
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={isOutOfStock}
                                            className="w-full h-full bg-brand-orange text-white rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center transform active:scale-95 hover:bg-brand-orange-dark disabled:bg-slate-300 disabled:cursor-not-allowed"
                                        >
                                            {isOutOfStock ? 'Нет в наличии' : (isWeightBased ? 'Выбрать вес' : 'Добавить в корзину')}
                                        </button>
                                     )}
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-8 pt-6 border-t">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Отзывы ({reviews.length})</h3>
                            {isLoadingReviews ? (
                                <p className="text-slate-500">Загрузка отзывов...</p>
                            ) : reviews.length > 0 ? (
                                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                                    {reviews.map((review, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-1">
                                                <StarRatingDisplay rating={review.rating} />
                                                <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-700">{review.text || <i>Без комментария</i>}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">Отзывов пока нет. Будьте первым!</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
