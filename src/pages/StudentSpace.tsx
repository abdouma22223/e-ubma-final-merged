
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList, BarChart3, Award, ShieldCheck, PenSquare, Mailbox,
  Binary, Globe, Bot, Lock, FileText, GraduationCap, User, Trash2, QrCode, X, Share2, DownloadCloud
} from "lucide-react";
import { Chatbot } from "@/components/Chatbot";
import { UBMA_LOGO as ubmaLogo } from "@/assets/images";
import avatarStudent from "@/assets/avatar-student.png";
import avatarTeacher from "@/assets/avatar-teacher.png";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StudentMessaging } from "@/components/student/StudentMessaging";
import { NewRequestDialog } from "@/components/student/NewRequestDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { toast } from "sonner";
import { supabase } from "../supabaseClient";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

type SpaceMode = "student" | "teacher";

export default function StudentSpaceRoute({ mode = "student" }: { mode?: SpaceMode } = {}) {
  const { t } = useLanguage();
  const label = mode === "teacher" ? t("ts.mobile_teacher" as any).replace("GNU · ", "") : t("ts.mobile_student" as any).replace("GNU · ", "");
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-50 flex h-12 items-center gap-2 border-b border-surface-3 bg-white/85 px-3 backdrop-blur-md md:hidden">
            <SidebarTrigger aria-label="Toggle navigation" />
            <span className="font-display text-sm font-bold text-ink">GNU · {label}</span>
          </header>
          <Index spaceLabel={label} mode={mode} />
        </div>
      </div>
    </SidebarProvider>
  );
}

const navLinks = [
  "student.nav.dashboard",
  "student.nav.eservices",
  "student.nav.documents",
  "student.nav.openbadges",
  "student.nav.vault",
];

const stats = [
  { num: "3",   key: "student.stat.docs" },
  { num: "7",   key: "student.stat.badges" },
  { num: "12",  key: "student.stat.vault" },
  { num: "100%", key: "student.stat.pades" },
];

type LucideIcon = typeof ClipboardList;

const services: { Icon: LucideIcon; nameKey: string; descKey: string }[] = [
  { Icon: ClipboardList, nameKey: "student.svc.cert.name",       descKey: "student.svc.cert.desc" },
  { Icon: BarChart3,     nameKey: "student.svc.transcript.name", descKey: "student.svc.transcript.desc" },
  { Icon: Award,         nameKey: "student.svc.badges.name",     descKey: "student.svc.badges.desc" },
  { Icon: ShieldCheck,   nameKey: "student.svc.vault.name",      descKey: "student.svc.vault.desc" },
  { Icon: PenSquare,     nameKey: "student.svc.enroll.name",     descKey: "student.svc.enroll.desc" },
  { Icon: Mailbox,       nameKey: "student.svc.delivery.name",   descKey: "student.svc.delivery.desc" },
];

const badges: { Icon: LucideIcon; title: string; sub: string; date: string; desc: string; criteria: string[]; issuer: string }[] = [
  {
    Icon: Binary,
    title: "Data Structures",
    sub: "Faculty of Informatics",
    date: "Issued Mar 2025",
    desc: "Mastery of arrays, linked lists, trees, graphs and algorithmic complexity.",
    criteria: ["Final exam ≥ 80%", "5 lab projects completed", "Peer-reviewed code"],
    issuer: "Prof. K. Boudraa",
  },
  {
    Icon: Globe,
    title: "Web Development",
    sub: "Faculty of Informatics",
    date: "Issued Jan 2025",
    desc: "Modern full-stack web engineering with React, TypeScript and REST APIs.",
    criteria: ["Capstone project shipped", "Accessibility audit passed", "Git workflow demonstrated"],
    issuer: "Dr. L. Hammoudi",
  },
  {
    Icon: Bot,
    title: "Machine Learning",
    sub: "GNU AI Lab",
    date: "Issued Nov 2024",
    desc: "Supervised & unsupervised learning, model evaluation, and ethical AI practices.",
    criteria: ["Kaggle-style challenge top 25%", "Research note submitted", "Reproducible notebook"],
    issuer: "Prof. S. Benali",
  },
  {
    Icon: Lock,
    title: "Cybersecurity",
    sub: "GNU Security Center",
    date: "Issued Sep 2024",
    desc: "Threat modeling, cryptography fundamentals, and secure-by-design engineering.",
    criteria: ["CTF participation", "Vulnerability report filed", "Secure code review"],
    issuer: "Dr. R. Cherif",
  },
];

type Demarche = {
  ref: string;
  titleKey: string;
  stepKey: string;
  slaKey: string;
  status: "disponible" | "encours" | "coffre";
};

const demarches: Demarche[] = [
  { ref: "#GNU-421", titleKey: "student.dem.row1.title", stepKey: "student.dem.row1.step", slaKey: "student.dem.row1.sla", status: "encours" },
  { ref: "#GNU-398", titleKey: "student.dem.row2.title", stepKey: "student.dem.row2.step", slaKey: "student.dem.row2.sla", status: "disponible" },
  { ref: "#GNU-356", titleKey: "student.dem.row3.title", stepKey: "student.dem.row3.step", slaKey: "student.dem.row3.sla", status: "coffre" },
  { ref: "#GNU-342", titleKey: "student.dem.row4.title", stepKey: "student.dem.row4.step", slaKey: "student.dem.row4.sla", status: "encours" },
];

const timeline = [
  { titleKey: "student.tl.s1.title", dateKey: "student.tl.s1.date", descKey: "student.tl.s1.desc", state: "done" as const },
  { titleKey: "student.tl.s2.title", dateKey: "student.tl.s2.date", descKey: "student.tl.s2.desc", state: "done" as const },
  { titleKey: "student.tl.s3.title", dateKey: "student.tl.s3.date", descKey: "student.tl.s3.desc", state: "active" as const },
  { titleKey: "student.tl.s4.title", dateKey: "student.tl.s4.date", descKey: "student.tl.s4.desc", state: "pending" as const },
];

const vault: { Icon: LucideIcon; nameKey: string; dateKey: string; sourceKey: string; signature: string }[] = [
  { Icon: FileText,      nameKey: "student.vault.v1.name", dateKey: "student.vault.v1.date", sourceKey: "student.vault.v1.source", signature: "PAdES-LTV" },
  { Icon: GraduationCap, nameKey: "student.vault.v2.name", dateKey: "student.vault.v2.date", sourceKey: "student.vault.v2.source", signature: "PAdES" },
  { Icon: Globe,         nameKey: "student.vault.v3.name", dateKey: "student.vault.v3.date", sourceKey: "student.vault.v3.source", signature: "PAdES-LTV" },
];

// Reusable status pill — used by both the hero quick-list and the démarches table.
type PillTone = "success" | "warning" | "info" | "danger";

const TONE_CLASSES: Record<PillTone, string> = {
  success: "border-success/40 bg-success-light text-success",
  warning: "border-warning/40 bg-warning-light text-warning",
  info: "border-info/30 bg-info-light text-info",
  danger: "border-danger/30 bg-danger-light text-danger",
};
const DOT_CLASSES: Record<PillTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  danger: "bg-danger",
};

function StatusPill({
  tone,
  label,
  showDot = true,
  animatedDots = false,
}: {
  tone: PillTone;
  label: string;
  showDot?: boolean;
  animatedDots?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${TONE_CLASSES[tone]}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[tone]}`} />}
      {label}
      {animatedDots && (
        <span aria-hidden className="dot-anim inline-flex w-3 justify-between">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      )}
    </span>
  );
}

function Index({ spaceLabel = "Student Space", mode = "student" }: { spaceLabel?: string; mode?: SpaceMode }) {
  const { t, dir } = useLanguage();
  const { toggleSidebar } = useSidebar();
  const [showMessaging, setShowMessaging] = useState(false);
  const [newReqOpen, setNewReqOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [reqInitialData, setReqInitialData] = useState<any>(null);

  const userId = localStorage.getItem("user_id") || "anonymous";
  const userName = localStorage.getItem("user_name") || "Étudiant";
  const userMajor = localStorage.getItem("user_major") || "";
  const userInitials = userName.slice(0, 2).toUpperCase();
  const [userDocs, setUserDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [qrDoc, setQrDoc] = useState<any>(null); // State for QR modal
  const [botInitialData, setBotInitialData] = useState<any>(null);
  const [earnedBadges, setEarnedBadges] = useState<any[]>([]);

  // Section IDs that match nav links
  const NAV_SECTION_MAP: Record<string, string> = {
    "student.nav.dashboard":  "hero",
    "student.nav.eservices":  "services",
    "student.nav.documents":  "demarches",
    "student.nav.openbadges": "badges",
    "student.nav.vault":      "vault",
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  const fetchDocs = async () => {
    setLoadingDocs(true);
    // Fetch documents that are either owned by the user OR are official (in prof bucket)
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("status", "validated")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch documents");
    } else {
      // Filter in-memory to ensure privacy while allowing official docs
      const filtered = (data || []).filter(d => 
        String(d.owner_id) === String(userId) || 
        (d.storage_path && d.storage_path.includes("supabase://prof/"))
      );
      setUserDocs(filtered);
    }
    setLoadingDocs(false);
  };

  const fetchBadges = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/badges?student_id=${userId}`);
      setEarnedBadges(res.data);
    } catch (e) {
      console.error("Failed to fetch badges");
    }
  };

  useEffect(() => {
    fetchDocs();
    fetchBadges();
  }, []);

  const handleDownload = async (docId: string, filename: string, storagePath: string) => {
    try {
      toast.info("Downloading and decrypting...");
      
      const { data: encryptedBlob, error } = await supabase.storage.from("vault").download(storagePath);
      if (error) throw error;

      const formData = new FormData();
      formData.append("file", encryptedBlob, "file.enc");
      const decryptRes = await axios.post(`${BACKEND_URL}/api/crypto/decrypt`, formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(decryptRes.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Document decrypted and downloaded!");
    } catch (err) {
      toast.error("Error downloading document");
    }
  };

  const [expiry, setExpiry] = useState<Record<string, number>>({});

  // ── Document Upload ──────────────────────────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      toast.info(t("student.vault.uploading" as any) || "Encrypting & uploading…");

      // Step 1: Encrypt via backend
      const encForm = new FormData();
      encForm.append("file", file);
      const encRes = await axios.post(`${BACKEND_URL}/api/crypto/encrypt`, encForm, {
        responseType: "blob",
      });
      const encryptedBlob = encRes.data;

      // Step 2: Upload encrypted file to Supabase Storage
      const storagePath = `${userId}/${Date.now()}_${file.name}.enc`;
      const { error: storageError } = await supabase.storage
        .from("vault")
        .upload(storagePath, encryptedBlob, { contentType: "application/octet-stream" });

      if (storageError) throw storageError;

      // Step 3: Insert document record as 'pending' for Admin review
      const { error: dbError } = await supabase.from("documents").insert({
        owner_id: userId,
        filename: file.name,
        name: file.name,
        storage_path: storagePath,
        status: "pending",
      });

      if (dbError) throw dbError;

      toast.success(t("student.vault.upload_success" as any) || "Document submitted for Admin review!");
      fetchDocs();
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err?.message || "Upload failed. Make sure the backend is running.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleShare = async (docId: string) => {
    try {
      const hours = expiry[docId] || 24;
      const res = await axios.get(`${BACKEND_URL}/api/documents/share/${docId}?expires_in=${hours}`);
      
      navigator.clipboard.writeText(res.data.temporary_link);
      toast.success(`Secure sharing link copied to clipboard! (Valid for ${hours}h)`);
    } catch (err) {
      toast.error("Error generating share link via backend");
    }
  };

  const handleLinkedInShare = (filename: string, storagePath: string) => {
    const certUrl = `https://e-ubma.dz/verify/${storagePath}`;
    const url = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(filename)}&organizationName=Badji+Mokhtar+University+-+E-UBMA+Portal&issueYear=2026&issueMonth=5&certUrl=${encodeURIComponent(certUrl)}`;
    window.open(url, "_blank");
  };

  const handleShowQR = (doc: any) => {
    setQrDoc(doc);
  };

  const handleDelete = async (docId: string, storagePath: string) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      toast.info("Deleting...");
      // 1. Delete from storage
      const { error: storageError } = await supabase.storage.from("vault").remove([storagePath]);
      if (storageError) throw storageError;

      // 2. Delete from database
      const { error: dbError } = await supabase.from("documents").delete().eq("id", docId);
      if (dbError) throw dbError;

      toast.success("Document deleted successfully");
      fetchDocs();
    } catch (err: any) {
      toast.error("Delete failed: " + err.message);
    }
  };

  useEffect(() => {
    const onNav = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      setShowMessaging(id === "messaging");
    };
    window.addEventListener("space:nav", onNav as EventListener);
    return () => window.removeEventListener("space:nav", onNav as EventListener);
  }, []);

  return (
    <div className="min-h-screen" dir={dir}>
      {/* NAV */}
      <nav className="sticky top-0 z-40 flex h-[80px] items-center gap-8 border-b border-surface-3 bg-white/85 px-8 backdrop-blur-md">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          className="group flex shrink-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <div
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white p-1.5 shadow-[0_6px_16px_-4px_rgba(0,0,0,.25),0_0_0_3px_white,0_0_0_4px_color-mix(in_oklab,var(--ink)_25%,transparent)] ring-1 ring-surface-3 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
          >
            <img
              src={ubmaLogo}
              alt="Université Badji Mokhtar Annaba"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="hidden flex-col leading-tight text-left md:flex">
            <span dir="rtl" className="font-display text-[13px] font-bold text-ink">جامعة باجي مختار - عنابة</span>
            <span className="font-display text-[12px] font-semibold text-ink">{t("ts.brand_line2" as any)}</span>
            <span className="text-[10px] font-semibold tracking-[0.22em] text-ink-3">{t("ts.brand_student_sub" as any)}</span>
          </div>
        </button>
        <div className="hidden flex-1 justify-center gap-1 xl:flex">
          {navLinks.map((l) => {
            const sectionId = NAV_SECTION_MAP[l] || "hero";
            const isActive = activeSection === sectionId;
            return (
              <button
                key={l}
                type="button"
                onClick={() => scrollToSection(sectionId)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  isActive ? "bg-ink text-white" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {t(l as any)}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/help" className="rounded-full border border-surface-3 px-4 py-1.5 text-[13px] font-medium text-ink-2 transition hover:border-ink hover:bg-surface-2">
            {t("common.help" as any)}
          </Link>
          <button
            aria-label={t("common.notifications" as any)}
            className="relative grid h-9 w-9 place-items-center rounded-full border border-surface-3 bg-white text-ink-2 transition hover:border-ink hover:bg-surface-2 hover:text-ink"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-white">
              3
            </span>
            <span className="absolute right-1 top-1 h-2 w-2 animate-ping rounded-full bg-danger/70" />
          </button>
          <Link
            to="/profile"
            aria-label={t("common.profile" as any)}
            className="group/avatar relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-surface-2 text-lg ring-2 ring-transparent transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,.45)] hover:ring-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <User className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header id="hero" className="mx-auto grid max-w-[1200px] items-center gap-12 px-8 py-16 lg:grid-cols-[1fr_360px]">
        <div className="fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-surface-3 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-2">
            <span className="h-2 w-2 rounded-full bg-ink pulse-ring" />
            {t("student.badge_year" as any)}
          </div>
          <h1 className="font-display text-[clamp(2.2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
            {t("student.hero_title" as any)}
          </h1>
          <p className="mt-5 max-w-[480px] text-base leading-relaxed text-ink-2">
            {t("student.hero_desc" as any)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setNewReqOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:opacity-90"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
              {t("student.cta_request" as any)}
            </button>
            <a
              href="#vault"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-surface-3 bg-white px-6 py-3 text-sm font-medium text-ink transition hover:border-ink"
            >
              {t("student.cta_view" as any)}
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>

        {/* hero card */}
        <div className="fade-up delay-200 relative">
          <div className="relative rounded-[20px] border border-surface-3 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,.18)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-ink font-display text-base font-extrabold text-white">
                {userInitials}
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">{userName}</div>
                <div className="text-xs text-ink-3">{userMajor || t("student.card.major" as any)}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { Icon: FileText,    titleKey: "student.card.cert",       labelKey: "student.pill.pending",  tone: "warning" as PillTone, animatedDots: true },
                { Icon: Award,       titleKey: "student.card.badge",      labelKey: "student.pill.issued",   tone: "danger" as PillTone,  animatedDots: false },
                { Icon: ShieldCheck, titleKey: "student.card.transcript", labelKey: "student.pill.verified", tone: "info" as PillTone,    animatedDots: false },
              ].map((d, i) => {
                const Icon = d.Icon;
                return (
                  <div
                    key={d.titleKey}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-surface-3 bg-surface p-3 transition hover:border-ink hover:translate-x-1"
                    style={{ animation: `fadeUp .6s ${0.3 + i * 0.1}s both` }}
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-ink-2"><Icon className="h-4 w-4" aria-hidden /></div>
                    <div className="flex-1 text-[13px] font-medium text-ink">{t(d.titleKey as any)}</div>
                    <StatusPill tone={d.tone} label={t(d.labelKey as any)} showDot={false} animatedDots={d.animatedDots} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="mx-auto mb-12 grid max-w-[1200px] grid-cols-2 gap-4 px-8 fade-up delay-300 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.key}
            className="hover-lift rounded-xl border border-surface-3 bg-white p-5 text-center"
            style={{ animation: `fadeUp .6s ${0.4 + i * 0.08}s both` }}
          >
            <div className="font-display text-3xl font-extrabold tracking-tight text-ink">{s.num}</div>
            <div className="mt-1 text-xs font-medium text-ink-3">{t(s.key as any)}</div>
          </div>
        ))}
      </div>

      {/* E-SERVICES */}
      <section id="services" className="mx-auto max-w-[1200px] px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.eservices" as any)}</h2>
          <a href="#" className="text-[13px] font-medium text-ink hover:underline">{t("common.view_all" as any)}</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = s.Icon;
            return (
              <a
                key={s.nameKey}
                href="#"
                className="hover-lift group flex flex-col gap-3 rounded-xl border border-surface-3 bg-white p-6 fade-up"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-surface-2 text-ink-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="font-semibold text-sm text-ink">{t(s.nameKey as any)}</div>
                <div className="text-[13px] leading-relaxed text-ink-3">{t(s.descKey as any)}</div>
                <div className="mt-auto self-end text-lg text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-ink">→</div>
              </a>
            );
          })}
        </div>
      </section>

      {/* OPEN BADGES */}
      <section id="badges" className="mx-auto max-w-[1200px] px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.badges" as any)}</h2>
          <a href="#" className="text-[13px] font-medium text-ink hover:underline">{t("common.verify_all" as any)}</a>
        </div>
        <div className="overflow-hidden rounded-xl border border-surface-3 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {[
                  "student.badges.col.badge",
                  "student.badges.col.issuer",
                  "student.badges.col.date",
                  "student.badges.col.std",
                  "student.badges.col.action",
                ].map((h) => (
                  <th key={h} className="border-b border-surface-3 bg-surface-2 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                    {t(h as any)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {earnedBadges.map((b, i) => (
                <tr key={b.id} className="transition-colors hover:bg-surface-2 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <td className="border-b border-surface-2 px-5 py-3.5">
                    <div className="flex items-center gap-2.5 font-medium text-ink">
                      <div className="grid h-7 w-7 place-items-center rounded-md bg-surface-2 text-ink-2 text-lg">{b.icon}</div>
                      {b.title}
                    </div>
                  </td>
                  <td className="border-b border-surface-2 px-5 py-3.5 text-[13px] text-ink-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-ink-2">{b.professor}</span>
                      <span className="text-[10px] text-ink-3 opacity-70">University Faculty</span>
                    </div>
                  </td>
                  <td className="border-b border-surface-2 px-5 py-3.5 text-[13px] text-ink-3">{new Date(b.created_at).toLocaleDateString()}</td>
                  <td className="border-b border-surface-2 px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-3 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-2">
                      OB 3.0
                    </span>
                  </td>
                  <td className="border-b border-surface-2 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-surface-3 px-3 py-1.5 text-[11px] font-bold text-ink-2 transition hover:border-ink hover:text-ink">{t("student.btn_verify" as any)}</button>
                      <button className="rounded-lg bg-ink px-3 py-1.5 text-[11px] font-bold text-white transition hover:opacity-85">{t("student.btn_share" as any)}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* DÉMARCHES */}
      <section id="demarches" className="mx-auto max-w-[1200px] px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.demarches" as any)}</h2>
            <p className="text-[11px] font-medium text-ink-3">{t("student.dem.subtitle" as any)}</p>
          </div>
          <button className="rounded-full bg-ink px-4 py-1.5 text-[11px] font-bold text-white transition hover:opacity-85" onClick={() => setNewReqOpen(true)}>+ {t("student.cta_request" as any)}</button>
        </div>
        <div className="overflow-hidden rounded-xl border border-surface-3 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {[
                  "student.dem.col.ref",
                  "student.dem.col.title",
                  "student.dem.col.step",
                  "student.dem.col.sla",
                  "student.dem.col.status",
                ].map((h) => (
                  <th key={h} className="border-b border-surface-3 bg-surface-2 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                    {t(h as any)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demarches.map((d, i) => (
                <tr key={d.ref} className="group transition-colors hover:bg-surface-2 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <td className="border-b border-surface-2 px-5 py-4 font-mono text-[11px] font-bold text-ink-3">{d.ref}</td>
                  <td className="border-b border-surface-2 px-5 py-4 font-semibold text-ink">{t(d.titleKey as any)}</td>
                  <td className="border-b border-surface-2 px-5 py-4 text-[13px] text-ink-2">{t(d.stepKey as any)}</td>
                  <td className="border-b border-surface-2 px-5 py-4 text-[11px] font-bold text-ink-3">{t(d.slaKey as any)}</td>
                  <td className="border-b border-surface-2 px-5 py-4">
                    <StatusPill
                      tone={d.status === "disponible" ? "success" : d.status === "coffre" ? "info" : "warning"}
                      label={t(`student.dem.status.${d.status}` as any)}
                      animatedDots={d.status === "encours"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" className="mx-auto max-w-[1200px] px-8 pb-12">
        <h2 className="mb-8 font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.timeline" as any)}</h2>
        <div className="glass-card flex flex-col gap-8 rounded-2xl border border-surface-3 bg-white p-8">
          <div className="flex items-center justify-between border-b border-surface-2 pb-6">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-ink text-white shadow-lg shadow-ink/20"><ClipboardList className="h-6 w-6" /></div>
              <div>
                <h3 className="font-display text-lg font-bold text-ink">{t("student.dem.row1.title" as any)}</h3>
                <p className="text-xs text-ink-3">Ref: #GNU-421 · {t("student.tl.subtitle" as any)}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink-3">{t("student.tl.inprogress" as any)}</div>
              <div className="mt-1 flex items-center gap-2 font-display text-2xl font-black text-ink">
                75%
                <div className="h-2 w-32 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full w-3/4 bg-ink" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative pl-10 pt-2">
            <div className="absolute left-3.5 top-0 h-full w-0.5 bg-surface-2" />
            {timeline.map((item, i) => (
              <div key={i} className="relative mb-10 last:mb-0 fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`absolute -left-[31px] top-1 grid h-4 w-4 place-items-center rounded-full ring-4 ring-white ${item.state === "done" ? "bg-emerald-500" : item.state === "active" ? "bg-ink scale-125 pulse-ring" : "bg-surface-3"}`}>
                  {item.state === "done" && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6L9 17l-5-5" /></svg>}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-3">
                    <span className={`font-display text-sm font-bold ${item.state === "active" ? "text-ink" : "text-ink-2"}`}>{t(item.titleKey as any)}</span>
                    <span className="text-[10px] font-semibold text-ink-3 uppercase tracking-wider">{t(item.dateKey as any)}</span>
                    {item.state === "active" && <span className="rounded-full bg-ink px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-tighter">{t("student.tl.current_step" as any)}</span>}
                  </div>
                  <p className={`max-w-md text-[13px] leading-relaxed ${item.state === "pending" ? "text-ink-3 opacity-60 italic" : "text-ink-2"}`}>{t(item.descKey as any)}</p>
                  {item.state === "active" && (
                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-surface-3 bg-surface-2 p-3">
                      <div className="h-8 w-8 overflow-hidden rounded-full border border-white bg-white shadow-sm"><img src={avatarTeacher} alt="Agent" className="h-full w-full object-cover grayscale opacity-80" /></div>
                      <div className="flex-1 text-[11px] font-medium leading-tight text-ink-2">
                        {t("student.tl.processing" as any)}
                        <br /><span className="text-[9px] font-bold text-ink-3 uppercase opacity-70">GNU Registrar Office \ Level-1</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIGITAL VAULT */}
      <section id="vault" className="mx-auto max-w-[1200px] px-8 pb-32">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.vault" as any)}</h2>
            <p className="text-[13px] text-ink-3">{t("student.vault.subtitle" as any)}</p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              id="vault-upload" 
              className="hidden" 
              onChange={handleUpload}
              disabled={uploading}
            />
            <label 
              htmlFor="vault-upload"
              className={`flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-ink px-5 py-2 text-[13px] font-bold text-ink transition hover:bg-ink hover:text-white ${uploading ? "opacity-50 pointer-events-none" : ""}`}
            >
              {uploading ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t("student.vault.syncing" as any)}
                </>
              ) : (
                <>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                  Add Document
                </>
              )}
            </label>
            <button className="flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-[13px] font-bold text-white transition hover:opacity-85 active:scale-95">{t("student.vault.download" as any)}</button>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userDocs.length === 0 && !loadingDocs && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-surface-3 rounded-3xl">
              <ShieldCheck className="h-12 w-12 mx-auto text-ink-3 opacity-20 mb-3" />
              <p className="text-ink-3 font-medium">Your digital vault is empty.</p>
              <p className="text-[11px] text-ink-3 opacity-70">Upload documents or wait for faculty issuance.</p>
            </div>
          )}
          
          {userDocs.map((item, i) => (
            <div
              key={item.id}
              className="group hover-lift relative overflow-hidden rounded-3xl border border-surface-3 bg-white p-6 shadow-sm transition-all hover:border-ink/20 hover:shadow-xl fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 text-ink-2 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusPill tone="info" label="PAdES-LTV" showDot={false} />
                  {item.status === 'validated' && <StatusPill tone="success" label="VERIFIED" showDot={false} />}
                </div>
              </div>
              <div className="mt-5">
                <h3 className="line-clamp-1 font-display text-[15px] font-bold text-ink transition-colors group-hover:text-ink">{item.filename}</h3>
                <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-ink-3">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  <span className="h-1 w-1 rounded-full bg-surface-3" />
                  <span>{item.storage_path?.includes("prof/") ? "Registrar's Office" : "My Uploads"}</span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-2 border-t border-surface-2 pt-4">
                <button 
                  onClick={() => handleDownload(item.id, item.filename, item.storage_path)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-surface-2 py-2.5 text-[11px] font-bold text-ink transition hover:bg-ink hover:text-white"
                >
                  <DownloadCloud className="h-4 w-4" />
                  Get PDF
                </button>
                <div className="flex gap-2">
                   <button 
                    onClick={() => handleShowQR(item)}
                    className="flex flex-1 items-center justify-center rounded-xl bg-surface-2 py-2.5 text-ink transition hover:bg-surface-3"
                    title="Verification QR"
                  >
                    <QrCode className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleShare(item.id)}
                    className="flex flex-1 items-center justify-center rounded-xl bg-surface-2 py-2.5 text-ink transition hover:bg-surface-3"
                    title="Share temporary link"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id, item.storage_path)}
                    className="flex flex-1 items-center justify-center rounded-xl bg-surface-2 py-2.5 text-danger transition hover:bg-danger-light"
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QR VERIFICATION MODAL */}
      {qrDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-[32px] border border-surface-3 bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-250">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-ink">Verify Document</h3>
              <button onClick={() => setQrDoc(null)} className="rounded-full p-2 hover:bg-surface-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-6 rounded-3xl border-8 border-surface-2 p-3 bg-white shadow-inner">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://e-ubma.dz/verify/${qrDoc.id}`)}`}
                  alt="Verification QR"
                  className="h-44 w-44"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-white/80 transition-opacity rounded-2xl">
                   <p className="text-[10px] font-bold text-ink text-center px-4">SCAN TO VERIFY INTEGRITY</p>
                </div>
              </div>
              <p className="text-center text-xs font-medium leading-relaxed text-ink-3">
                Anyone can scan this code to verify the <strong>authenticity</strong> and <strong>digital signature</strong> of this document in real time.
              </p>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => handleLinkedInShare(qrDoc.filename, qrDoc.id)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0077b5] py-4 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95"
              >
                Add to LinkedIn Profile
              </button>
              <button 
                onClick={() => setQrDoc(null)}
                className="w-full py-3 text-xs font-bold text-ink-3 hover:text-ink transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHATBOT */}
      <Chatbot onAction={(act) => {
        if (act.type === "OPEN_REQUEST_DIALOG") {
          setReqInitialData(act.payload);
          setNewReqOpen(true);
        }
      }} />

      {/* NEW REQUEST DIALOG */}
      {newReqOpen && (
        <NewRequestDialog 
          open={newReqOpen} 
          onOpenChange={setNewReqOpen} 
          initialData={reqInitialData}
        />
      )}

      <footer className="border-t border-surface-2 bg-white py-12">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-8 md:flex-row">
          <div className="flex items-center gap-3">
            <img src={ubmaLogo} alt="UBMA" className="h-10 w-10 opacity-60" />
            <div className="text-xs font-semibold tracking-tight text-ink-3">{t("student.footer" as any)}</div>
          </div>
          <div className="flex gap-6 text-xs font-bold text-ink-3">
            <a href="#" className="hover:text-ink">Terms</a>
            <a href="#" className="hover:text-ink">Privacy</a>
            <a href="#" className="hover:text-ink">Technical Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
