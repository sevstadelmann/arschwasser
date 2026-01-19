import React from 'react';
import { Droplets, Leaf, Percent, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const Ingredients: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('ing.alpine.title'),
      desc: t('ing.alpine.desc'),
      icon: Droplets,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: t('ing.lemon.title'),
      desc: t('ing.lemon.desc'),
      icon: Sun,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: t('ing.nobs.title'),
      desc: t('ing.nobs.desc'),
      icon: Leaf,
      color: "bg-green-100 text-green-600"
    },
    {
      title: t('ing.buzz.title'),
      desc: t('ing.buzz.desc'),
      icon: Percent,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section id="ingredients" className="py-24 bg-white relative overflow-hidden">
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl brand-font mb-4"
          >
            {t('ing.title')}
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-xl text-slate-500"
          >
            {t('ing.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-2xl brand-font mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Nutrition Table */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="mt-24 max-w-4xl mx-auto bg-[#F8FAFC] rounded-3xl p-8 md:p-12 border border-slate-200 relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#23C4D8] opacity-5 rounded-bl-full -mr-10 -mt-10"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFD700] opacity-5 rounded-tr-full -ml-10 -mb-10"></div>
           
           <h3 className="text-3xl brand-font mb-8 text-center relative z-10">{t('nut.title')} <span className="text-base font-sans font-normal text-slate-500">{t('nut.per')}</span></h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 relative z-10">
              {[
                { label: t('nut.energy'), value: "124 kJ / 29 kcal" },
                { label: t('nut.carbs'), value: "3.2 g" },
                { label: t('nut.sugars'), value: "3.2 g" },
                { label: t('nut.fat'), value: "0 g" },
                { label: t('nut.protein'), value: "0 g" },
                { label: t('nut.salt'), value: "0.02 g" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-300 hover:bg-slate-100/50 px-2 transition-colors rounded-lg">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className="font-mono text-slate-900">{item.value}</span>
                </div>
              ))}
           </div>
        </motion.div>
      </div>
    </section>
  );
};