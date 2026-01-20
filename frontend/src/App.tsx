import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { StickyCTA } from './components/StickyCTA.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { Home } from './pages/Home.tsx';
import { Imprint, Privacy, Terms } from './pages/Legal.tsx';
import { Contact } from './pages/Contact.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { Loader } from './components/Loader.tsx';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Loader />
          <div className="min-h-screen bg-slate-50 relative flex flex-col">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/imprint" element={<Imprint />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </main>

            <Footer />
            <StickyCTA />
            <CartDrawer />
          </div>
        </Router>
      </CartProvider>
    </LanguageProvider>
  );
}

export default App;