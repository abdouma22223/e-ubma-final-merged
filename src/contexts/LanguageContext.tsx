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
  "login.remember":           { en: "Remember me on this device", fr: "Se souvenir de moi sur cet appareil", ar: "تذكرني على هذا الجهاز" },
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

// ---- Student space deep content ----
Object.assign(translations, {
  // Top nav links
  "student.nav.dashboard":   { en: "Dashboard",     fr: "Tableau de bord", ar: "لوحة التحكم" },
  "student.nav.eservices":   { en: "E-services",    fr: "E-services",      ar: "الخدمات الإلكترونية" },
  "student.nav.documents":   { en: "My Documents",  fr: "Mes documents",   ar: "وثائقي" },
  "student.nav.openbadges":  { en: "Open Badges",   fr: "Open Badges",     ar: "الشارات المفتوحة" },
  "student.nav.vault":       { en: "Digital Vault", fr: "Coffre numérique", ar: "الخزنة الرقمية" },

  // Hero card
  "student.card.major":      { en: "Computer Science · 2nd Year", fr: "Informatique · 2ᵉ année", ar: "إعلام آلي · السنة الثانية" },
  "student.card.cert":       { en: "School Certificate 2024", fr: "Attestation de scolarité 2024", ar: "شهادة مدرسية 2024" },
  "student.card.badge":      { en: "Data Structures Badge", fr: "Badge Structures de données", ar: "شارة هياكل البيانات" },
  "student.card.transcript": { en: "Transcript 2023–24", fr: "Relevé de notes 2023–24", ar: "كشف النقاط 2023–24" },
  "student.pill.pending":    { en: "Pending",   fr: "En attente", ar: "قيد المعالجة" },
  "student.pill.issued":     { en: "Issued",    fr: "Émis",       ar: "صادر" },
  "student.pill.verified":   { en: "Verified",  fr: "Vérifié",    ar: "موثّق" },

  // Stats
  "student.stat.docs":       { en: "Documents ready",   fr: "Documents prêts",     ar: "وثائق جاهزة" },
  "student.stat.badges":     { en: "Open Badges earned", fr: "Open Badges obtenus", ar: "شارات مكتسبة" },
  "student.stat.vault":      { en: "Vault items",       fr: "Éléments du coffre",  ar: "عناصر الخزنة" },
  "student.stat.pades":      { en: "PAdES signed",      fr: "Signés PAdES",        ar: "موقع بـ PAdES" },

  // E-services cards
  "student.svc.cert.name":   { en: "School Certificate", fr: "Attestation de scolarité", ar: "شهادة مدرسية" },
  "student.svc.cert.desc":   { en: "Digitally signed PDF, ready in under 5 minutes.", fr: "PDF signé numériquement, prêt en moins de 5 minutes.", ar: "ملف PDF موقّع رقميًا، جاهز في أقل من 5 دقائق." },
  "student.svc.transcript.name": { en: "Academic Transcript", fr: "Relevé de notes", ar: "كشف النقاط الأكاديمي" },
  "student.svc.transcript.desc": { en: "Official grades with PAdES-LTV signature.", fr: "Notes officielles avec signature PAdES-LTV.", ar: "نقاط رسمية موقّعة بـ PAdES-LTV." },
  "student.svc.badges.name": { en: "Open Badges", fr: "Open Badges", ar: "الشارات المفتوحة" },
  "student.svc.badges.desc": { en: "Verifiable credentials using OB 3.0 standard.", fr: "Certifications vérifiables au standard OB 3.0.", ar: "شهادات قابلة للتحقق وفق معيار OB 3.0." },
  "student.svc.vault.name":  { en: "Digital Vault", fr: "Coffre numérique", ar: "الخزنة الرقمية" },
  "student.svc.vault.desc":  { en: "Store and share documents with QR verification.", fr: "Stockez et partagez vos documents avec vérification QR.", ar: "احفظ وشارك وثائقك مع التحقق عبر QR." },
  "student.svc.enroll.name": { en: "Enrollment Certificate", fr: "Certificat d'inscription", ar: "شهادة التسجيل" },
  "student.svc.enroll.desc": { en: "Official proof of active student enrollment.", fr: "Preuve officielle d'inscription active.", ar: "إثبات رسمي للتسجيل الفعّال." },
  "student.svc.delivery.name": { en: "Delivery Request", fr: "Demande de livraison", ar: "طلب توصيل" },
  "student.svc.delivery.desc": { en: "Request physical copies sent by post.", fr: "Recevez des copies physiques par la poste.", ar: "اطلب نسخًا ورقية ترسل بالبريد." },

  // Badges table
  "student.badges.col.badge":   { en: "Badge",    fr: "Badge",      ar: "الشارة" },
  "student.badges.col.issuer":  { en: "Issuer",   fr: "Émetteur",   ar: "الجهة المُصدرة" },
  "student.badges.col.date":    { en: "Date",     fr: "Date",       ar: "التاريخ" },
  "student.badges.col.std":     { en: "Standard", fr: "Standard",   ar: "المعيار" },
  "student.badges.col.action":  { en: "Action",   fr: "Action",     ar: "إجراء" },

  // Démarches table
  "student.dem.subtitle":     { en: "Real-time tracking · updated a few seconds ago", fr: "Suivi en temps réel · mis à jour il y a quelques secondes", ar: "تتبّع آني · تم التحديث قبل ثوانٍ" },
  "student.dem.col.ref":      { en: "Reference", fr: "Référence", ar: "المرجع" },
  "student.dem.col.title":    { en: "Request",   fr: "Démarche",  ar: "الطلب" },
  "student.dem.col.step":     { en: "Step",      fr: "Étape",     ar: "المرحلة" },
  "student.dem.col.sla":      { en: "SLA",       fr: "SLA",       ar: "المدة" },
  "student.dem.col.status":   { en: "Status",    fr: "Statut",    ar: "الحالة" },
  "student.dem.status.available": { en: "Available", fr: "Disponible", ar: "متاح" },
  "student.dem.status.inprogress":{ en: "In progress", fr: "En cours",  ar: "قيد المعالجة" },
  "student.dem.status.vault":     { en: "In vault",    fr: "Coffre-fort", ar: "في الخزنة" },
  "student.dem.row1.title":   { en: "Academic leave",        fr: "Congé académique",      ar: "عطلة أكاديمية" },
  "student.dem.row1.step":    { en: "Level-1 review",        fr: "N1 instruit",           ar: "قيد مراجعة المستوى 1" },
  "student.dem.row1.sla":     { en: "D-7",                   fr: "J-7",                    ar: "ي-7" },
  "student.dem.row2.title":   { en: "School certificate",    fr: "Attestation scolarité", ar: "شهادة مدرسية" },
  "student.dem.row2.step":    { en: "Generated",             fr: "Généré",                ar: "تم الإنشاء" },
  "student.dem.row2.sla":     { en: "Ready",                 fr: "Prêt",                  ar: "جاهز" },
  "student.dem.row3.title":   { en: "Transcript S1",         fr: "Relevé de notes S1",    ar: "كشف نقاط السداسي 1" },
  "student.dem.row3.step":    { en: "Archived",              fr: "Archivé",               ar: "مؤرشف" },
  "student.dem.row3.sla":     { en: "OK",                    fr: "OK",                    ar: "تم" },
  "student.dem.row4.title":   { en: "Internship request",    fr: "Demande de stage",      ar: "طلب تربص" },
  "student.dem.row4.step":    { en: "Level-2 validation",    fr: "N2 validation",          ar: "تصديق المستوى 2" },
  "student.dem.row4.sla":     { en: "D-3",                   fr: "J-3",                    ar: "ي-3" },

  // Timeline
  "student.tl.subtitle":      { en: "Academic leave · step tracking", fr: "Congé académique · suivi des étapes", ar: "عطلة أكاديمية · تتبع المراحل" },
  "student.tl.inprogress":    { en: "In progress", fr: "En cours", ar: "قيد المعالجة" },
  "student.tl.current_step":  { en: "Current step", fr: "Étape actuelle", ar: "المرحلة الحالية" },
  "student.tl.processing":    { en: "Being processed by Level-1 service", fr: "Traitement en cours par le service N1", ar: "قيد المعالجة من قبل المستوى 1" },
  "student.tl.s1.title":      { en: "Submission",      fr: "Soumission",      ar: "الإيداع" },
  "student.tl.s1.date":       { en: "April 12, 2025 · 09:14", fr: "12 avril 2025 · 09:14", ar: "12 أفريل 2025 · 09:14" },
  "student.tl.s1.desc":       { en: "Request submitted by the student via the GNU portal.", fr: "Demande déposée par l'étudiant via le portail GNU.", ar: "تم تقديم الطلب من قبل الطالب عبر بوابة GNU." },
  "student.tl.s2.title":      { en: "Received by department", fr: "Réception par le département", ar: "الاستلام من القسم" },
  "student.tl.s2.date":       { en: "April 13, 2025 · 10:02", fr: "13 avril 2025 · 10:02", ar: "13 أفريل 2025 · 10:02" },
  "student.tl.s2.desc":       { en: "File received and assigned to the registrar's office.", fr: "Dossier réceptionné et assigné au service de scolarité.", ar: "تم استلام الملف وإحالته لمصلحة التمدرس." },
  "student.tl.s3.title":      { en: "Review in progress", fr: "Instruction en cours", ar: "قيد المعالجة" },
  "student.tl.s3.date":       { en: "Today", fr: "Aujourd'hui", ar: "اليوم" },
  "student.tl.s3.desc":       { en: "Administrative check by the Level-1 officer.", fr: "Vérification administrative par le responsable N1.", ar: "تحقق إداري من قبل مسؤول المستوى 1." },
  "student.tl.s4.title":      { en: "Final decision", fr: "Décision finale", ar: "القرار النهائي" },
  "student.tl.s4.date":       { en: "Pending", fr: "En attente", ar: "قيد الانتظار" },
  "student.tl.s4.desc":       { en: "Validation by the Faculty Dean.", fr: "Validation par le Doyen de la faculté.", ar: "مصادقة من قبل عميد الكلية." },

  // Vault
  "student.vault.subtitle":   { en: "Officially signed documents · encrypted storage", fr: "Documents officiels signés · stockage chiffré", ar: "وثائق رسمية موقّعة · تخزين مشفّر" },
  "student.vault.download":   { en: "Download all →", fr: "Tout télécharger →", ar: "تنزيل الكل →" },
  "student.vault.share":      { en: "Share", fr: "Partager", ar: "مشاركة" },
  "student.vault.syncing":    { en: "Synchronizing…", fr: "Synchronisation en cours…", ar: "جاري المزامنة…" },
  "student.vault.v1.name":    { en: "School certificate 2025-26", fr: "Attestation de scolarité 2025-26", ar: "شهادة مدرسية 2025-26" },
  "student.vault.v1.date":    { en: "April 28, 2025", fr: "28 avril 2025", ar: "28 أفريل 2025" },
  "student.vault.v1.source":  { en: "Registrar's Office", fr: "Service Scolarité", ar: "مصلحة التمدرس" },
  "student.vault.v2.name":    { en: "Final-year project assignment – Dr. Khelili", fr: "Désignation PFE – Dr. Khelili", ar: "تعيين مشروع التخرج – د. خليلي" },
  "student.vault.v2.date":    { en: "March 15, 2025", fr: "15 mars 2025", ar: "15 مارس 2025" },
  "student.vault.v2.source":  { en: "Faculty of Informatics", fr: "Faculté d'Informatique", ar: "كلية الإعلام الآلي" },
  "student.vault.v3.name":    { en: "CEIL English B2 certificate", fr: "Attestation CEIL Anglais B2", ar: "شهادة CEIL إنجليزية B2" },
  "student.vault.v3.date":    { en: "February 10, 2025", fr: "10 février 2025", ar: "10 فيفري 2025" },
  "student.vault.v3.source":  { en: "CEIL Center", fr: "Centre CEIL", ar: "مركز CEIL" },

  // Section header link variants
  "common.verify_all":        { en: "Verify all →", fr: "Tout vérifier →", ar: "تحقّق من الكل →" },

  // Offline page
  "offline.title":    { en: "Offline mode",       fr: "Mode hors ligne",     ar: "وضع غير متّصل" },
  "offline.subtitle": { en: "You are offline",    fr: "Vous êtes hors ligne", ar: "أنت غير متصل بالإنترنت" },
  "offline.notice":   { en: "No internet connection. You can still view your profile and the documents cached in your Digital Vault.", fr: "Aucune connexion Internet. Vous pouvez consulter votre profil et les documents enregistrés dans votre Coffre-fort.", ar: "لا يوجد اتصال بالإنترنت. يمكنك مراجعة ملفك الشخصي والوثائق المحفوظة في الخزنة الرقمية." },
  "offline.cached":   { en: "Available offline",  fr: "Disponibles hors ligne", ar: "متاحة دون اتصال" },
  
  // Admin space
  "admin.nav.overview":       { en: "Overview",        fr: "Aperçu",           ar: "نظرة عامة" },
  "admin.nav.users":          { en: "Users",           fr: "Utilisateurs",     ar: "المستخدمين" },
  "admin.nav.requests":       { en: "Requests",        fr: "Demandes",         ar: "الطلبات" },
  "admin.nav.faculties":      { en: "Faculties",       fr: "Facultés",         ar: "الكليات" },
  "admin.nav.roles":          { en: "Roles",           fr: "Rôles",            ar: "الأدوار" },
  "admin.nav.vault":          { en: "Personal Vault",  fr: "Coffre Personnel", ar: "الخزنة الشخصية" },
  "admin.nav.documents":      { en: "Documents",       fr: "Documents",        ar: "الوثائق" },
  "admin.nav.activity":       { en: "Activity",        fr: "Activité",         ar: "النشاط" },
  "admin.title":              { en: "Platform control center.", fr: "Centre de contrôle de la plateforme.", ar: "مركز التحكم في المنصة." },
  "admin.subtitle":           { en: "Manage users, requests, faculties, documents and monitor everything happening across the university digital portal — all from a single console.", fr: "Gérez les utilisateurs, les demandes, les facultés, les documents et surveillez tout ce qui se passe sur le portail numérique de l'université.", ar: "أدر المستخدمين، الطلبات، الكليات، الوثائق وراقب كل ما يحدث عبر البوابة الرقمية للجامعة — كل ذلك من لوحة تحكم واحدة." },
  "admin.messaging_title":    { en: "Messaging center.", fr: "Centre de messagerie.", ar: "مركز المراسلة." },
  "admin.messaging_subtitle": { en: "Communicate directly with teachers across the university.", fr: "Communiquez directement avec les enseignants de l'université.", ar: "تواصل مباشرة مع الأساتذة عبر الجامعة." },
});

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof translations) => string;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "ubma.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    return saved === "en" || saved === "fr" || saved === "ar" ? saved : "en";
  });

  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const setLang = (l: Lang) => setLangState(l);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      dir,
      t: (key) => translations[key]?.[lang] ?? translations[key]?.en ?? String(key),
    }),
    [lang, dir],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
