import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList, BarChart3, Award, ShieldCheck, PenSquare, Mailbox,
  Binary, Globe, Bot, Lock, FileText, GraduationCap, User, Trash2, QrCode, X, Share2,
} from "lucide-react";
import { Chatbot } from "@/components/Chatbot";
import ubmaLogo from "@/assets/ubma-logo";
import avatarStudent from "@/assets/avatar-student";
import avatarTeacher from "@/assets/avatar-teacher";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StudentMessaging } from "@/components/student/StudentMessaging";
import { NewRequestDialog } from "@/components/student/NewRequestDialog";
import { ShareDialog } from "@/components/ShareDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRequests } from "@/hooks/useRequests";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { toast } from "sonner";
import { apiGetDocuments, apiUploadDocument, apiDownloadDocument } from "@/lib/api";

type SpaceMode = "student" | "teacher";

export default function StudentSpaceRoute({ mode = "student" }: { mode?: SpaceMode } = {}) {
  const { t } = useLanguage();
  const label = mode === "teacher" ? t("ts.mobile_teacher" as any).replace("GNU · ", "") : t("ts.mobile_student" as any).replace("GNU · ", "");
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass-card sticky top-0 z-50 flex h-12 items-center gap-2 border-x-0 border-t-0 bg-white/40 px-3 backdrop-blur-xl md:hidden">
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

const services: { Icon: LucideIcon; nameKey: string; descKey: string; action: "request" | "scroll"; target: string }[] = [
  { Icon: ClipboardList, nameKey: "student.svc.cert.name",       descKey: "student.svc.cert.desc",       action: "request", target: "cert" },
  { Icon: BarChart3,     nameKey: "student.svc.transcript.name", descKey: "student.svc.transcript.desc", action: "request", target: "transcript" },
  { Icon: Award,         nameKey: "student.svc.badges.name",     descKey: "student.svc.badges.desc",     action: "scroll",  target: "badges" },
  { Icon: ShieldCheck,   nameKey: "student.svc.vault.name",      descKey: "student.svc.vault.desc",      action: "scroll",  target: "vault" },
  { Icon: PenSquare,     nameKey: "student.svc.enroll.name",     descKey: "student.svc.enroll.desc",     action: "request", target: "enroll" },
  { Icon: Mailbox,       nameKey: "student.svc.delivery.name",   descKey: "student.svc.delivery.desc",   action: "request", target: "delivery" },
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-semibold ${TONE_CLASSES[tone]}`}
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
  const { t, lang } = useLanguage();
  const { toggleSidebar } = useSidebar();
  const [showMessaging, setShowMessaging] = useState(false);
  const [newReqOpen, setNewReqOpen] = useState(false);
  const { requests } = useRequests();

  // User identity from localStorage
  const userId = localStorage.getItem("user_id") || "anonymous";
  const userName = localStorage.getItem("user_name") || "Étudiant";
  const userMajor = localStorage.getItem("user_major") || "";
  const userInitials = userName.slice(0, 2).toUpperCase();

  // Document state
  const [userDocs, setUserDocs] = useState<{ id: string; filename: string; hash: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [qrDoc, setQrDoc] = useState<{ filename: string; hash: string } | null>(null);
  const [shareData, setShareData] = useState<{ id: string; filename: string } | null>(null);

  // Fetch docs from backend
  const fetchDocs = async () => {
    const uid = userId;
    if (!uid || uid === "anonymous") return;
    try {
      const docs = await apiGetDocuments(uid);
      setUserDocs(docs);
    } catch {
      // Backend offline — silent fail, show static vault
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  // Upload handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uid = userId;
    if (!uid || uid === "anonymous") { toast.error("Please log in first"); return; }
    setUploading(true);
    try {
      const result = await apiUploadDocument(uid, file);
      toast.success("Document encrypted & uploaded!");
      fetchDocs();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Download handler
  const handleDownload = async (docId: string, filename: string) => {
    const uid = userId;
    try {
      toast.info("Downloading & decrypting…");
      const blob = await apiDownloadDocument(docId, uid);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      a.remove(); window.URL.revokeObjectURL(url);
      toast.success("Downloaded!");
    } catch { toast.error("Download failed"); }
  };

  // Share handler
  const handleShare = (docId: string, filename: string) => {
    setShareData({ id: docId, filename });
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
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="glass-card sticky top-0 z-40 flex h-16 md:h-20 items-center gap-4 md:gap-8 border-x-0 border-t-0 bg-white/40 px-4 md:px-8 backdrop-blur-xl">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          className="group flex shrink-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <div
            className="grid h-10 w-10 md:h-14 md:w-14 shrink-0 place-items-center rounded-full bg-white p-1 md:p-1.5 shadow-[0_6px_16px_-4px_rgba(0,0,0,.25),0_0_0_2px_white,0_0_0_3px_color-mix(in_oklab,var(--ink)_25%,transparent)] ring-1 ring-surface-3 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
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
            <span className="text-[11px] font-semibold tracking-[0.22em] text-ink-3">{t("ts.brand_student_sub" as any)}</span>
          </div>
        </button>
        <div className="hidden flex-1 xl:flex" />
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
      <header className="aurora-bg mx-auto grid max-w-[1200px] items-center gap-8 md:gap-12 px-4 md:px-8 py-10 md:py-16 lg:grid-cols-[1fr_360px]">
        <div className="fade-up">
          <div className="glass-card mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-ink-2">
            <span className="h-2 w-2 rounded-full bg-ink pulse-ring" />
            {t("student.badge_year" as any)}
          </div>
          <h1 className="font-display text-[clamp(1.75rem,5vw,3.25rem)] font-extrabold leading-[1.1] tracking-tight text-ink">
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
          <div className="glass-card relative rounded-[20px] p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,.18)]">
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
                    <div className="flex-1 text-[14px] font-medium text-ink">{t(d.titleKey as any)}</div>
                    <StatusPill tone={d.tone} label={t(d.labelKey as any)} showDot={false} animatedDots={d.animatedDots} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="mx-auto mb-12 grid max-w-[1200px] grid-cols-2 gap-3 md:gap-4 px-4 md:px-8 fade-up delay-300 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.key}
            className="glass-card glass-card-hover rounded-xl p-5 text-center"
            style={{ animation: `fadeUp .6s ${0.4 + i * 0.08}s both` }}
          >
            <div className="font-display text-3xl font-extrabold tracking-tight text-ink">{s.num}</div>
            <div className="mt-1 text-[13px] font-medium text-ink-3">{t(s.key as any)}</div>
          </div>
        ))}
      </div>

      {/* E-SERVICES */}
      <section id="services" className="mx-auto max-w-[1200px] px-4 md:px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.eservices" as any)}</h2>
          <a href="#" className="text-[13px] font-medium text-ink hover:underline">{t("common.view_all" as any)}</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = s.Icon;
            return (
              <button
                key={s.nameKey}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (s.action === "request") {
                    setNewReqOpen(true);
                  } else if (s.action === "scroll") {
                    const el = document.getElementById(s.target);
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 16;
                      window.scrollTo({ top, behavior: "smooth" });
                      el.classList.add("section-flash");
                      window.setTimeout(() => el.classList.remove("section-flash"), 900);
                    }
                  }
                }}
                className="hover-lift group flex flex-col gap-3 rounded-xl border border-surface-3 bg-white p-6 fade-up text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-surface-2 text-ink-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="font-semibold text-base text-ink">{t(s.nameKey as any)}</div>
                <div className="text-[14px] leading-relaxed text-ink-3">{t(s.descKey as any)}</div>
                <div className="mt-auto self-end text-lg text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-ink">→</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* OPEN BADGES */}
      <section id="badges" className="mx-auto max-w-[1200px] px-4 md:px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.badges" as any)}</h2>
          <a href="#" className="text-[13px] font-medium text-ink hover:underline">{t("common.verify_all" as any)}</a>
        </div>
        <div className="overflow-x-auto rounded-xl border border-surface-3 bg-white scrollbar-hide">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr>
                {[
                  "student.badges.col.badge",
                  "student.badges.col.issuer",
                  "student.badges.col.date",
                  "student.badges.col.std",
                  "student.badges.col.action",
                ].map((h) => (
                  <th key={h} className="border-b border-surface-3 bg-surface-2 px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-ink-3">
                    {t(h as any)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {badges.map((b, i) => {
                const Icon = b.Icon;
                return (
                  <tr key={b.title} className="transition-colors hover:bg-surface-2 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <td className="border-b border-surface-2 px-5 py-3.5">
                      <div className="flex items-center gap-2.5 font-medium text-ink">
                        <div className="grid h-7 w-7 place-items-center rounded-md bg-surface-2 text-ink-2"><Icon className="h-3.5 w-3.5" aria-hidden /></div>
                        {b.title}
                      </div>
                    </td>
                    <td className="border-b border-surface-2 px-5 py-3.5 text-[14px] text-ink-3">{b.sub}</td>
                    <td className="border-b border-surface-2 px-5 py-3.5 text-[14px] text-ink-3">{b.date}</td>
                  <td className="border-b border-surface-2 px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-3 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink-2" />
                      OB 3.0
                    </span>
                  </td>
                    <td className="border-b border-surface-2 px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(b.title)}&organizationName=Université%20Badji%20Mokhtar%20Annaba&issueYear=2025&issueMonth=3&certId=UBMA-${b.title.toUpperCase().replace(/\s+/g, '-')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-surface-3 px-3 py-1 text-xs font-medium text-ink-2 transition hover:border-ink hover:text-ink hover:bg-surface-2"
                        >
                          <Share2 className="h-3.5 w-3.5 text-[#0077b5]" />
                          {t("student.btn_share" as any)}
                        </a>
                      </div>
                    </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* MES DÉMARCHES — SUIVI TEMPS RÉEL */}
      <section id="demarches" className="mx-auto max-w-[1200px] px-4 md:px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.demarches" as any)}</h2>
            <p className="mt-1 text-[14px] text-ink-3">{t("student.dem.subtitle" as any)}</p>
          </div>
          <a href="#" className="text-[13px] font-medium text-ink hover:underline">{t("common.view_all" as any)}</a>
        </div>
        <div className="overflow-x-auto rounded-xl border border-surface-3 bg-white scrollbar-hide">
          <table className="w-full min-w-[700px] text-sm">
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
               {requests.map((r, i) => (
                 <tr key={r.id} className="transition-colors hover:bg-surface-2 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                   <td className="border-b border-surface-2 px-5 py-3.5 font-mono text-[12px] font-semibold text-ink">
                     {r.id.split('-').slice(0, 2).join('-').toUpperCase()}
                   </td>
                   <td className="border-b border-surface-2 px-5 py-3.5 font-medium text-ink">{r.type}</td>
                   <td className="border-b border-surface-2 px-5 py-3.5 text-[13px] text-ink-2">
                     {new Date(r.createdAt).toLocaleDateString()}
                   </td>
                   <td className="border-b border-surface-2 px-5 py-3.5 text-[13px] text-ink-3">
                     {lang === "ar" ? "معالجة فورية" : "Instant processing"}
                   </td>
                   <td className="border-b border-surface-2 px-5 py-3.5">
                     {r.status === "accepted" ? (
                       <StatusPill tone="success" label={lang === "ar" ? "جاهز في الخزنة" : "Ready in Vault"} />
                     ) : r.status === "pending" ? (
                       <StatusPill tone="warning" label={lang === "ar" ? "قيد المعالجة" : "In Progress"} animatedDots />
                     ) : (
                       <StatusPill tone="info" label={r.status} />
                     )}
                   </td>
                 </tr>
               ))}
               {requests.length === 0 && demarches.map((d, i) => (
                 <tr key={d.ref} className="transition-colors hover:bg-surface-2 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                   <td className="border-b border-surface-2 px-5 py-3.5 font-mono text-[12px] font-semibold text-ink">{d.ref}</td>
                   <td className="border-b border-surface-2 px-5 py-3.5 font-medium text-ink">{t(d.titleKey as any)}</td>
                   <td className="border-b border-surface-2 px-5 py-3.5 text-[13px] text-ink-2">{t(d.stepKey as any)}</td>
                   <td className="border-b border-surface-2 px-5 py-3.5 text-[13px] text-ink-3">{t(d.slaKey as any)}</td>
                   <td className="border-b border-surface-2 px-5 py-3.5">
                     {d.status === "disponible" ? (
                       <StatusPill tone="success" label={t("student.dem.status.available" as any)} />
                     ) : d.status === "encours" ? (
                       <StatusPill tone="warning" label={t("student.dem.status.inprogress" as any)} />
                     ) : (
                       <StatusPill tone="info" label={t("student.dem.status.vault" as any)} />
                     )}
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </section>

      {/* FRISE — DOSSIER #GNU-421 */}
      <section id="timeline" className="mx-auto max-w-[1200px] px-4 md:px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.timeline" as any)} — #GNU-421</h2>
            <p className="mt-1 text-[13px] text-ink-3">{t("student.tl.subtitle" as any)}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning-light px-3 py-1 text-[11px] font-semibold text-warning">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
            {t("student.tl.inprogress" as any)}
          </span>
        </div>
        <div className="rounded-xl border border-surface-3 bg-white p-6 sm:p-8">
          <ol className="relative">
            {timeline.map((s, i) => {
              const isLast = i === timeline.length - 1;
              const dotClass =
                s.state === "done"
                  ? "bg-success border-success text-success-foreground"
                  : s.state === "active"
                    ? "bg-warning border-warning text-warning-foreground pulse-ring"
                    : "bg-white border-surface-3 text-ink-3";
              const lineClass =
                s.state === "done" ? "bg-success" : s.state === "active" ? "bg-gradient-to-b from-warning to-surface-3" : "bg-surface-3";
              return (
                <li
                  key={s.titleKey}
                  className="relative grid grid-cols-[40px_1fr] gap-4 pb-8 last:pb-0 fade-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {!isLast && <span className={`absolute left-[19px] top-9 h-[calc(100%-1rem)] w-[2px] ${lineClass}`} aria-hidden />}
                  <div className={`relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 text-xs font-bold ${dotClass}`}>
                    {s.state === "done" ? (
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div className={`pt-1 ${s.state === "pending" ? "opacity-50" : ""}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-ink">{t(s.titleKey as any)}</h3>
                      {s.state === "active" && (
                        <span className="inline-flex items-center rounded-full border border-warning/40 bg-warning-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
                          {t("student.tl.current_step" as any)}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[12px] font-medium text-ink-3">{t(s.dateKey as any)}</div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{t(s.descKey as any)}</p>
                    {s.state === "active" && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-[12px] text-ink-2">
                        <span aria-hidden className="dot-anim inline-flex w-4 justify-between text-warning">
                          <span>•</span><span>•</span><span>•</span>
                        </span>
                        {t("student.tl.processing" as any)}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* MON COFFRE-FORT DOCUMENTAIRE */}
      <section id="vault" className="mx-auto max-w-[1200px] px-4 md:px-8 pb-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.vault" as any)}</h2>
            <p className="mt-1 text-[13px] text-ink-3">{t("student.vault.subtitle" as any)}</p>
          </div>
          {/* Upload button */}
          <label
            htmlFor="vault-upload"
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 ${uploading ? "pointer-events-none opacity-60" : ""}`}
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {lang === "ar" ? "جاري التشفير…" : lang === "fr" ? "Chiffrement…" : "Encrypting…"}
              </>
            ) : (
              <>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                {lang === "ar" ? "رفع وثيقة" : lang === "fr" ? "Déposer un document" : "Upload document"}
              </>
            )}
          </label>
          <input id="vault-upload" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="sr-only" onChange={handleUpload} disabled={uploading} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Real docs from backend */}
          {userDocs.map((doc, i) => (
            <article key={doc.id} className="hover-lift group flex flex-col rounded-xl border border-surface-3 bg-white p-5 fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-info-light text-info">
                  <FileText className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{doc.filename}</h3>
                  <div className="mt-1 text-[12px] text-ink-3">Hash: {doc.hash.slice(0, 12)}…</div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-info/30 bg-info-light px-2 py-0.5 text-[10px] font-semibold text-info">
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  AES-256
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleDownload(doc.id, doc.filename)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  PDF
                </button>
                <button onClick={() => setShareData({ id: doc.id, filename: doc.filename })} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-surface-3 bg-white px-3 py-1.5 text-xs font-medium text-ink-2 transition hover:border-ink hover:text-ink">
                  <Share2 className="h-3.5 w-3.5" />
                  {t("student.vault.share" as any)}
                </button>
                <button onClick={() => setQrDoc({ filename: doc.filename, hash: doc.hash })} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-surface-3 bg-white text-ink-2 transition hover:border-ink hover:text-ink" title="QR">
                  <QrCode className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}

          {/* Static vault docs (always shown as demo) */}
          {vault.map((v, i) => {
            const Icon = v.Icon;
            return (
            <article key={v.nameKey} className="hover-lift group flex flex-col rounded-xl border border-surface-3 bg-white p-5 fade-up" style={{ animationDelay: `${(userDocs.length + i) * 0.08}s` }}>
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-info-light text-info">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{t(v.nameKey as any)}</h3>
                  <div className="mt-1 text-[12px] text-ink-3">{t(v.sourceKey as any)}</div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-info/30 bg-info-light px-2 py-0.5 text-[10px] font-semibold text-info">
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {v.signature}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-surface-2 pt-3 text-[12px] text-ink-3">
                <span className="inline-flex items-center gap-1.5">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                  {t(v.dateKey as any)}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  PDF
                </button>
                <button onClick={() => setShareData({ id: v.nameKey, filename: t(v.nameKey as any) })} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-surface-3 bg-white px-3 py-1.5 text-xs font-medium text-ink-2 transition hover:border-ink hover:text-ink">
                  <Share2 className="h-3.5 w-3.5" />
                  {t("student.vault.share" as any)}
                </button>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      {showMessaging && <StudentMessaging />}

      {/* QR Verification Modal */}
      {qrDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setQrDoc(null)}>
          <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-surface-3 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setQrDoc(null)} className="absolute right-3 top-3 rounded-full p-1 hover:bg-surface-2">
              <X className="h-4 w-4" />
            </button>
            <h3 className="mb-1 font-display text-lg font-bold text-ink">
              {lang === "ar" ? "تحقق عبر QR" : lang === "fr" ? "Vérification QR" : "QR Verification"}
            </h3>
            <p className="mb-4 text-xs text-ink-3">{qrDoc.filename}</p>
            <div className="flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/api/documents/verify/${qrDoc.hash}`)}`}
                alt="QR code"
                className="rounded-lg"
                width={200} height={200}
              />
            </div>
            <p className="mt-3 text-center text-[11px] text-ink-3">
              {lang === "ar" ? "امسح الرمز للتحقق من صحة الوثيقة" : lang === "fr" ? "Scannez pour vérifier l'authenticité" : "Scan to verify document authenticity"}
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-8 border-t border-surface-3 px-8 py-8 text-center text-xs text-ink-3">
        {t("student.footer" as any)}
      </footer>

      <Chatbot onAction={(action) => {
        if (action.type === "OPEN_REQUEST_DIALOG") setNewReqOpen(true);
      }} />
      <NewRequestDialog open={newReqOpen} onOpenChange={setNewReqOpen} />
      {shareData && (
        <ShareDialog 
          open={!!shareData} 
          onOpenChange={(open) => !open && setShareData(null)} 
          documentId={shareData.id} 
          filename={shareData.filename} 
        />
      )}
    </div>
  );
}
