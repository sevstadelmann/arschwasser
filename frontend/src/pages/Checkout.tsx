import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  Upload, 
  FileText, 
  AlertCircle,
  Image as ImageIcon,
  X
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

type CheckoutStep = 'age' | 'shipping' | 'payment' | 'success';

export const Checkout: React.FC = () => {
  const { items, cartTotal, clearCart } = useCart(); // Assuming clearCart exists in context
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<CheckoutStep>('age');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ID Verification State
  const [idImage, setIdImage] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  // Payment/Terms State
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Shipping State
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  useEffect(() => {
    if (items.length === 0 && step !== 'success') {
      navigate('/');
    }
    // Cleanup preview URL on unmount
    return () => {
      if (idPreview) URL.revokeObjectURL(idPreview);
    };
  }, [items, navigate, step, idPreview]);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdImage(file);
      setIdPreview(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setIdImage(null);
    setIdPreview(null);
  };

  const handleAgeSubmit = () => {
    if (idImage) setStep('shipping');
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  // Final Order Submission
  const handleSubmitOrder = async () => {
    if (!termsAccepted) return;
    setIsSubmitting(true);

    try {
      // 1. Construct FormData to send file + data
      const formData = new FormData();
      
      // Append the ID Image
      if (idImage) {
        formData.append('id_document', idImage);
      }

      // Append Order Details
      const orderData = {
        shipping: shippingInfo,
        cart: items,
        total: cartTotal,
        paymentMethod: 'invoice'
      };
      
      formData.append('order_data', JSON.stringify(orderData));

      // 2. Send to your backend
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Order failed');

      // 3. Success
      if (clearCart) clearCart(); // clear cart logic
      setStep('success');
      
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              
              {/* Step 1: Age Verification (File Upload) */}
              {step === 'age' && (
                <motion.div
                  key="age"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100"
                >
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-3xl brand-font mb-4">{t('checkout.age.title')}</h2>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                      {t('checkout.age.desc')}
                    </p>

                    {/* File Upload Area */}
                    <div className="max-w-md mx-auto">
                      {!idPreview ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-slate-50 transition-colors cursor-pointer relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center text-slate-400">
                            <Upload size={32} className="mb-2" />
                            <span className="font-bold text-slate-600">{t('checkout.age.upload')}</span>
                            <span className="text-xs mt-1">JPG, PNG up to 5MB</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative rounded-2xl overflow-hidden border-2 border-[#23C4D8] bg-slate-50">
                          <img src={idPreview} alt="ID Preview" className="w-full h-48 object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <div className="bg-white px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                              <ImageIcon size={16} className="text-[#23C4D8]" />
                              <span className="text-sm font-bold">Image Selected</span>
                            </div>
                          </div>
                          <button 
                            onClick={clearFile}
                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 shadow-md hover:bg-red-50"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={handleAgeSubmit}
                      disabled={!idImage}
                      className={`mt-8 px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center mx-auto min-w-[200px] ${
                        idImage 
                        ? 'bg-[#23C4D8] text-white hover:bg-[#1ab0c2] shadow-lg shadow-cyan-100' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {t('checkout.age.continue')}
                    </button>

                    <p className="mt-6 text-xs text-slate-400 flex items-center justify-center gap-1">
                      <Lock size={12} /> {t('checkout.age.disclaimer')}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Shipping Info (Unchanged Logic) */}
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
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-2">Email</label>
                      <input 
                        type="email" 
                        required 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-[#23C4D8] valid:border-green-100"
                        value={shippingInfo.email}
                        onChange={e => setShippingInfo({...shippingInfo, email: e.target.value})}
                        placeholder="your.email@example.com"
                      />
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

              {/* Step 3: Payment (Invoice Only) */}
              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100"
                >
                  <h2 className="text-2xl brand-font mb-6">{t('checkout.payment.title')}</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-bold text-slate-700 mb-4 ml-2">{t('checkout.payment.subtitle')}</label>
                    <div className="flex items-center gap-4 p-4 border-2 border-[#23C4D8] bg-cyan-50/50 rounded-2xl">
                       <div className="w-10 h-10 bg-[#23C4D8] text-white rounded-full flex items-center justify-center">
                          <FileText size={20} />
                       </div>
                       <div>
                         <p className="font-bold text-slate-800">{t('checkout.payment.invoice')}</p>
                         <p className="text-sm text-slate-500">{t('checkout.payment.invoiceNotice')}</p>
                       </div>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 mb-6">
                    <AlertCircle className="shrink-0" size={24} />
                    <p className="text-sm leading-relaxed">
                      <strong>{t('checkout.payment.noticeBold')}</strong> {t('checkout.payment.notice')}
                    </p>
                  </div>

                  {/* Confirmation Checkbox */}
                  <div className="mb-8">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          className="peer sr-only"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <div className="w-6 h-6 border-2 border-slate-300 rounded-lg peer-checked:bg-[#23C4D8] peer-checked:border-[#23C4D8] transition-all" />
                        <CheckCircle size={16} className="absolute left-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors pt-0.5">
                        {t('checkout.payment.acceptFirst')}
                        <a href="/terms-of-service" className="underline cursor-pointer mx-1">{t('checkout.payment.acceptSecond')}</a> 
                        {t('checkout.payment.acceptThird')}
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button 
                    onClick={handleSubmitOrder}
                    disabled={!termsAccepted || isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                      termsAccepted && !isSubmitting
                      ? 'bg-slate-900 text-white hover:bg-[#23C4D8]' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('checkout.payment.processing')}
                      </>
                    ) : (
                      t('checkout.payment.placeOrder')
                    )}
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
                    Order received! We are reviewing your ID document. 
                    <br />
                    You will receive an email confirmation shortly.
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