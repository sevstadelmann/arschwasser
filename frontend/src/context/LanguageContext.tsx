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
    'hero.order': 'Order 12-Pack',
    'hero.contact': 'Contact Us',
    'hero.sugar_free': 'Sugar Free',
    'hero.vegan': 'Vegan',
    
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
    'cart.item_name': 'Lemon Drop 12-Pack',

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
    'contact.submit': 'Send Message'
  },
  de: {
    'nav.product': 'The Drop',
    'nav.ingredients': 'Inhaltsstoffe',
    'nav.vibe': 'Vibe',
    'nav.basket': 'Warenkorb',
    'nav.view_basket': 'Warenkorb ansehen',
    
    'hero.desc': 'Natürliches Mineralwasser. Echte Zitrone. 4,7% Vol.',
    'hero.no_bs': 'Keine künstlichen Inhaltsstoffe.',
    'hero.order': '12er-Pack bestellen',
    'hero.contact': 'Kontaktiere uns',
    'hero.sugar_free': 'Zuckerfrei',
    'hero.vegan': 'Vegan',
    
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
    'vibe.cta': 'Probiere jetzt',
    
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
    'cart.item_name': 'Lemon Drop 12er-Pack',

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
    'contact.submit': 'Absenden'
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