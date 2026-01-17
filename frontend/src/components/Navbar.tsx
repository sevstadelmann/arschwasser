import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Logo } from './Logo';
import { LogoWhite } from './LogoWhite';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openCart, itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (hash: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
       const element = document.getElementById(hash.replace('#', ''));
       element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Determine if we should use the dark navigation style (black text, colored logo)
  // This applies when scrolled OR when on pages with light backgrounds (Contact, Legal pages)
  const lightBgPages = ['/contact', '/imprint', '/privacy', '/terms'];
  const isLightBgPage = lightBgPages.includes(location.pathname);
  const isDarkState = scrolled || isLightBgPage;

  // Ensure text is white on the dark hero background, black when scrolled onto white background or on light pages
  const textColorClass = isDarkState ? 'text-slate-900' : 'text-white';
  const navTextColor = isDarkState ? "#0f172a" : "#ffffff";
  
  const showColoredLogo = isDarkState || isOpen;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="z-50 relative flex items-center gap-2 group focus:outline-none">
             <div className="transform transition-transform duration-300 group-hover:scale-110 origin-left">
                 {showColoredLogo ? (
                    <Logo className="h-12 md:h-20 w-auto" />
                 ) : (
                    <LogoWhite className="h-12 md:h-20 w-auto" />
                 )}
             </div>
             <span className="sr-only">Arschwasser</span>
          </Link>

          {/* Desktop Menu */}
          <div className={`hidden md:flex items-center space-x-8 font-semibold text-lg transition-colors duration-300`}>
            {['product', 'ingredients', 'vibe'].map((item) => (
              <motion.button 
                key={item}
                onClick={() => handleNavClick(`#${item}`)} 
                animate={{ color: navTextColor }}
                whileHover={{ 
                  scale: 1.05,
                  color: "#23C4D8",
                  transition: { duration: 0.2 }
                }}
                whileTap={{
                  scale: 0.95,
                  color: "#23C4D8"
                }}
                className="relative group capitalize drop-shadow-md focus:outline-none"
              >
                {t(`nav.${item}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#23C4D8] transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            ))}
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleLanguage}
                className={`p-2 rounded-full transition-colors font-bold text-sm ${isDarkState ? 'text-slate-900' : 'text-white'} hover:text-[#23C4D8] focus:outline-none`}
              >
                {language === 'en' ? 'DE' : 'EN'}
              </button>

              <motion.button 
                onClick={openCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${isDarkState ? 'bg-black text-white' : 'bg-white text-black'} px-6 py-3 rounded-full hover:bg-[#23C4D8] hover:text-white transition-colors flex items-center gap-2 relative shadow-lg focus:outline-none`}
              >
                <ShoppingBag size={20} />
                <span>{t('nav.basket')}</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FFD700] text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                    {itemCount}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Toggle & Cart */}
          <div className="flex items-center gap-3 md:hidden z-50 relative">
             <button 
                onClick={toggleLanguage}
                className={`p-2 font-bold text-sm ${textColorClass} hover:text-[#23C4D8] focus:outline-none`}
              >
                {language === 'en' ? 'DE' : 'EN'}
             </button>
             <button onClick={openCart} className={`relative p-2 transition-colors duration-300 ${textColorClass} hover:text-[#23C4D8] focus:outline-none`}>
               <ShoppingBag size={28} />
               {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#FFD700] text-black text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
             </button>
             <button 
               onClick={() => setIsOpen(!isOpen)}
               className={`p-2 transition-colors duration-300 ${isOpen ? 'text-slate-900' : textColorClass} hover:text-[#23C4D8] focus:outline-none`}
             >
               {isOpen ? <X size={32} /> : <Menu size={32} />}
             </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-40 flex flex-col justify-center items-center space-y-8"
          >
            {['product', 'ingredients', 'vibe'].map((item, i) => (
              <motion.button 
                key={item}
                onClick={() => handleNavClick(`#${item}`)} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="text-4xl brand-font hover:text-[#23C4D8] capitalize text-slate-900 focus:outline-none"
              >
                {t(`nav.${item}`)}
              </motion.button>
            ))}
            <motion.button 
              onClick={() => { setIsOpen(false); openCart(); }} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#23C4D8] text-white px-10 py-5 rounded-full text-xl font-bold shadow-xl mt-8 focus:outline-none"
            >
              {t('nav.view_basket')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};