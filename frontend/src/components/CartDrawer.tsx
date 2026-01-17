import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { items, removeFromCart, updateQuantity, cartTotal, isCartOpen, closeCart } = useCart();
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black z-50"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl brand-font">{t('cart.title')}</h2>
              <button onClick={closeCart} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p className="text-lg font-medium">{t('cart.empty')}</p>
                  <button 
                    onClick={closeCart}
                    className="text-[#23C4D8] font-bold hover:underline"
                  >
                    {t('cart.start')}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-24 bg-[#FFF9C4] rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                        <img src={item.image} alt={item.name} className="h-full object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                           <h3 className="font-bold text-slate-900">{item.name}</h3>
                           <p className="text-slate-500 text-sm">CHF {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex items-center border border-slate-200 rounded-full">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:text-[#23C4D8]"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:text-[#23C4D8]"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-red-500 hover:text-red-600 font-medium"
                          >
                            {t('cart.remove')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <div className="flex justify-between items-center mb-6 text-xl font-bold">
                  <span>{t('cart.total')}</span>
                  <span>CHF {cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-lg hover:bg-[#23C4D8] transition-colors">
                  {t('cart.checkout')}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  {t('cart.shipping')}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};