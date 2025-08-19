import React from 'react';

interface SplashScreenProps {
  isLoading: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
  const logoText = "edamirt";

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-orange transition-opacity duration-500 ease-in-out ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isLoading}
    >
        <div className="relative text-center">
          <img
            src="https://i.postimg.cc/MTgC6dhr/4-1.png"
            alt="Orange slice"
            className="absolute -top-20 -left-16 w-32 opacity-0 animate-rollIn"
            style={{ animationDelay: '800ms' }}
          />

          <img
            src="https://i.postimg.cc/x8HWcLQj/3fc68a56c11d8aad0c3c7e2cacfd7a10.png"
            alt="Watermelon slice"
            className="absolute -bottom-24 -right-20 w-44 opacity-0 animate-popOut"
            style={{ animationDelay: '1000ms' }}
          />
          
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
              style={{ animationDelay: '800ms' }}
          >
              доставка продуктов
          </p>
        </div>
    </div>
  );
};

export default SplashScreen;