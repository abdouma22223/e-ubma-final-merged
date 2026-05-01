import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "fr" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    "nav.home": "الرئيسية",
    "nav.vault": "الخزنة الرقمية",
    "nav.badges": "الأوسمة الرقمية",
    "nav.requests": "الطلبات الإلكترونية",
    "nav.profile": "الملف الشخصي",
    "nav.settings": "الإعدادات",
    "login.title": "تسجيل الدخول",
    "login.brand_title": "بوابة جامعة باجي مختار الرقمية",
    "login.brand_desc": "الوصول الموحد إلى الخدمات الأكاديمية، الخزنة الرقمية المصلحة، والأوسمة التعليمية المفتوحة.",
    "login.subtitle": "الرجاء إدخال بيانات الاعتماد الخاصة بك للوصول إلى فضائك.",
    "login.id": "رقم التسجيل / البريد الإلكتروني",
    "login.password": "كلمة المرور",
    "login.submit": "دخول",
    "login.welcome_student": "مرحباً بك في فضاء الطالب",
    "login.welcome_teacher": "مرحباً بك في فضاء الأستاذ",
    "common.back_home": "العودة للرئيسية",
    "common.logout": "تسجيل الخروج",
    "welcome.hero_title": "مستقبلك الجامعي، رقمي وآمن",
    "welcome.hero_subtitle": "المنصة الرسمية لجامعة باجي مختار - عنابة للخدمات الإلكترونية المتطورة.",
    "welcome.get_started": "ابدأ الآن",
    "welcome.explore": "استكشف الخدمات",
  },
  fr: {
    "nav.home": "Accueil",
    "nav.vault": "Coffre-fort",
    "nav.badges": "Open Badges",
    "nav.requests": "E-Services",
    "nav.profile": "Profil",
    "nav.settings": "Paramètres",
    "login.title": "Connexion",
    "login.brand_title": "Portail Numérique UBMA",
    "login.brand_desc": "Accès unifié aux services académiques, coffre-fort numérique sécurisé et badges ouverts.",
    "login.subtitle": "Veuillez saisir vos identifiants pour accéder à votre espace.",
    "login.id": "N° d'inscription / Email",
    "login.password": "Mot de passe",
    "login.submit": "Se connecter",
    "login.welcome_student": "Bienvenue dans l'espace étudiant",
    "login.welcome_teacher": "Bienvenue dans l'espace enseignant",
    "common.back_home": "Retour à l'accueil",
    "common.logout": "Déconnexion",
    "welcome.hero_title": "Votre avenir universitaire, numérique et sécurisé",
    "welcome.hero_subtitle": "La plateforme officielle de l'Université Badji Mokhtar - Annaba pour les services électroniques avancés.",
    "welcome.get_started": "Commencer",
    "welcome.explore": "Explorer les services",
  },
  en: {
    "nav.home": "Home",
    "nav.vault": "Digital Vault",
    "nav.badges": "Open Badges",
    "nav.requests": "E-Services",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "login.title": "Login",
    "login.brand_title": "UBMA Digital Portal",
    "login.brand_desc": "Unified access to academic services, secured digital vault, and open badges.",
    "login.subtitle": "Please enter your credentials to access your space.",
    "login.id": "Registration No / Email",
    "login.password": "Password",
    "login.submit": "Sign In",
    "login.welcome_student": "Welcome to Student Space",
    "login.welcome_teacher": "Welcome to Teacher Space",
    "common.back_home": "Back to Home",
    "common.logout": "Logout",
    "welcome.hero_title": "Your University Future, Digital and Secure",
    "welcome.hero_subtitle": "The official platform of Badji Mokhtar University - Annaba for advanced electronic services.",
    "welcome.get_started": "Get Started",
    "welcome.explore": "Explore Services",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("ubma_lang") as Language) || "fr";
  });

  useEffect(() => {
    localStorage.setItem("ubma_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
