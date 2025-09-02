import React from 'react';

interface BetaTestBannerProps {
  onClick: () => void;
  imageUrl: string;
}

const BetaTestBanner: React.FC<BetaTestBannerProps> = ({ onClick, imageUrl }) => {
  return (
    <div className="relative mb-6 max-w-sm mx-auto">
      <button 
        onClick={onClick} 
        className="w-full block focus:outline-none rounded-xl"
        aria-label="Подробнее о бета-тестировании"
      >
        <img 
          src={imageUrl} 
          alt="Информация о бета-тестировании" 
          className="w-full h-auto object-contain rounded-xl"
        />
      </button>
    </div>
  );
};

export default BetaTestBanner;