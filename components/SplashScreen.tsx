import React, { useState, useEffect } from 'react';
import { getSplashImages } from '../services/airtableService';

interface SplashScreenProps {
  isLoading: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
  const logoText = "edamirt";
  const [imageUrls, setImageUrls] = useState<{ orange: string | null; watermelon: string | null; ownerLogo: string | null }>({
    orange: null,
    watermelon: null,
    ownerLogo: null,
  });

  useEffect(() => {
    getSplashImages()
      .then(urls => {
        setImageUrls({ orange: urls.orangeUrl, watermelon: urls.watermelonUrl, ownerLogo: urls.ownerLogoUrl });
      })
      .catch(err => console.error("Failed to load splash images:", err));
  }, []);


  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-orange transition-opacity duration-500 ease-in-out ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isLoading}
    >
        <div className="relative text-center">
          {imageUrls.orange && (
            <img
              src={imageUrls.orange}
              alt="Orange slice"
              className="absolute -top-32 -left-20 w-32 opacity-0 animate-rollIn"
              style={{ animationDelay: '400ms' }}
            />
          )}

          {imageUrls.watermelon && (
            <img
              src={imageUrls.watermelon}
              alt="Watermelon slice"
              className="absolute -bottom-36 -right-24 w-44 opacity-0 animate-popOut"
              style={{ animationDelay: '600ms' }}
            />
          )}
          
          <h1 className="text-6xl font-extrabold text-white cursor-default">
            {logoText.split('').map((char, index) => (
              <span
                key={index}
                className="inline-block opacity-0 animate-popIn"
                style={{ animationDelay: `${100 * index}ms` }}
              >
                {char}
              </span>
            ))}
          </h1>
          <p 
              className="text-white text-base font-medium tracking-widest mt-2 opacity-0 animate-fadeInUp"
              style={{ animationDelay: '600ms' }}
          >
              доставка продуктов
          </p>
        </div>
        {imageUrls.ownerLogo && (
            <img
                src={imageUrls.ownerLogo}
                alt="Owner Logo"
                className="absolute bottom-8 w-24 opacity-0 animate-fadeInUp"
                style={{ animationDelay: '800ms' }}
            />
        )}
    </div>
  );
};

export default SplashScreen;