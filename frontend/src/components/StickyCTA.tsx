import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { PRODUCT_IMAGE_URL } from '../constants';

export const StickyCTA: React.FC = () => {
  const [show, setShow] = useState(false);
  const { addToCart } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (approx 600px)
      setShow(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    addToCart({
      id: 'lemon-drop-24',
      name: t('cart.item_name'),
      price: 54.99,
      image: PRODUCT_IMAGE_URL
    });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-slate-200 z-50 md:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center justify-between gap-4">
             <div className="flex flex-col">
               <span className="font-bold text-slate-900">{t('cart.item_name')}</span>
               <span className="text-sm text-slate-500">CHF 24.99</span>
             </div>
             <button 
               onClick={handleAddToCart}
               className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm w-1/2 hover:bg-[#23C4D8] transition-colors"
             >
               {t('cart.add')}
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};