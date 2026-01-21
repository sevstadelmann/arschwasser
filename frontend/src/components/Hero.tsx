import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PRODUCT_IMAGE_URL } from '../constants';
import { Leaf, Waves, Zap, ArrowDown, Contact, Cross } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { HeroModel } from './HeroModel';
import { href } from 'react-router-dom';

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const { addToCart } = useCart();
  const { t } = useLanguage();
  
  // Mouse parallax state for subtle background movement
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAddToCart = () => {
    addToCart({
      id: 'lemon-drop-24',
      name: t('cart.item_name'),
      price: 54.95,
      image: PRODUCT_IMAGE_URL
    });
  };

  return (
    <section id="product" className="relative h-[100dvh] w-full overflow-hidden bg-black flex flex-col items-center justify-center">
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ opacity }}
      >
        <motion.div 
          className="absolute inset-0"
          animate={{ 
             scale: 1.05,
             x: mousePosition.x * -10, 
             y: mousePosition.y * -10 
          }}
          transition={{ type: "spring", stiffness: 40, damping: 30 }}
        >
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
      </motion.div>
      <motion.div 
        style={{ y: yText }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none pt-0"
      >
        <div className="relative text-center pb-20">
            <h1 className="text-[40vw] md:text-[16vw] leading-[0.8] brand-font text-white drop-shadow-2xl tracking-tighter">
              LEMON
            </h1>
            <h1 className="text-[40vw] md:text-[16vw] leading-[0.8] brand-font text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-[#FFA000] drop-shadow-2xl tracking-tighter">
              DROP
            </h1>
        </div>
      </motion.div>

      {/* 3D Model - Centered & Heroic */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none pb-20">
        {/* Allow pointer events only on the model canvas container if needed, but HeroModel handles it */}
        <div className="w-full h-[60vh] md:h-[75vh] pointer-events-auto">
           <HeroModel />
        </div>
      </div>

      <div className="absolute bottom-5 md:bottom-3 left-0 w-full z-30 pb-8 md:pb-12 px-6 flex flex-col items-center justify-end text-center bg-gradient-to-t from-black via-black/80 to-transparent pt-32">
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-7 max-w-2xl"
        >
            <p className="text-lg md:text-xl text-slate-200 font-medium drop-shadow-md">
              {t('hero.desc')} <br className="hidden md:block" />
              <span className="text-[#FFD700]">{t('hero.no_bs')}</span>
            </p>

            <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                <motion.button 
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black text-lg px-8 py-4 rounded-full font-bold hover:bg-[#FFD700] transition-colors shadow-lg min-w-[200px]"
                >
                  {t('hero.order')}
                </motion.button>
                
                <motion.button 
                  onClick={(() => { window.location.href = '/#/contact'; })}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-black text-lg px-8 py-4 rounded-full font-bold hover:bg-[#FFD700] transition-colors shadow-lg min-w-[200px]"
                >
                  {t('hero.contact')}
                </motion.button>
            </div>
            <div className="flex flex-row items-center gap-4 justify-center">
              <div className="flex gap-3">
                {[
                  { text: t('hero.vegan'), icon: Leaf },
                ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold">
                      <badge.icon size={14} className="text-[#FFD700]" />
                      {badge.text}
                    </div>
                ))}
              </div>
              <div className="flex gap-3">
                {[
                  { text: t('hero.swiss'), icon: Cross },
                ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold">
                      <badge.icon size={14} className="text-[#FFD700]" />
                      {badge.text}
                    </div>
                ))}
              </div>
            </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 text-white/50 hidden md:block"
        >
          <ArrowDown size={24} />
        </motion.div>
      </div>

    </section>
  );
};