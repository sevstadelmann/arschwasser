import React from 'react';
import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left flex flex-col items-center md:items-start gap-4">
            <Logo className="h-16 w-auto" />
            <div>
               <p className="text-slate-400 text-sm">© 2026 vestryx KLG.</p>
               <p className="text-slate-500 text-xs mt-1">{t('footer.drink_responsibly')}</p>
            </div>
          </div>
          
          <div className="flex space-x-6">
             <a href="https://instagram.com/arschwasserofficial/" target='_blank' className="hover:text-[#23C4D8] transition-colors"><Instagram /></a>
          </div>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-8 text-sm text-slate-400">
           <Link to="/imprint" className="hover:text-white">{t('footer.imprint')}</Link>
           <Link to="/privacy" className="hover:text-white">{t('footer.privacy')}</Link>
           <Link to="/terms" className="hover:text-white">{t('footer.terms')}</Link>
           <Link to="/contact" className="hover:text-white">{t('footer.contact')}</Link>
        </div>
      </div>
    </footer>
  );
};