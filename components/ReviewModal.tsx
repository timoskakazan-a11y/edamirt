
import React, { useState, useEffect } from 'react';
import type { FullOrderDetails, ReviewableProduct } from '../types';
import XMarkIcon from './icons/XMarkIcon';
import StarRatingInput from './StarRatingInput';
import { useAuth } from '../contexts/AuthContext';
import { submitReview, updateProductRating } from '../services/airtableService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderToReview: FullOrderDetails;
  onReviewComplete: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, orderToReview, onReviewComplete }) => {
  const { user } = useAuth();
  const [productsToReview, setProductsToReview] = useState<ReviewableProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (orderToReview) {
      const reviewable: ReviewableProduct[] = orderToReview.productsInfo.map(p => ({
        id: p.id,
        name: p.name,
        imageUrl: p.imageUrl
      }));
      setProductsToReview(reviewable);
      setCurrentIndex(0);
    }
  }, [orderToReview]);
  
  const resetForm = () => {
      setRating(0);
      setReviewText('');
      setIsSubmitting(false);
  };

  const handleNext = () => {
    if (currentIndex < productsToReview.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetForm();
    } else {
      onReviewComplete();
    }
  };

  const handleSubmit = async () => {
    if (rating === 0 || !user) return;
    setIsSubmitting(true);
    const currentProduct = productsToReview[currentIndex];

    try {
        await submitReview({
            почта: user.email,
            товар: [currentProduct.id],
            оценка: rating,
            'текст отзыва': reviewText,
        });
        // Await the rating update to ensure it completes.
        await updateProductRating(currentProduct.id, rating);
    } catch (error) {
        console.error("Failed to submit review:", error);
        alert("Не удалось отправить отзыв. Попробуйте позже.");
    } finally {
        handleNext();
    }
  };
  
  if (!isOpen || productsToReview.length === 0) return null;

  const currentProduct = productsToReview[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Оцените товар</h2>
          <span className="text-slate-500 font-medium">{currentIndex + 1} из {productsToReview.length}</span>
        </div>
        
        <div className="p-6 overflow-y-auto text-center">
            <img src={currentProduct.imageUrl} alt={currentProduct.name} className="w-40 h-40 object-cover rounded-xl mx-auto mb-4"/>
            <h3 className="text-xl font-semibold text-slate-800">{currentProduct.name}</h3>
            
            <div className="my-6">
                <p className="text-slate-600 mb-3">Ваша оценка:</p>
                <StarRatingInput rating={rating} setRating={setRating} />
            </div>

            <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Напишите пару слов о товаре (необязательно)"
                className="w-full h-24 p-3 border bg-slate-50 border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
            ></textarea>
        </div>

        <div className="p-4 border-t border-slate-200 mt-auto grid grid-cols-2 gap-3">
            <button onClick={handleNext} disabled={isSubmitting} className="w-full bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition-colors disabled:opacity-50">
                Пропустить
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting || rating === 0} className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl hover:bg-brand-orange-dark transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center">
                {isSubmitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : 'Отправить'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
