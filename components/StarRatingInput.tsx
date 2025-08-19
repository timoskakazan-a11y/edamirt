
import React, { useState } from 'react';
import StarIcon from './icons/StarIcon';

interface StarRatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
  disabled?: boolean;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, setRating, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex justify-center items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`transition-transform duration-200 ${!disabled ? 'hover:scale-125' : ''}`}
          aria-label={`Rate ${star} stars`}
        >
          <StarIcon
            className={`w-10 h-10 transition-colors ${
              (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-slate-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;
