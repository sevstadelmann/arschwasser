import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      });

      if (!response.ok) throw new Error('Failed to send message');

      setIsSent(true);
      setFormState({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending contact form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 relative z-10">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl brand-font mb-6">{t('contact.title')}</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl brand-font mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#23C4D8] rounded-full flex items-center justify-center text-white">
                  <Mail size={20} />
                </div>
                {t('contact.get_in_touch')}
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {t('contact.info_desc')}
              </p>
              <div className="space-y-4">
                 <div className="flex items-start gap-4 text-slate-600">
                    <MapPin className="shrink-0 text-[#23C4D8]" />
                    <span>vestryx KLG<br/>Zihlmattweg 44<br/>6005 Luzern<br/>Schweiz</span>
                 </div>
                 {/*}
                 <div className="flex items-center gap-4 text-slate-600">
                    <Phone className="shrink-0 text-[#23C4D8]" />
                    <span>+41 41 123 45 67</span>
                 </div>
                 */}
                 <div className="flex items-center gap-4 text-slate-600">
                    <Mail className="shrink-0 text-[#23C4D8]" />
                    <span>hello@vestryx.com</span>
                 </div>
              </div>
            </div>
            
            {/* Playful Box */}
            <div className="bg-[#FFD700] p-8 rounded-3xl relative overflow-hidden shadow-lg">
               <div className="relative z-10">
                 <h3 className="text-2xl brand-font mb-2 text-black">{t('contact.wholesale_title')}</h3>
                 <p className="text-black/80 font-medium">{t('contact.wholesale_desc')}</p>
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12">
                  <Send size={150} />
               </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 pointer-events-none"></div>
              {isSent ? (
                <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle size={40} />
                  </motion.div>
                  <h3 className="text-2xl brand-font">{t('contact.success_title')}</h3>
                  <p className="text-slate-500">{t('contact.success_desc')}</p>
                  <button 
                    type="button" 
                    onClick={() => setIsSent(false)}
                    className="mt-6 text-[#23C4D8] font-bold hover:underline"
                  >
                    {t('contact.send_another')}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 relative z-10">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2 ml-2">{t('contact.label_name')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-[#23C4D8] focus:bg-white transition-all"
                      placeholder={t('contact.placeholder_name')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2 ml-2">{t('contact.label_email')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-[#23C4D8] focus:bg-white transition-all"
                      placeholder={t('contact.placeholder_email')}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2 ml-2">{t('contact.label_message')}</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-[#23C4D8] focus:bg-white transition-all resize-none"
                      placeholder={t('contact.placeholder_message')}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 text-white font-bold text-lg py-5 rounded-full hover:bg-[#23C4D8] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Sending...</span>
                    ) : (
                      <>
                        {t('contact.submit')}
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};