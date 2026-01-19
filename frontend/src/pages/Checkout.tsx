import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle, ShieldCheck, Lock, CreditCard, Smartphone, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import { useNavigate, useSearchParams } from 'react-router-dom'; // Added useSearchParams

type CheckoutStep = 'age' | 'shipping' | 'payment' | 'success';

const SwissIDLogo = () => (
<svg className='mr-2' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="1" fill="#FE0000"/>
<ellipse cx="12.1991" cy="6.07742" rx="2.06631" ry="2.07742" fill="white"/>
<ellipse cx="6.06631" cy="12.2322" rx="2.06631" ry="2.07742" fill="white"/>
<ellipse cx="12.1991" cy="12.2322" rx="2.06631" ry="2.07742" fill="white"/>
<ellipse cx="18.3319" cy="12.2322" rx="2.06631" ry="2.07742" fill="white"/>
<ellipse cx="12.1991" cy="18.387" rx="2.06631" ry="2.07742" fill="white"/>
</svg>
);

export const Checkout: React.FC = () => {
  const { items, cartTotal } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to read URL params
  
  const [step, setStep] = useState<CheckoutStep>('age');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  
  // Shipping State
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: ''
  });

  // 1. Check for verification result on load
  useEffect(() => {
    const status = searchParams.get('verification');
    
    if (status === 'success') {
      setStep('shipping');
      // Optional: Clean URL so a refresh doesn't re-trigger
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (status === 'underage') {
      setVerificationError("You must be 18+ to purchase these items.");
      setStep('age');
    } else if (status === 'failed' || status === 'error') {
      setVerificationError("Verification failed. Please try again.");
      setStep('age');
    }

    if (items.length === 0 && step !== 'success') {
      navigate('/');
    }
  }, [items, navigate, step, searchParams]);

  const handleSwissIDVerify = () => {
    setIsVerifying(true);
    setVerificationError(null);
    
    // Redirect to your Backend Authentication Route
    // This will redirect the user to SwissID, and then back to your app
    window.location.href = 'http://localhost:3000/auth/swissid';
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setStep('success');
    }, 2000);
  };

  const getStepProgress = () => {
    switch (step) {
      case 'age': return 10;
      case 'shipping': return 50;
      case 'payment': return 80;
      case 'success': return 100;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        
        {/* Progress Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="flex justify-between text-sm font-bold text-slate-400 mb-2">
            <span className={step === 'age' || step === 'shipping' || step === 'payment' || step === 'success' ? 'text-black' : ''}>{t('checkout.step.age')}</span>
            <span className={step === 'shipping' || step === 'payment' || step === 'success' ? 'text-black' : ''}>{t('checkout.step.shipping')}</span>
            <span className={step === 'payment' || step === 'success' ? 'text-black' : ''}>{t('checkout.step.payment')}</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#23C4D8]"
              initial={{ width: '10%' }}
              animate={{ width: `${getStepProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Age Verification */}
              {step === 'age' && (
                <motion.div
                  key="age"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100"
                >
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-3xl brand-font mb-4">{t('checkout.age.title')}</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                      {t('checkout.age.desc')}
                    </p>

                    {/* Error Display */}
                    {verificationError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center gap-3 text-red-700">
                        <AlertTriangle size={20} />
                        <span className="font-bold">{verificationError}</span>
                      </div>
                    )}
                    
                    <button
                      onClick={handleSwissIDVerify}
                      disabled={isVerifying}
                      className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center mx-auto shadow-lg shadow-red-200 min-w-[280px]"
                    >
                      {isVerifying ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Redirecting...
                        </div>
                      ) : (
                        <>
                          <SwissIDLogo />
                          {t('checkout.age.swissid_btn')}
                        </>
                      )}
                    </button>
                    <p className="mt-6 text-xs text-slate-400 flex items-center justify-center gap-1">
                      <Lock size={12} /> Secure verification via SwissID
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Shipping Info - Added Basic Validation */}
              {step === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100"
                >
                  <h2 className="text-2xl brand-font mb-6">{t('checkout.shipping.title')}</h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-2">{t('checkout.form.first_name')}</label>
                        <input 
                          type="text" 
                          required 
                          minLength={2}
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-[#23C4D8] valid:border-green-100"
                          value={shippingInfo.firstName}
                          onChange={e => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-2">{t('checkout.form.last_name')}</label>
                        <input 
                          type="text" 
                          required 
                          minLength={2}
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-[#23C4D8] valid:border-green-100"
                          value={shippingInfo.lastName}
                          onChange={e => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-2">{t('checkout.form.address')}</label>
                      <input 
                        type="text" 
                        required 
                        minLength={5}
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-[#23C4D8]"
                        value={shippingInfo.address}
                        onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-2">{t('checkout.form.city')}</label>
                        <input 
                          type="text" 
                          required 
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-[#23C4D8]"
                          value={shippingInfo.city}
                          onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-2">{t('checkout.form.zip')}</label>
                        <input 
                          type="text" 
                          required 
                          pattern="[0-9]{4}" 
                          title="4 digit Swiss ZIP code"
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-[#23C4D8]"
                          value={shippingInfo.zip}
                          onChange={e => setShippingInfo({...shippingInfo, zip: e.target.value})}
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-[#23C4D8] transition-colors mt-4">
                      {t('checkout.form.next')}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ... Payment and Success Steps remain the same ... */}
              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100"
                >
                  <h2 className="text-2xl brand-font mb-6">{t('checkout.payment.title')}</h2>
                  
                  {/* ... Mock Payment UI ... */}
                  <div className="space-y-4 mb-8">
                    <label className="flex items-center gap-4 p-4 border-2 border-[#23C4D8] bg-cyan-50/30 rounded-xl cursor-pointer">
                      <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-[#23C4D8] focus:ring-[#23C4D8]" />
                      <div className="flex items-center gap-3 flex-1">
                        <CreditCard className="text-slate-700" />
                        <span className="font-bold text-slate-700">{t('checkout.payment.card')}</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 border-2 border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50">
                      <input type="radio" name="payment" className="w-5 h-5 text-[#23C4D8] focus:ring-[#23C4D8]" />
                      <div className="flex items-center gap-3 flex-1">
                        <Smartphone className="text-slate-700" />
                        <span className="font-bold text-slate-700">{t('checkout.payment.twint')}</span>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-4 opacity-70 pointer-events-none mb-8">
                     <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                     <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="MM/YY" className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                        <input type="text" placeholder="CVC" className="w-full px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl" />
                     </div>
                  </div>

                  <button 
                    onClick={handlePayment}
                    disabled={isPaying}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-[#23C4D8] transition-colors"
                  >
                     {isPaying ? t('checkout.payment.processing') : t('checkout.payment.pay')}
                  </button>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 rounded-3xl shadow-lg border border-slate-100 text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle size={48} />
                  </motion.div>
                  <h2 className="text-4xl brand-font mb-4">{t('checkout.success.title')}</h2>
                  <p className="text-slate-500 mb-8 text-lg">
                    {t('checkout.success.desc')}
                  </p>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-[#23C4D8] text-white px-8 py-4 rounded-full font-bold hover:bg-[#1ab0c2] transition-colors"
                  >
                    {t('checkout.success.home')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary (Sidebar) */}
          <div className="lg:col-span-1">
             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 sticky top-32">
                <h3 className="text-xl font-bold mb-6">{t('cart.title')}</h3>
                <div className="space-y-4 mb-6">
                   {items.map(item => (
                      <div key={item.id} className="flex gap-3">
                         <div className="w-16 h-16 bg-white rounded-lg p-1 border border-slate-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                         </div>
                         <div className="flex-1">
                            <p className="font-bold text-sm">{item.name}</p>
                            <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                         </div>
                         <p className="font-bold text-sm">CHF {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                   ))}
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-xl font-bold">
                   <span>{t('cart.total')}</span>
                   <span>CHF {cartTotal.toFixed(2)}</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};