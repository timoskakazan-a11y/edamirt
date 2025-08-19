
import React, { useState } from 'react';
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

const CustomerFlow: React.FC = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(DELIVERY_ADDRESSES[0]);
    const { activeOrder, isLoading: isOrderLoading } = useOrder();


    const handleOpenCheckout = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Header onCartClick={() => setIsCartOpen(true)} />
            <main className="container mx-auto px-4 py-6">
                {isOrderLoading ? (
                    <div className="h-24 mb-6 bg-slate-200 rounded-xl animate-pulse"></div>
                ) : activeOrder ? (
                    <OrderStatusBanner />
                ) : (
                    <AddressSelector selectedAddress={selectedAddress} onSelect={setSelectedAddress} />
                )}
                <ProductList />
            </main>
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleOpenCheckout} />
            <CheckoutModal 
                isOpen={isCheckoutOpen} 
                onClose={() => setIsCheckoutOpen(false)} 
                selectedAddress={selectedAddress}
            />
            <FloatingCartBar onCartClick={() => setIsCartOpen(true)} />
        </div>
    )
}

const MemoizedCustomerFlow = React.memo(CustomerFlow);

const AppContent: React.FC = () => {
  const { user, isAuthLoading } = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500); // Splash screen duration
    return () => clearTimeout(timer);
  }, []);
  
  if (isAppLoading || isAuthLoading) {
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
             <MemoizedCustomerFlow />
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