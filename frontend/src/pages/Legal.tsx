import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Imprint: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-6 py-32 max-w-3xl">
      <h1 className="text-4xl brand-font mb-8">{t('legal.imprint.title')}</h1>
      <div className="space-y-4 text-slate-600">
        <p><strong>{t('legal.imprint.company')}</strong><br/>{t('legal.imprint.address')}</p>
        <p><strong>{t('legal.imprint.contact_title')}</strong><br/>{t('legal.imprint.email')}<br/>{t('legal.imprint.phone')}</p>
        <p><strong>{t('legal.imprint.uid_title')}</strong><br/> {t('legal.imprint.uid')}</p>
      </div>
    </div>
  );
};

export const Privacy: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-6 py-32 max-w-3xl">
      <h1 className="text-4xl brand-font mb-8">{t('legal.privacy.title')}</h1>
      <div className="space-y-4 text-slate-600">
        <p>{t('legal.privacy.intro')}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6">{t('legal.privacy.section1_title')}</h2>
        <p>{t('legal.privacy.section1_text')}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6">{t('legal.privacy.section2_title')}</h2>
        <p>{t('legal.privacy.section2_text')}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6">{t('legal.privacy.section3_title')}</h2>
        <p>{t('legal.privacy.section3_text')}</p>
      </div>
    </div>
  );
};

export const Terms: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto px-6 py-32 max-w-3xl">
      <h1 className="text-4xl brand-font mb-8">{t('legal.terms.title')}</h1>
      <div className="space-y-4 text-slate-600">
        <p>{t('legal.terms.intro')}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6">{t('legal.terms.section1_title')}</h2>
        <p>{t('legal.terms.section1_text')}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6">{t('legal.terms.section2_title')}</h2>
        <p>{t('legal.terms.section2_text')}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6">{t('legal.terms.section3_title')}</h2>
        <p>{t('legal.terms.section3_text')}</p>
      </div>
    </div>
  );
};