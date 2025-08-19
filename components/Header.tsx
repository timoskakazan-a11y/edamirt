import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import HeartIcon from './icons/HeartIcon';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { cartCount } = useCart();
  const { favoritesCount, setShowFavoritesFilter } = useFavorites();
  const { user, logout } = useAuth();

  const handleFavoritesClick = () => {
    setShowFavoritesFilter(true);
    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-3xl font-extrabold text-brand-orange tracking-wider">edamirt</h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
               <span className="text-sm font-semibold text-slate-600 hidden sm:inline">Привет, {user.name.split(' ')[0]}!</span>
               <button onClick={logout} className="text-sm font-semibold text-slate-500 hover:text-brand-orange">Выйти</button>
               <div className="w-px h-6 bg-slate-200"></div>
            </div>
          )}
          <button
            onClick={handleFavoritesClick}
            className="relative text-slate-600 hover:text-red-500 transition-colors duration-300"
            aria-label="Show favorite products"
          >
            <HeartIcon className="h-8 w-8" isFilled={favoritesCount > 0} />
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={onCartClick}
            className="relative text-slate-600 hover:text-brand-orange transition-colors duration-300"
            aria-label="Open shopping cart"
          >
            <ShoppingCartIcon className="h-8 w-8" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;