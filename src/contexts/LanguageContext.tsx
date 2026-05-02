import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type Lang = "en" | "fr" | "ar";

type Dict = Record<string, { en: string; fr: string; ar: string }>;

// All site-wide translatable strings. The EN/AR welcome heading on the
// home page is intentionally NOT included here — it must stay untouched.
export const translations: Dict = {
  "welcome.tagline": {
    en: "UBMA · Guichet Numérique Universitaire",
    fr: "UBMA · Guichet Numérique Universitaire",
    ar: "UBMA · الشباك الرقمي الجامعي",
  },
  "welcome.subtitle": {
    en: "Your secure, single sign-on portal for academic documents, verifiable Open Badges and a Digital Vault — signed with PAdES and verifiable by anyone, anywhere.",
    fr: "Votre portail sécurisé d'authentification unique pour les documents académiques, les Open Badges vérifiables et un Coffre Numérique — signés avec PAdES et vérifiables partout.",
    ar: "بوابتك الآمنة بتسجيل دخول موحّد للوثائق الأكاديمية وشارات Open Badges القابلة للتحقق والخزنة الرقمية — موقّعة بمعيار PAdES وقابلة للتحقق في أي مكان.",
  },
  "welcome.cta.enter": {
    en: "Enter your space",
    fr: "Accéder à votre espace",
    ar: "ادخل إلى فضائك",
  },
  "welcome.cta.about": {
    en: "About UBMA",
    fr: "À propos de l'UBMA",
    ar: "حول جامعة باجي مختار",
  },
  "lang.label": {
    en: "Language",
    fr: "Langue",
    ar: "اللغة",
  },
};

// ---- Site-wide additional strings ----
Object.assign(translations, {
  // Common
  "common.help":              { en: "Help",            fr: "Aide",              ar: "مساعدة" },
  "common.notifications":     { en: "Notifications",   fr: "Notifications",     ar: "الإشعارات" },
  "common.profile":           { en: "Profile",         fr: "Profil",            ar: "الملف الشخصي" },
  "common.settings":          { en: "Settings",        fr: "Paramètres",        ar: "الإعدادات" },
  "common.messages":          { en: "Messages",        fr: "Messages",          ar: "الرسائل" },
  "common.return":            { en: "← Return",        fr: "← Retour",          ar: "← رجوع" },
  "common.back_home":         { en: "← Back to home",  fr: "← Retour à l'accueil", ar: "← العودة إلى الرئيسية" },
  "common.under_construction":{ en: "This page is under construction.", fr: "Cette page est en cours de construction.", ar: "هذه الصفحة قيد الإنشاء." },
  "common.logout":            { en: "Logout",          fr: "Déconnexion",       ar: "تسجيل الخروج" },
  "common.view_all":          { en: "View all →",      fr: "Tout voir →",       ar: "عرض الكل →" },

  // Sidebar
  "sidebar.dashboard_sections":{ en: "Dashboard sections", fr: "Sections du tableau de bord", ar: "أقسام لوحة التحكم" },
  "sidebar.teacher_dashboard":{ en: "Teacher dashboard", fr: "Tableau de bord enseignant", ar: "لوحة الأستاذ" },
  "sidebar.eservices":        { en: "E-services",      fr: "E-services",        ar: "الخدمات الإلكترونية" },
  "sidebar.openbadges":       { en: "Open Badges",     fr: "Open Badges",       ar: "الشارات المفتوحة" },
  "sidebar.demarches":        { en: "My requests",     fr: "Mes démarches",     ar: "طلباتي" },
  "sidebar.timeline":         { en: "Request timeline", fr: "Frise du dossier", ar: "تتبع الملف" },
  "sidebar.vault":            { en: "Digital Vault",   fr: "Coffre-fort",       ar: "الخزنة الرقمية" },
  "sidebar.requests":         { en: "Request Management", fr: "Gestion des demandes", ar: "إدارة الطلبات" },
  "sidebar.grades":           { en: "Grades Management", fr: "Gestion des notes", ar: "إدارة الدرجات" },
  "sidebar.monitoring":       { en: "Student Monitoring", fr: "Suivi des étudiants", ar: "متابعة الطلبة" },
  "sidebar.documents":        { en: "Document Validation", fr: "Validation des documents", ar: "التحقق من الوثائق" },
  "sidebar.courses":          { en: "Course & Activity", fr: "Cours et activités", ar: "الدروس والأنشطة" },
  "sidebar.messaging":        { en: "Messaging",       fr: "Messagerie",        ar: "المراسلة" },

  // Login
  "login.brand_title":        { en: "Log in to your university space", fr: "Connectez-vous à votre espace universitaire", ar: "سجّل الدخول إلى فضائك الجامعي" },
  "login.brand_desc":         { en: "Access your documents, Open Badges, and Digital Vault — securely signed and verifiable anywhere.", fr: "Accédez à vos documents, Open Badges et Coffre Numérique — signés en toute sécurité et vérifiables partout.", ar: "ادخل إلى وثائقك وشاراتك المفتوحة وخزنتك الرقمية — موقّعة بأمان وقابلة للتحقق في أي مكان." },
  "login.feature_pades":      { en: "PAdES-LTV signed documents", fr: "Documents signés PAdES-LTV", ar: "وثائق موقّعة بـ PAdES-LTV" },
  "login.feature_ob":         { en: "OpenBadges 3.0 credentials", fr: "Certifications OpenBadges 3.0", ar: "شهادات OpenBadges 3.0" },
  "login.feature_vault":      { en: "QR-verifiable vault", fr: "Coffre-fort vérifiable par QR", ar: "خزنة قابلة للتحقق عبر QR" },
  "login.title":              { en: "Welcome back", fr: "Bon retour", ar: "مرحبًا بعودتك" },
  "login.subtitle":           { en: "Enter your credentials to continue.", fr: "Entrez vos identifiants pour continuer.", ar: "أدخل بياناتك للمتابعة." },
  "login.id":                 { en: "Enter your ID", fr: "Entrez votre identifiant", ar: "أدخل معرّفك" },
  "login.password":           { en: "Password", fr: "Mot de passe", ar: "كلمة المرور" },
  "login.forgot":             { en: "Forgot?", fr: "Oublié ?", ar: "نسيت؟" },
  "login.show":               { en: "Show", fr: "Afficher", ar: "إظهار" },
  "login.hide":               { en: "Hide", fr: "Masquer", ar: "إخفاء" },
  "login.remember":           { en: "Remember me on this device", fr: "Se souvenir de moi sur cet appareil", ar: "تذكّرني على هذا الجهاز" },
  "login.submit":             { en: "Log in", fr: "Se connecter", ar: "دخول" },
  "login.welcome_student":    { en: "Welcome to Student Space", fr: "Bienvenue dans l'espace étudiant", ar: "مرحبًا بك في فضاء الطالب" },
  "login.welcome_teacher":    { en: "Welcome to Teacher Space", fr: "Bienvenue dans l'espace enseignant", ar: "مرحبًا بك في فضاء الأستاذ" },
  "login.brand_mobile":       { en: "UBMA Student Space", fr: "Espace étudiant UBMA", ar: "فضاء طالب جامعة باجي مختار" },

  // Student / Teacher space — top nav & hero
  "ts.brand_line2":           { en: "Badji Mokhtar University · Annaba", fr: "Université Badji Mokhtar · Annaba", ar: "جامعة باجي مختار · عنابة" },
  "ts.brand_student_sub":     { en: "UBMA", fr: "UBMA", ar: "UBMA" },
  "ts.brand_teacher_sub":     { en: "UBMA · Teacher Dashboard", fr: "UBMA · Tableau enseignant", ar: "UBMA · لوحة الأستاذ" },
  "ts.mobile_student":        { en: "GNU · Student Space", fr: "GNU · Espace étudiant", ar: "GNU · فضاء الطالب" },
  "ts.mobile_teacher":        { en: "GNU · Teacher Space", fr: "GNU · Espace enseignant", ar: "GNU · فضاء الأستاذ" },

  // Student hero & sections
  "student.badge_year":       { en: "Student Space · Academic Year 2024–2025", fr: "Espace étudiant · Année universitaire 2024–2025", ar: "فضاء الطالب · السنة الجامعية 2024–2025" },
  "student.hero_title":       { en: "Your academic documents, reimagined.", fr: "Vos documents universitaires, réinventés.", ar: "وثائقك الأكاديمية، بحلّة جديدة." },
  "student.hero_desc":        { en: "Request, manage, and share certified documents, Open Badges, and e-signatures — all in one secure place built for GNU students.", fr: "Demandez, gérez et partagez vos documents certifiés, Open Badges et signatures électroniques — tout en un seul endroit sécurisé pour les étudiants GNU.", ar: "اطلب وأدر وشارك وثائقك المعتمدة، شارات Open Badges والتواقيع الإلكترونية — في مكان واحد آمن للطلبة." },
  "student.cta_request":      { en: "Request a document", fr: "Demander un document", ar: "اطلب وثيقة" },
  "student.cta_view":         { en: "View my documents", fr: "Voir mes documents", ar: "عرض وثائقي" },
  "student.section.eservices":{ en: "E-services", fr: "E-services", ar: "الخدمات الإلكترونية" },
  "student.section.badges":   { en: "Open Badges", fr: "Open Badges", ar: "الشارات المفتوحة" },
  "student.section.demarches":{ en: "My requests", fr: "Mes démarches", ar: "طلباتي" },
  "student.section.timeline": { en: "File timeline", fr: "Frise du dossier", ar: "تتبع الملف" },
  "student.section.vault":    { en: "My document vault", fr: "Mon coffre-fort documentaire", ar: "خزنتي الرقمية للوثائق" },
  "student.btn_verify":       { en: "Verify", fr: "Vérifier", ar: "تحقّق" },
  "student.btn_share":        { en: "Share", fr: "Partager", ar: "مشاركة" },
  "student.footer":           { en: "© 2025 GNU — All documents are PAdES-LTV signed and legally valid.", fr: "© 2025 GNU — Tous les documents sont signés PAdES-LTV et juridiquement valides.", ar: "© 2025 GNU — جميع الوثائق موقّعة بـ PAdES-LTV وذات قيمة قانونية." },

  // Teacher hero & sections
  "teacher.badge_year":       { en: "Teacher Space · Academic Year 2024–2025", fr: "Espace enseignant · Année universitaire 2024–2025", ar: "فضاء الأستاذ · السنة الجامعية 2024–2025" },
  "teacher.hero_title":       { en: "Welcome back, Dr. Boudraa.", fr: "Bon retour, Dr. Boudraa.", ar: "مرحبًا بعودتك، د. بوضراع." },
  "teacher.hero_desc":        { en: "Review student requests, manage grades, validate documents and stay in touch with your classes — all from one dashboard.", fr: "Examinez les demandes des étudiants, gérez les notes, validez les documents et restez en contact avec vos classes — depuis un seul tableau de bord.", ar: "راجع طلبات الطلبة، أدر الدرجات، صادق على الوثائق وابقَ على تواصل مع أقسامك — من لوحة تحكم واحدة." },
  "teacher.section.requests":  { en: "Requests",   fr: "Demandes",   ar: "الطلبات" },
  "teacher.section.grades":    { en: "Grades",     fr: "Notes",      ar: "الدرجات" },
  "teacher.section.monitoring":{ en: "Monitoring", fr: "Suivi",      ar: "المتابعة" },
  "teacher.section.documents": { en: "Documents",  fr: "Documents",  ar: "الوثائق" },
  "teacher.section.timeline":  { en: "Timeline",   fr: "Frise",      ar: "التتبع" },
  "teacher.section.courses":   { en: "Courses",    fr: "Cours",      ar: "الدروس" },
  "teacher.section.badges":    { en: "Badges & Recognition", fr: "Badges & Reconnaissance", ar: "الشارات والتقدير" },
  "teacher.stat.pending":      { en: "Pending requests", fr: "Demandes en attente", ar: "طلبات قيد المعالجة" },
  "teacher.stat.active":       { en: "Active students", fr: "Étudiants actifs", ar: "طلبة نشطون" },
  "teacher.stat.docs":         { en: "Docs to validate", fr: "Documents à valider", ar: "وثائق للمصادقة" },
  "teacher.stat.deadlines":    { en: "Upcoming deadlines", fr: "Échéances à venir", ar: "آجال قادمة" },

  // Stubs
  "messages.subtitle":         { en: "Quick chat with your students.", fr: "Discussion rapide avec vos étudiants.", ar: "محادثة سريعة مع طلبتك." },
});
