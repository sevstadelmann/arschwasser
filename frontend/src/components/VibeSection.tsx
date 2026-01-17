import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const VibeSection: React.FC = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const { t } = useLanguage();

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  return (
    <section ref={containerRef} id="vibe" className="py-0 min-h-screen flex items-center relative overflow-hidden bg-[#23C4D8]">
      {/* Background Waves */}
      <svg className="absolute top-0 left-0 w-full h-24 md:h-48 text-white fill-current transform rotate-180 z-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,144C672,128,768,128,864,138.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      
      <div className="container mx-auto px-4 py-32 z-10 relative">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              style={{ y, rotate }}
              className="bg-white p-3 rounded-3xl shadow-2xl relative"
            >
               {/* Tape Effect */}
               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-white/30 backdrop-blur-sm border border-white/40 rotate-1 shadow-sm z-10"></div>
               
               <img 
                 src="https://falstaff.b-cdn.net/storage/2024/07/HERMITAGE_Beach-Club_Events_1.jpg" 
                 alt="Summer vibes" 
                 className="rounded-2xl w-full h-[400px] md:h-[600px] object-cover filter contrast-110 saturate-110"
               />
            </motion.div>
            
            <div className="text-white space-y-6 md:pl-10">
              <motion.h2 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-6xl md:text-7xl brand-font leading-tight"
                style={{ whiteSpace: 'pre-line' }}
              >
                {t('vibe.title')}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-medium opacity-90"
              >
                {t('vibe.p1')}
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg opacity-80"
              >
                {t('vibe.p2')}
              </motion.p>
              
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 bg-[#FFD700] text-black px-8 py-4 rounded-full font-bold hover:text-[#23C4D8] transition-all text-lg shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
              >
                {t('vibe.cta')}
              </motion.button>
            </div>
         </div>
      </div>

       <svg className="absolute bottom-0 left-0 w-full h-24 md:h-48 text-slate-900 fill-current z-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,144C672,128,768,128,864,138.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </section>
  );
};