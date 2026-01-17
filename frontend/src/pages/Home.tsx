import React from 'react';
import { Hero } from '../components/Hero.tsx';
import { Marquee } from '../components/Marquee.tsx';
import { Ingredients } from '../components/Ingredients.tsx';
import { VibeSection } from '../components/VibeSection.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  return (
    <>
      <Hero />
      <div className="relative z-40 -mt-10 mb-10">
        <Marquee 
          text={t('marquee1.text')}
          className="bg-[#23C4D8] text-white rotate-1 scale-105 border-y-4 border-white shadow-lg"
          baseVelocity={2}
        />
      </div>
      <Ingredients />
      <div className="relative z-20 my-10">
        <Marquee 
          text={t('marquee2.text')}
          className="bg-[#FFD700] text-black -rotate-1 scale-105 border-y-4 border-white shadow-lg"
          baseVelocity={-2}
        />
      </div>
      <VibeSection />
    </>
  );
};