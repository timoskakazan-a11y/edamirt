import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import SplashScreen from './components/SplashScreen';
import FloatingCartBar from './components/FloatingCartBar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import { ProductProvider } from './contexts/ProductContext';
import EmployeeFlow from './components/EmployeeFlow';
import { OrderProvider, useOrder } from './contexts/OrderContext';
import AddressSelector from './components/AddressSelector';
import { DELIVERY_ADDRESSES } from './constants';
import OrderStatusBanner from './components/OrderStatusBanner';
import ProductDetailModal from './components/ProductDetailModal';
import type { Product } from './types';
import Toast from './components/Toast';
import BetaTestBanner from './components/BetaTestBanner';
import BetaTestPage from './components/BetaTestPage';
import { getBannerUrl } from './services/airtableService';
import { NotificationProvider } from './contexts/NotificationContext';

const CustomerFlow: React.FC = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(DELIVERY_ADDRESSES[0]);
    const { activeOrder, reviewableOrder, isLoading: isOrderLoading } = useOrder();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isBetaPageOpen, setIsBetaPageOpen] = useState(false);
    const [betaBannerUrl, setBetaBannerUrl] = useState<string | null>(null);


    useEffect(() => {
        getBannerUrl('beta тест')
            .then(url => setBetaBannerUrl(url))
            .catch(err => console.error("Failed to fetch beta banner:", err));
    }, []);

    const handleOpenCheckout = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header />
            <main className="container mx-auto px-4 py-6">
                {betaBannerUrl && <BetaTestBanner imageUrl={betaBannerUrl} onClick={() => setIsBetaPageOpen(true)} />}
                {isOrderLoading ? (
                    <div className="h-24 mb-6 bg-slate-200 rounded-xl animate-pulse"></div>
                ) : (activeOrder || reviewableOrder) ? (
                    <OrderStatusBanner />
                ) : (
                    <AddressSelector selectedAddress={selectedAddress} onSelect={setSelectedAddress} />
                )}
                <ProductList onProductClick={setSelectedProduct} />
            </main>
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleOpenCheckout} />
            <CheckoutModal 
                isOpen={isCheckoutOpen} 
                onClose={() => setIsCheckoutOpen(false)} 
                selectedAddress={selectedAddress}
            />
            <ProductDetailModal 
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
            <FloatingCartBar onCartClick={() => setIsCartOpen(true)} />
            <Toast />
            <BetaTestPage isOpen={isBetaPageOpen} onClose={() => setIsBetaPageOpen(false)} />
        </div>
    )
}

const AppContent: React.FC = () => {
  const { user, isAuthLoading } = useAuth();
  
  if (isAuthLoading) {
    return <SplashScreen isLoading={true} />;
  }
  
  if (!user) {
    return <AuthPage />;
  }
  
  if (user.role === 'employee') {
    return <EmployeeFlow />;
  }

  // Customer Flow
  return (
    <ProductProvider>
      <CartProvider>
        <FavoritesProvider>
           <OrderProvider>
             <NotificationProvider>
                <CustomerFlow />
             </NotificationProvider>
           </OrderProvider>
        </FavoritesProvider>
      </CartProvider>
    </ProductProvider>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;