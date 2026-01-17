import React from 'react';

export const Imprint: React.FC = () => (
  <div className="container mx-auto px-6 py-32 max-w-3xl">
    <h1 className="text-4xl brand-font mb-8">Imprint</h1>
    <div className="space-y-4 text-slate-600">
      <p><strong>vestryx KLG</strong><br/>Zihlmattweg 44<br/>6005 Luzern<br/>Schweiz</p>
      <p><strong>Contact:</strong><br/>Email: hello@arschwasser.com<br/>Phone: +49 30 12345678</p>
      <p><strong>UID:</strong><br/> CH-100.2.821.855-3</p>
    </div>
  </div>
);

export const Privacy: React.FC = () => (
  <div className="container mx-auto px-6 py-32 max-w-3xl">
    <h1 className="text-4xl brand-font mb-8">Privacy Policy</h1>
    <div className="space-y-4 text-slate-600">
      <p>At Arschwasser, we take your privacy seriously. We only collect the data necessary to provide our services and improve your experience.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">1. Data Collection</h2>
      <p>We collect information you provide directly to us when you make a purchase or sign up for our newsletter.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">2. Use of Information</h2>
      <p>We use your information to process transactions, send updates, and improve our website.</p>
      <h2 className="text-xl font-bold text-slate-900 mt-6">3. Cookies</h2>
      <p>We use cookies to ensure you get the best experience on our website.</p>
    </div>
  </div>
);