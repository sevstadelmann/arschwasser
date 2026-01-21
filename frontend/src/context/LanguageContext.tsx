import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.product': 'The Drop',
    'nav.ingredients': 'Ingredients',
    'nav.vibe': 'Vibe',
    'nav.basket': 'Basket',
    'nav.view_basket': 'View Basket',
    
    'hero.desc': 'Sparkling mountain water. Real lemon. 4.7% ABV.',
    'hero.no_bs': 'No artificial nonsense.',
    'hero.order': 'Order 24-Pack',
    'hero.contact': 'Contact Us',
    'hero.vegan': 'Vegan',
    'hero.swiss': 'Swiss Made',
    
    'marquee1.text': 'LEMON DROP • REFRESHING • 4.7% VOL • TASTES BETTER THAN IT SOUNDS ',
    
    'ing.title': "What's Inside?",
    'ing.subtitle': 'Only the good stuff. Serious flavor, funny name.',
    'ing.alpine.title': 'Alpine Water',
    'ing.alpine.desc': 'Crystal clear sparkling water from the mountains. Crisp, clean, and ridiculously refreshing.',
    'ing.lemon.title': 'Natural Lemon',
    'ing.lemon.desc': 'Real lemon juice concentrate. Sour enough to wake you up, sweet enough to keep you drinking.',
    'ing.nobs.title': 'No BS',
    'ing.nobs.desc': 'No artificial sweeteners, no preservatives, no weird chemical aftertaste.',
    'ing.buzz.title': 'The Buzz',
    'ing.buzz.desc': '4.7% Alcohol by volume. The perfect amount for a sunny afternoon by the lake (or bathtub).',
    
    'nut.title': 'Nutritional Facts',
    'nut.per': '(Per 100ml)',
    'nut.energy': 'Energy',
    'nut.carbs': 'Carbohydrates',
    'nut.sugars': 'Of which sugars',
    'nut.fat': 'Fat',
    'nut.protein': 'Protein',
    'nut.salt': 'Salt',

    'marquee2.text': 'SUMMER IN A CAN • NO ARTIFICIAL FLAVORS • VEGAN FRIENDLY ',
    
    'vibe.title': "Don't Be A \n Sitting Duck",
    'vibe.p1': 'Life is too short for boring drinks. Arschwasser was born out of a desire for something different—a drink that acknowledges the absurdity of life while tasting absolutely divine.',
    'vibe.p2': "Whether you're floating down a river, roasting in the city sun, or just chilling in your bathtub with a rubber ducky, we've got the hydration part covered. The rest is up to you.",
    'vibe.cta': 'Join the Flock',
    
    'footer.drink_responsibly': 'Drink responsibly. 18+',
    'footer.imprint': 'Imprint',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact',
    
    'cart.title': 'Your Basket',
    'cart.empty': 'Your basket is empty',
    'cart.start': 'Start Shopping',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.shipping': 'Shipping and taxes calculated at checkout.',
    'cart.add': 'Add to Cart',
    'cart.remove': 'Remove',
    'cart.item_name': 'Lemon Drop 24-Pack',

    'contact.title': 'Get In Touch',
    'contact.subtitle': 'Questions? Comments? Just want to say hello? We are all ears.',
    'contact.get_in_touch': 'Reach Out',
    'contact.info_desc': 'We love hearing from our community. Whether you want to stock Arschwasser in your bar or just tell us a joke, drop us a line.',
    'contact.wholesale_title': 'Wholesale Inquiries?',
    'contact.wholesale_desc': 'Looking to sell Arschwasser? We offer great rates for partners.',
    'contact.success_title': 'Message Sent!',
    'contact.success_desc': "Thanks for reaching out. We'll get back to you faster than a duck takes to water.",
    'contact.send_another': 'Send another message',
    'contact.label_name': 'Name',
    'contact.placeholder_name': 'Your name',
    'contact.label_email': 'Email',
    'contact.placeholder_email': 'your@email.com',
    'contact.label_message': 'Message',
    'contact.placeholder_message': 'Tell us something cool...',
    'contact.submit': 'Send Message',

    'legal.imprint.title': 'Imprint',
    'legal.imprint.company': 'vestryx KLG',
    'legal.imprint.address': 'Zihlmattweg 44, 6005 Luzern, Switzerland',
    'legal.imprint.contact_title': 'Contact:',
    'legal.imprint.email': 'Email: hello@arschwasser.com',
    'legal.imprint.phone': 'Phone: +41 41 123 45 67',
    'legal.imprint.uid_title': 'UID:',
    'legal.imprint.uid': 'CH-100.2.821.855-3',

    'legal.privacy.title': 'Privacy Policy',
    'legal.privacy.intro': 'At Arschwasser, we take your privacy seriously. We only collect the data necessary to provide our services and improve your experience.',
    'legal.privacy.section1_title': '1. Data Collection',
    'legal.privacy.section1_text': 'We collect information you provide directly to us when you make a purchase or sign up for our newsletter.',
    'legal.privacy.section2_title': '2. Use of Information',
    'legal.privacy.section2_text': 'We use your information to process transactions, send updates, and improve our website.',
    'legal.privacy.section3_title': '3. Cookies',
    'legal.privacy.section3_text': 'We use cookies to ensure you get the best experience on our website.',

    'legal.terms.title': 'Terms of Service',
    'legal.terms.intro': 'By using our website, you agree to these terms. Please read them carefully.',
    'legal.terms.section1_title': '1. General',
    'legal.terms.section1_text': 'Arschwasser is a beverage brand operated by vestryx KLG. These terms govern your use of our website and purchase of our products.',
    'legal.terms.section2_title': '2. Purchases',
    'legal.terms.section2_text': 'You must be at least 18 years old to purchase alcoholic beverages from our site. We reserve the right to refuse service.',
    'legal.terms.section3_title': '3. Liability',
    'legal.terms.section3_text': 'We are not liable for any indirect damages arising from the use of our products or website.',

    'checkout.step.age': 'Age Verification',
    'checkout.step.shipping': 'Shipping',
    'checkout.step.payment': 'Payment',
    'checkout.age.title': 'Verify Your Age',
    'checkout.age.desc': 'Please upload a photo of your Passport or ID card to prove you are over 18',
    'checkout.age.upload': 'Click to upload ID',
    'checkout.age.continue': 'Continue to Shipping',
    'checkout.age.disclaimer': 'Your ID is securely encrypted and only used for verification.',
    'checkout.age.swissid_btn': 'Verify with SwissID',
    'checkout.age.verifying': 'Verifying Identity...',
    'checkout.age.success': 'Age Verified Successfully',
    'checkout.shipping.title': 'Shipping Details',
    'checkout.form.first_name': 'First Name',
    'checkout.form.last_name': 'Last Name',
    'checkout.form.address': 'Address',
    'checkout.form.city': 'City',
    'checkout.form.zip': 'ZIP Code',
    'checkout.form.next': 'Continue to Payment',
    'checkout.payment.subtitle': 'Payment Method',
    'checkout.payment.title': 'Review & Payment',
    'checkout.payment.card': 'Credit Card',
    'checkout.payment.twint': 'TWINT',
    'checkout.payment.invoice': 'Invoice',
    'checkout.payment.invoiceNotice': 'Pay within 30 days after receipt',
    'checkout.payment.notice': 'We manually verify all IDs and orders. Processing usually takes 1-2 business days. The invoice will be sent via email along with your shipping confirmation once approved.',
    'checkout.payment.noticeBold': 'Please Note:',
    'checkout.payment.acceptFirst': 'I confirm that the uploaded ID is mine and valid. I accept the ',
    'checkout.payment.acceptSecond': 'Terms of Service',
    'checkout.payment.acceptThird': ' and agree to pay the invoice.',
    'checkout.payment.pay': 'Pay Now',
    'checkout.payment.processing': 'Processing...',
    'checkout.success.title': 'Order Confirmed!',
    'checkout.success.desc': 'Thank you for your order. Your Arschwasser is on its way.',
    'checkout.success.home': 'Back to Home'
  },
  de: {
    'nav.product': 'The Drop',
    'nav.ingredients': 'Inhaltsstoffe',
    'nav.vibe': 'Vibe',
    'nav.basket': 'Warenkorb',
    'nav.view_basket': 'Warenkorb ansehen',
    
    'hero.desc': 'Natürliches Mineralwasser. Echte Zitrone. 4,7% Vol.',
    'hero.no_bs': 'Keine künstlichen Inhaltsstoffe.',
    'hero.order': '24er-Pack bestellen',
    'hero.contact': 'Kontaktiere Uns',
    'hero.vegan': 'Vegan',
    'hero.swiss': 'Schweizer Produkt',
    
    'marquee1.text': 'LEMON DROP • ERFRISCHEND • 4,7% VOL • TASTES BETTER THAN IT SOUNDS ',
    
    'ing.title': "Was ist drin?",
    'ing.subtitle': 'Kompromissloser Geschmack. Unkonventioneller Name.',
    'ing.alpine.title': 'Quellwasser',
    'ing.alpine.desc': 'Kristallklares Sprudelwasser aus den Bergen. Klar, sauber und erfrischend.',
    'ing.lemon.title': 'Natürliche Zitrone',
    'ing.lemon.desc': 'Echtes Zitronensaftkonzentrat. Sauer genug, um dich aufzuwecken, süss genug, um weiterzutrinken.',
    'ing.nobs.title': 'Kein BS',
    'ing.nobs.desc': 'Keine künstlichen Süssstoffe, keine Konservierungsstoffe, kein komischer chemischer Nachgeschmack.',
    'ing.buzz.title': 'Der Schwips',
    'ing.buzz.desc': '4,7% Alkoholvolumen. Die perfekte Menge für einen sonnigen Nachmittag am See (oder in der Badewanne).',
    
    'nut.title': 'Nährwerte',
    'nut.per': '(Pro 100ml)',
    'nut.energy': 'Energie',
    'nut.carbs': 'Kohlenhydrate',
    'nut.sugars': 'Davon Zucker',
    'nut.fat': 'Fett',
    'nut.protein': 'Eiweiß',
    'nut.salt': 'Salz',

    'marquee2.text': 'SOMMER IN DER DOSE • KEINE KÜNSTLICHEN AROMEN • VEGAN ',
    
    'vibe.title': "Sei keine \n lahme Ente",
    'vibe.p1': 'Das Leben ist zu kurz für langweilige Getränke. Arschwasser entstand aus dem Wunsch nach etwas Anderem – einem Getränk, das die Absurdität des Lebens anerkennt und dabei noch gut schmeckt.',
    'vibe.p2': "Egal, ob du den Fluss hinuntertreibst, in der Stadt in der Sonne brutzelst oder einfach nur mit einer Gummiente in der Badewanne entspannst, wir kümmern uns um die Flüssigkeitszufuhr. Der Rest liegt bei dir.",
    'vibe.cta': 'Schliess dich dem Schwarm an',
    
    'footer.drink_responsibly': 'Kein Verkauf und keine Abgabe von alkoholischen Getränken an unter 18-Jährige',
    'footer.imprint': 'Impressum',
    'footer.privacy': 'Datenschutzerklärung',
    'footer.terms': 'AGB',
    'footer.contact': 'Kontakt',
    
    'cart.title': 'Dein Warenkorb',
    'cart.empty': 'Dein Warenkorb ist leer',
    'cart.start': 'Jetzt einkaufen',
    'cart.total': 'Gesamt',
    'cart.checkout': 'Zur Kasse',
    'cart.shipping': 'Versand und Steuern werden an der Kasse berechnet.',
    'cart.add': 'In den Warenkorb',
    'cart.remove': 'Entfernen',
    'cart.item_name': 'Lemon Drop 24er-Pack',

    'contact.title': 'Kontakt',
    'contact.subtitle': 'Fragen? Kommentare? Einfach mal Hallo sagen?',
    'contact.get_in_touch': 'Schreib uns',
    'contact.info_desc': 'Wir freuen uns, von dir zu hören. Egal, ob du Arschwasser in deiner Bar verkaufen möchtest oder uns einfach einen Witz erzählen willst.',
    'contact.wholesale_title': 'Händleranfragen?',
    'contact.wholesale_desc': 'Du möchtest Arschwasser verkaufen? Wir bieten tolle Konditionen für Partner.',
    'contact.success_title': 'Nachricht gesendet!',
    'contact.success_desc': "Danke für deine Nachricht. Wir melden uns schneller bei dir, als eine Ente im Wasser landet.",
    'contact.send_another': 'Noch eine Nachricht senden',
    'contact.label_name': 'Name',
    'contact.placeholder_name': 'Dein Name',
    'contact.label_email': 'E-Mail',
    'contact.placeholder_email': 'deine@email.com',
    'contact.label_message': 'Nachricht',
    'contact.placeholder_message': 'Erzähl uns was...',
    'contact.submit': 'Absenden',

    'legal.imprint.title': 'Impressum',
    'legal.imprint.company': 'vestryx KLG',
    'legal.imprint.address': 'Zihlmattweg 44, 6005 Luzern, Schweiz',
    'legal.imprint.contact_title': 'Kontakt:',
    'legal.imprint.email': 'E-Mail: hello@arschwasser.com',
    'legal.imprint.phone': 'Telefon: +41 41 123 45 67',
    'legal.imprint.uid_title': 'UID:',
    'legal.imprint.uid': 'CH-100.2.821.855-3',

    'legal.privacy.title': 'Datenschutzerklärung',
    'legal.privacy.intro': 'Bei Arschwasser nehmen wir deine Privatsphäre ernst. Wir sammeln nur die Daten, die für die Bereitstellung unserer Dienste und die Verbesserung deines Erlebnisses notwendig sind.',
    'legal.privacy.section1_title': '1. Datenerfassung',
    'legal.privacy.section1_text': 'Wir erfassen Informationen, die du uns direkt zur Verfügung stellst, wenn du einen Kauf tätigst oder dich für unseren Newsletter anmeldest.',
    'legal.privacy.section2_title': '2. Nutzung der Informationen',
    'legal.privacy.section2_text': 'Wir verwenden deine Informationen, um Transaktionen abzuwickeln, Updates zu senden und unsere Website zu verbessern.',
    'legal.privacy.section3_title': '3. Cookies',
    'legal.privacy.section3_text': 'Wir verwenden Cookies, um sicherzustellen, dass du das beste Erlebnis auf unserer Website hast.',

    'legal.terms.title': 'Allgemeine Geschäftsbedingungen',
    'legal.terms.intro': 'Durch die Nutzung unserer Website stimmst du diesen Bedingungen zu. Bitte lies sie sorgfältig durch.',
    'legal.terms.section1_title': '1. Allgemeines',
    'legal.terms.section1_text': 'Arschwasser ist eine Getränkemarke, die von vestryx KLG betrieben wird. Diese Bedingungen regeln deine Nutzung unserer Website und den Kauf unserer Produkte.',
    'legal.terms.section2_title': '2. Käufe',
    'legal.terms.section2_text': 'Du musst mindestens 18 Jahre alt sein, um alkoholische Getränke auf unserer Seite zu kaufen. Wir behalten uns das Recht vor, den Service zu verweigern.',
    'legal.terms.section3_title': '3. Haftung',
    'legal.terms.section3_text': 'Wir haften nicht für indirekte Schäden, die aus der Nutzung unserer Produkte oder Website entstehen.',

    'checkout.step.age': 'Altersprüfung',
    'checkout.step.shipping': 'Versand',
    'checkout.step.payment': 'Zahlung',
    'checkout.age.title': 'Altersprüfung',
    'checkout.age.desc': 'Bitte lade eine gültige ID oder einen Reisepass hoch, um zu bestätigen, dass du über 18 Jahre alt bist',
    'checkout.age.upload': 'Klicken um ID hochzuladen',
    'checkout.age.continue': 'Mit Versand fortfahren',
    'checkout.age.disclaimer': 'Deine ID wird sicher verschlüsselt und nur zur Verifizierung verwendet.',
    'checkout.age.swissid_btn': 'Mit SwissID bestätigen',
    'checkout.age.verifying': 'Identität wird geprüft...',
    'checkout.age.success': 'Alter erfolgreich bestätigt',
    'checkout.shipping.title': 'Versandadresse',
    'checkout.form.first_name': 'Vorname',
    'checkout.form.last_name': 'Nachname',
    'checkout.form.address': 'Adresse',
    'checkout.form.city': 'Stadt',
    'checkout.form.zip': 'PLZ',
    'checkout.form.next': 'Weiter zur Zahlung',
    'checkout.payment.subtitle': 'Zahlungsmethode',
    'checkout.payment.title': 'Bestätigung & Zahlung',
    'checkout.payment.card': 'Kreditkarte',
    'checkout.payment.twint': 'TWINT',
    'checkout.payment.invoice': 'Rechnung',
    'checkout.payment.invoiceNotice': 'Zahlung innerhalb von 30 Tagen nach Erhalt',
    'checkout.payment.notice': 'Wir überprüfen alle IDs und Bestellungen manuell. Die Bearbeitung dauert normalerweise 1-2 Werktage. Die Rechnung wird per E-Mail zusammen mit deiner Versandbestätigung gesendet, sobald sie genehmigt wurde.',
    'checkout.payment.noticeBold': 'Bitte beachten Sie:',
    'checkout.payment.acceptFirst': 'Ich bestätige, dass die hochgeladene ID gültig ist und mir gehört. Ich akzeptiere die ',
    'checkout.payment.acceptSecond': 'AGBs',
    'checkout.payment.acceptThird': ' und stimme zu, die Rechnung zu bezahlen.',
    'checkout.payment.pay': 'Jetzt bezahlen',
    'checkout.payment.processing': 'Verarbeitung...',
    'checkout.success.title': 'Bestellung bestätigt!',
    'checkout.success.desc': 'Danke für deine Bestellung. Dein Arschwasser ist auf dem Weg.',
    'checkout.success.home': 'Zurück zur Startseite'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};