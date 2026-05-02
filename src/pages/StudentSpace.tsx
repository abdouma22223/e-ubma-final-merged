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
  const label = mode === "teacher"
    ? t("ts.mobile_teacher" as any).replace("GNU · ", "")
    : t("ts.mobile_student" as any).replace("GNU · ", "");
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

const services: { Icon: typeof ClipboardList; nameKey: string; descKey: string; action: "request" | "scroll"; target: string }[] = [
  { Icon: ClipboardList, nameKey: "student.svc.cert.name",       descKey: "student.svc.cert.desc",       action: "request", target: "cert" },
  { Icon: BarChart3,     nameKey: "student.svc.transcript.name", descKey: "student.svc.transcript.desc", action: "request", target: "transcript" },
  { Icon: Award,         nameKey: "student.svc.badges.name",     descKey: "student.svc.badges.desc",     action: "scroll",  target: "badges" },
  { Icon: ShieldCheck,   nameKey: "student.svc.vault.name",      descKey: "student.svc.vault.desc",      action: "scroll",  target: "vault" },
  { Icon: PenSquare,     nameKey: "student.svc.enroll.name",     descKey: "student.svc.enroll.desc",     action: "request", target: "enroll" },
  { Icon: Mailbox,       nameKey: "student.svc.delivery.name",   descKey: "student.svc.delivery.desc",   action: "request", target: "delivery" },
];

const vault: { Icon: typeof FileText; nameKey: string; dateKey: string; sourceKey: string; signature: string }[] = [
  { Icon: FileText,      nameKey: "student.vault.v1.name", dateKey: "student.vault.v1.date", sourceKey: "student.vault.v1.source", signature: "PAdES-LTV" },
  { Icon: GraduationCap, nameKey: "student.vault.v2.name", dateKey: "student.vault.v2.date", sourceKey: "student.vault.v2.source", signature: "PAdES" },
  { Icon: Globe,         nameKey: "student.vault.v3.name", dateKey: "student.vault.v3.date", sourceKey: "student.vault.v3.source", signature: "PAdES-LTV" },
];

const stats = [
  { num: "3",    key: "student.stat.docs" },
  { num: "7",    key: "student.stat.badges" },
  { num: "12",   key: "student.stat.vault" },
  { num: "100%", key: "student.stat.pades" },
];

type PillTone = "success" | "warning" | "info" | "danger";
const TONE_CLS: Record<PillTone, string> = {
  success: "border-success/40 bg-success-light text-success",
  warning: "border-warning/40 bg-warning-light text-warning",
  info:    "border-info/30 bg-info-light text-info",
  danger:  "border-danger/30 bg-danger-light text-danger",
};
const DOT_CLS: Record<PillTone, string> = {
  success: "bg-success", warning: "bg-warning", info: "bg-info", danger: "bg-danger",
};

function StatusPill({ tone, label, showDot = true, animatedDots = false }: { tone: PillTone; label: string; showDot?: boolean; animatedDots?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${TONE_CLS[tone]}`}>
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLS[tone]}`} />}
      {label}
    </span>
  );
}

function Index({ spaceLabel = "Student Space", mode = "student" }: { spaceLabel?: string; mode?: SpaceMode }) {
  const { t, lang } = useLanguage();
  const { toggleSidebar } = useSidebar();
  const [showMessaging, setShowMessaging] = useState(false);
  const [newReqOpen, setNewReqOpen] = useState(false);
  const { requests } = useRequests();

  const userId     = localStorage.getItem("user_id")   || "anonymous";
  const userName   = localStorage.getItem("user_name") || "Étudiant";
  const userMajor  = localStorage.getItem("user_major") || "";
  const userInitials = userName.slice(0, 2).toUpperCase();

  const [userDocs,  setUserDocs]  = useState<{ id: string; filename: string; hash: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [qrDoc,     setQrDoc]     = useState<{ filename: string; hash: string } | null>(null);
  const [shareData, setShareData] = useState<{ id: string; filename: string } | null>(null);

  const fetchDocs = async () => {
    if (!userId || userId === "anonymous") return;
    try { const docs = await apiGetDocuments(userId); setUserDocs(docs); } catch {}
  };
  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (userId === "anonymous") { toast.error("Please log in first"); return; }
    setUploading(true);
    try { await apiUploadDocument(userId, file); toast.success("Document uploaded!"); fetchDocs(); }
    catch (err: any) { toast.error(err.message || "Upload failed"); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleDownload = async (docId: string, filename: string) => {
    try {
      toast.info("Downloading…");
      const blob = await apiDownloadDocument(docId, userId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      a.remove(); window.URL.revokeObjectURL(url);
      toast.success("Downloaded!");
    } catch { toast.error("Download failed"); }
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
      <nav className="glass-card sticky top-0 z-40 flex h-[80px] items-center gap-8 border-x-0 border-t-0 bg-white/40 px-8 backdrop-blur-xl">
        <button type="button" onClick={toggleSidebar} className="group flex shrink-0 items-center gap-3 rounded-full">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white p-1.5 ring-1 ring-surface-3">
            <img src={ubmaLogo} alt="UBMA" className="h-full w-full object-contain" />
          </div>
          <div className="hidden flex-col leading-tight text-left md:flex">
            <span dir="rtl" className="font-display text-[13px] font-bold text-ink">جامعة باجي مختار - عنابة</span>
            <span className="font-display text-[12px] font-semibold text-ink">{t("ts.brand_line2" as any)}</span>
          </div>
        </button>
        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/help" className="rounded-full border border-surface-3 px-4 py-1.5 text-[13px] font-medium text-ink-2 transition hover:border-ink hover:bg-surface-2">
            {t("common.help" as any)}
          </Link>
          <Link to="/profile" className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-surface-2 ring-2 ring-transparent">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="aurora-bg mx-auto max-w-[1200px] px-8 py-16">
        <div className="fade-up">
          <h1 className="font-display text-[clamp(2.2rem,4vw,3.25rem)] font-extrabold leading-tight tracking-tight text-ink">
            {t("student.hero_title" as any)}
          </h1>
          <p className="mt-5 max-w-[480px] text-base leading-relaxed text-ink-2">{t("student.hero_desc" as any)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => setNewReqOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:opacity-90">
              {t("student.cta_request" as any)}
            </button>
            <a href="#vault" className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-surface-3 bg-white px-6 py-3 text-sm font-medium text-ink transition hover:border-ink">
              {t("student.cta_view" as any)}
            </a>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="mx-auto mb-12 grid max-w-[1200px] grid-cols-2 gap-4 px-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.key} className="glass-card glass-card-hover rounded-xl p-5 text-center">
            <div className="font-display text-3xl font-extrabold tracking-tight text-ink">{s.num}</div>
            <div className="mt-1 text-xs font-medium text-ink-3">{t(s.key as any)}</div>
          </div>
        ))}
      </div>

      {/* E-SERVICES */}
      <section id="services" className="mx-auto max-w-[1200px] px-8 pb-12">
        <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.eservices" as any)}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.Icon;
            return (
              <button key={s.nameKey} type="button" onClick={() => {
                if (s.action === "request") { setNewReqOpen(true); }
                else { const el = document.getElementById(s.target); if (el) el.scrollIntoView({ behavior: "smooth" }); }
              }} className="hover-lift group flex flex-col gap-3 rounded-xl border border-surface-3 bg-white p-6 text-left">
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-surface-2 text-ink-2"><Icon className="h-5 w-5" /></div>
                <div className="font-semibold text-sm text-ink">{t(s.nameKey as any)}</div>
                <div className="text-[13px] leading-relaxed text-ink-3">{t(s.descKey as any)}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* VAULT */}
      <section id="vault" className="mx-auto max-w-[1200px] px-8 pb-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{t("student.section.vault" as any)}</h2>
            <p className="mt-1 text-[13px] text-ink-3">{t("student.vault.subtitle" as any)}</p>
          </div>
          <label htmlFor="vault-upload" className={`inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
            {uploading ? "Encrypting…" : lang === "ar" ? "رفع وثيقة" : "Upload document"}
          </label>
          <input id="vault-upload" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="sr-only" onChange={handleUpload} disabled={uploading} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userDocs.map((doc) => (
            <article key={doc.id} className="hover-lift flex flex-col rounded-xl border border-surface-3 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-info-light text-info"><FileText className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold text-ink">{doc.filename}</h3>
                  <div className="mt-1 text-[12px] text-ink-3">Hash: {doc.hash.slice(0, 12)}…</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleDownload(doc.id, doc.filename)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90">PDF</button>
                <button onClick={() => setShareData({ id: doc.id, filename: doc.filename })} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-surface-3 bg-white px-3 py-1.5 text-xs font-medium text-ink-2 transition hover:border-ink hover:text-ink">
                  <Share2 className="h-3.5 w-3.5" />{t("student.vault.share" as any)}
                </button>
                <button onClick={() => setQrDoc({ filename: doc.filename, hash: doc.hash })} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-surface-3 bg-white text-ink-2 transition hover:border-ink">
                  <QrCode className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
          {vault.map((v) => {
            const Icon = v.Icon;
            return (
              <article key={v.nameKey} className="hover-lift flex flex-col rounded-xl border border-surface-3 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-info-light text-info"><Icon className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-semibold text-ink">{t(v.nameKey as any)}</h3>
                    <div className="mt-1 text-[12px] text-ink-3">{t(v.sourceKey as any)}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-info/30 bg-info-light px-2 py-0.5 text-[10px] font-semibold text-info">{v.signature}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">PDF</button>
                  <button onClick={() => setShareData({ id: v.nameKey, filename: t(v.nameKey as any) })} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-surface-3 bg-white px-3 py-1.5 text-xs font-medium text-ink-2 transition hover:border-ink hover:text-ink">
                    <Share2 className="h-3.5 w-3.5" />{t("student.vault.share" as any)}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {showMessaging && <StudentMessaging />}

      {qrDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setQrDoc(null)}>
          <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-surface-3 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setQrDoc(null)} className="absolute right-3 top-3 rounded-full p-1 hover:bg-surface-2"><X className="h-4 w-4" /></button>
            <h3 className="mb-1 font-display text-lg font-bold text-ink">QR Verification</h3>
            <p className="mb-4 text-xs text-ink-3">{qrDoc.filename}</p>
            <div className="flex justify-center">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/api/documents/verify/${qrDoc.hash}`)}`} alt="QR code" className="rounded-lg" width={200} height={200} />
            </div>
          </div>
        </div>
      )}

      <footer className="mt-8 border-t border-surface-3 px-8 py-8 text-center text-xs text-ink-3">{t("student.footer" as any)}</footer>
      <Chatbot onAction={(action) => { if (action.type === "OPEN_REQUEST_DIALOG") setNewReqOpen(true); }} />
      <NewRequestDialog open={newReqOpen} onOpenChange={setNewReqOpen} />
      {shareData && (
        <ShareDialog open={!!shareData} onOpenChange={(open) => !open && setShareData(null)} documentId={shareData.id} filename={shareData.filename} />
      )}
    </div>
  );
}
