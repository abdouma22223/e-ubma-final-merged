
import { Link } from "react-router-dom";
import { Chatbot } from "@/components/Chatbot";
import { UBMA_LOGO as ubmaLogo, AVATAR_STUDENT as avatarStudent, AVATAR_TEACHER as avatarTeacher } from "@/assets/images";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SpaceMode, Demarche, Badge } from "../types/student";
import { 
  STATS as stats, 
  SERVICES as services, 
  BADGES as badges, 
  DEMARCHES as demarches, 
  TIMELINE as timeline, 
  VAULT as vault, 
  NAV_LINKS as navLinks 
} from "../constants/studentData";

export default function StudentSpaceRoute({ mode = "student" }: { mode?: SpaceMode } = {}) {
  const label = mode === "teacher" ? "Teacher Space" : "Student Space";
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

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "../supabaseClient";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

function Index({ spaceLabel = "Student Space", mode = "student" }: { spaceLabel?: string; mode?: SpaceMode }) {
  const userName = localStorage.getItem("user_name") || "Student";
  const userMajor = localStorage.getItem("user_major") || "Computer Science";
  const userId = localStorage.getItem("user_id");

  const [userDocs, setUserDocs] = useState<any[]>([]);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    setLoadingDocs(true);
    const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to fetch documents");
    } else {
      setUserDocs(data || []);
    }
    setLoadingDocs(false);
  };

  const fetchBadges = async () => {
    const { data, error } = await supabase.from("badges").select("*");
    if (error) {
      console.error("Badges fetch error:", error);
    } else {
      setUserBadges(data || []);
    }
  };

  useEffect(() => {
    fetchDocs();
    fetchBadges();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      toast.info("Encrypting and uploading...");

      // 1. Encrypt via Backend
      const formData = new FormData();
      formData.append("file", file);
      const encryptRes = await axios.post(`${BACKEND_URL}/api/crypto/encrypt`, formData, {
        responseType: "blob",
      });

      // 2. Upload Encrypted Blob to Supabase
      const fileName = `${Date.now()}_${file.name}.enc`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("vault")
        .upload(fileName, encryptRes.data);

      if (uploadError) throw uploadError;

      // 3. Store Metadata in Supabase DB
      const { error: dbError } = await supabase.from("documents").insert({
        filename: file.name,
        storage_path: uploadData.path,
        mimetype: file.type,
        is_encrypted: true,
        owner_id: userId || 'anonymous'
      });

      if (dbError) throw dbError;

      toast.success("Document uploaded securely!");
      fetchDocs();
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (docId: string, filename: string, storagePath: string) => {
    try {
      toast.info("Downloading and decrypting...");
      
      // 1. Get from Supabase Storage
      const { data: encryptedBlob, error } = await supabase.storage.from("vault").download(storagePath);
      if (error) throw error;

      // 2. Decrypt via Backend
      const formData = new FormData();
      formData.append("file", encryptedBlob, "file.enc");
      const decryptRes = await axios.post(`${BACKEND_URL}/api/crypto/decrypt`, formData, {
        responseType: "blob",
      });

      // 3. Trigger Browser Download
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

  const handleShare = async (docId: string) => {
    try {
      const { data, error } = await supabase.from("documents").select("storage_path").eq("id", docId).single();
      if (error) throw error;

      const { data: shareData, error: shareError } = await supabase.storage
        .from("vault")
        .createSignedUrl(data.storage_path, 86400); // 24 hours

      if (shareError) throw shareError;

      navigator.clipboard.writeText(shareData.signedUrl);
      toast.success("Secure sharing link copied to clipboard! (Valid for 24h)");
    } catch (err) {
      toast.error("Error generating share link");
    }
  };

  const handleVerifyQR = (doc: any) => {
    const qrData = `https://gnu.univ-annaba.dz/verify/${doc.id}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    
    // Simple verification dialog via toast or custom alert for now
    toast.info(
      <div className="flex flex-col items-center gap-3 p-2">
        <span className="font-bold">Document Authenticity QR</span>
        <img src={qrUrl} alt="Verification QR" className="rounded-lg shadow-md" />
        <span className="text-[10px] text-gray-500">Scan to verify PAdES-LTV signature</span>
      </div>,
      { duration: 10000 }
    );
  };

  const handleLinkedInShare = (badge: any) => {
    const text = `I'm proud to earn the "${badge.name}" badge from Badji Mokhtar University! 🎓✨`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    toast.success("Opening LinkedIn share dialog...");
  };

  const handleRequest = async (serviceName: string) => {
    try {
      const { error } = await supabase.from("requests").insert({
        user_id: userId || 'anonymous',
        form_type: serviceName,
        data: { requested_at: new Date().toISOString() },
        status: 'pending'
      });
      if (error) throw error;
      toast.success(`Request for ${serviceName} submitted successfully!`);
    } catch (err) {
      toast.error("Failed to submit request");
    }
  };

  const handleIntentDetected = (intentData: any) => {
    const { intent, destination, document_type } = intentData;
    
    if (intent === "navigate" && destination) {
      const element = document.getElementById(destination);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        toast.info(`Navigating to ${destination}...`);
      }
    } else if (intent === "request_document" && document_type) {
      handleRequest(document_type);
    } else if (intent === "fill_form") {
      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
      toast.info("Opening services for form filling...");
    }
  };

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-40 flex h-[80px] items-center gap-8 border-b border-surface-3 bg-white/85 px-8 backdrop-blur-md">
        <a href="#" className="flex shrink-0 items-center gap-3 group">
          <div
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white p-1.5 shadow-[0_6px_16px_-4px_rgba(0,0,0,.25),0_0_0_3px_white,0_0_0_4px_color-mix(in_oklab,var(--ink)_25%,transparent)] ring-1 ring-surface-3 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"
          >
            <img
              src={ubmaLogo}
              alt="Université Badji Mokhtar Annaba"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="hidden flex-col leading-tight md:flex">
            <span dir="rtl" className="font-display text-[13px] font-bold text-ink">جامعة باجي مختار - عنابة</span>
            <span className="font-display text-[12px] font-semibold text-ink">Badji Mokhtar University · Annaba</span>
            <span className="text-[10px] font-semibold tracking-[0.22em] text-ink-3">UBMA</span>
          </div>
        </a>
        <div className="hidden flex-1 justify-center gap-1 xl:flex">
          {navLinks.map((l, i) => (
            <a
              key={l}
              href="#"
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                i === 0 ? "bg-ink text-white" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {l}
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button className="rounded-full border border-surface-3 px-4 py-1.5 text-[13px] font-medium text-ink-2 transition hover:border-ink hover:bg-surface-2">
            Help
          </button>
          <button
            aria-label="Notifications"
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
            aria-label="Open profile"
            className="group/avatar relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-ink ring-2 ring-transparent transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,.45)] hover:ring-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
          >
            <img
              src={mode === "teacher" ? avatarTeacher : avatarStudent}
              alt={mode === "teacher" ? "Teacher avatar" : "Student avatar"}
              loading="lazy"
              width={512}
              height={512}
              className="h-full w-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
            />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="mx-auto grid max-w-[1200px] items-center gap-12 px-8 py-16 lg:grid-cols-[1fr_360px]">
        <div className="fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-surface-3 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-2">
            <span className="h-2 w-2 rounded-full bg-ink pulse-ring" />
            {spaceLabel} · Academic Year 2024–2025
          </div>
          <h1 className="font-display text-[clamp(2.2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
            Your academic<br />
            documents,<br />
            reimagined.
          </h1>
          <p className="mt-5 max-w-[480px] text-base leading-relaxed text-ink-2">
            Request, manage, and share certified documents, Open Badges, and e-signatures — all in one secure place built for GNU students.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:opacity-90"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
              Request a document
            </a>
            <a
              href="#vault"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-surface-3 bg-white px-6 py-3 text-sm font-medium text-ink transition hover:border-ink"
            >
              View my documents
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>

        {/* hero card */}
        <div className="fade-up delay-200 relative">
          <div className="relative rounded-[20px] border border-surface-3 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,.18)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-ink font-display text-base font-extrabold text-white">
                {userName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">{userName}</div>
                <div className="text-xs text-ink-3">{userMajor}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: "📄", title: "School Certificate 2024", label: "Pending", tone: "warning" as PillTone, animatedDots: true },
                { icon: "🏅", title: "Data Structures Badge", label: "Issued", tone: "danger" as PillTone, animatedDots: false },
                { icon: "🔐", title: "Transcript 2023–24", label: "Verified", tone: "info" as PillTone, animatedDots: false },
              ].map((d, i) => (
                <div
                  key={d.title}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-surface-3 bg-surface p-3 transition hover:border-ink hover:translate-x-1"
                  style={{ animation: `fadeUp .6s ${0.3 + i * 0.1}s both` }}
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-base">{d.icon}</div>
                  <div className="flex-1 text-[13px] font-medium text-ink">{d.title}</div>
                  <StatusPill tone={d.tone} label={d.label} showDot={false} animatedDots={d.animatedDots} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="mx-auto mb-12 grid max-w-[1200px] grid-cols-2 gap-4 px-8 fade-up delay-300 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="hover-lift rounded-xl border border-surface-3 bg-white p-5 text-center"
            style={{ animation: `fadeUp .6s ${0.4 + i * 0.08}s both` }}
          >
            <div className="font-display text-3xl font-extrabold tracking-tight text-ink">{s.num}</div>
            <div className="mt-1 text-xs font-medium text-ink-3">{s.label}</div>
          </div>
        ))}
      </div>

      {/* E-SERVICES */}
      <section id="services" className="mx-auto max-w-[1200px] px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">E-services</h2>
          <a href="#" className="text-[13px] font-medium text-ink hover:underline">View all →</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <button
              key={s.name}
              onClick={() => handleRequest(s.name)}
              className="hover-lift group flex w-full flex-col gap-3 rounded-xl border border-surface-3 bg-white p-6 text-left fade-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-surface-2 text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                {s.icon}
              </div>
              <div className="font-semibold text-sm text-ink">{s.name}</div>
              <div className="text-[13px] leading-relaxed text-ink-3">{s.desc}</div>
              <div className="mt-auto self-end text-lg text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-ink">→</div>
            </button>
          ))}
        </div>
      </section>

      {/* OPEN BADGES */}
      <section id="badges" className="mx-auto max-w-[1200px] px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Open Badges</h2>
          <a href="#" className="text-[13px] font-medium text-ink hover:underline">Verify all →</a>
        </div>
        <div className="overflow-hidden rounded-xl border border-surface-3 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Badge", "Issuer", "Date", "Standard", "Action"].map((h) => (
                  <th key={h} className="border-b border-surface-3 bg-surface-2 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {userBadges.map((b, i) => (
                <tr key={b.id} className="transition-colors hover:bg-surface-2 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <td className="border-b border-surface-2 px-5 py-3.5">
                    <div className="flex items-center gap-2.5 font-medium text-ink">
                      <div className="grid h-7 w-7 place-items-center rounded-md bg-surface-2 text-[13px]">{b.icon}</div>
                      {b.name}
                    </div>
                  </td>
                  <td className="border-b border-surface-2 px-5 py-3.5 text-[13px] text-ink-3">{b.issuer}</td>
                  <td className="border-b border-surface-2 px-5 py-3.5 text-[13px] text-ink-3">{b.year}</td>
                  <td className="border-b border-surface-2 px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-3 bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink-2" />
                      {b.type || "OB 3.0"}
                    </span>
                  </td>
                  <td className="border-b border-surface-2 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="rounded-full border border-surface-3 px-3 py-1 text-xs font-medium text-ink-2 transition hover:border-ink hover:text-ink">
                        Details
                      </button>
                      <button 
                        onClick={() => handleLinkedInShare(b)}
                        className="rounded-full border border-blue-500/30 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                      >
                        LinkedIn
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {userBadges.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ink-3">No badges found in your profile.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MES DÉMARCHES — SUIVI TEMPS RÉEL */}
      <section id="demarches" className="mx-auto max-w-[1200px] px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Mes démarches</h2>
            <p className="mt-1 text-[13px] text-ink-3">Suivi temps réel · mis à jour il y a quelques secondes</p>
          </div>
          <a href="#" className="text-[13px] font-medium text-ink hover:underline">Tout voir →</a>
        </div>
        <div className="overflow-hidden rounded-xl border border-surface-3 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {["Référence", "Démarche", "Étape", "SLA", "Statut"].map((h) => (
                  <th key={h} className="border-b border-surface-3 bg-surface-2 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demarches.map((d, i) => (
                <tr key={d.ref} className="transition-colors hover:bg-surface-2 fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <td className="border-b border-surface-2 px-5 py-3.5 font-mono text-[12px] font-semibold text-ink">{d.ref}</td>
                  <td className="border-b border-surface-2 px-5 py-3.5 font-medium text-ink">{d.title}</td>
                  <td className="border-b border-surface-2 px-5 py-3.5 text-[13px] text-ink-2">{d.step}</td>
                  <td className="border-b border-surface-2 px-5 py-3.5 text-[13px] text-ink-3">{d.sla}</td>
                  <td className="border-b border-surface-2 px-5 py-3.5">
                    {d.status === "disponible" ? (
                      <StatusPill tone="success" label="Disponible" />
                    ) : d.status === "encours" ? (
                      <StatusPill tone="warning" label="En cours" />
                    ) : (
                      <StatusPill tone="info" label="Coffre-fort" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FRISE — DOSSIER #GNU-421 */}
      <section id="timeline" className="mx-auto max-w-[1200px] px-8 pb-12">
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Frise — Dossier #GNU-421</h2>
            <p className="mt-1 text-[13px] text-ink-3">Congé académique · suivi des étapes</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning-light px-3 py-1 text-[11px] font-semibold text-warning">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
            En cours
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
                  key={s.title}
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
                      <h3 className="font-display text-base font-bold text-ink">{s.title}</h3>
                      {s.state === "active" && (
                        <span className="inline-flex items-center rounded-full border border-warning/40 bg-warning-light px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
                          Étape actuelle
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[12px] font-medium text-ink-3">{s.date}</div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{s.desc}</p>
                    {s.state === "active" && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-[12px] text-ink-2">
                        <span aria-hidden className="dot-anim inline-flex w-4 justify-between text-warning">
                          <span>•</span><span>•</span><span>•</span>
                        </span>
                        Traitement en cours par le service N1
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
      <section id="vault" className="mx-auto max-w-[1200px] px-8 pb-16">
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Mon coffre-fort documentaire</h2>
            <p className="mt-1 text-[13px] text-ink-3">Documents officiels signés · stockage chiffré</p>
          </div>
          <div className="flex items-center gap-3">
            <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
              {uploading ? "Uploading..." : "Upload Document"}
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
            <a href="#" className="text-[13px] font-medium text-ink hover:underline">Tout télécharger →</a>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userDocs.map((v, i) => (
            <article
              key={v.id}
              className="hover-lift group flex flex-col rounded-xl border border-surface-3 bg-white p-5 fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-info-light text-xl">
                  📄
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{v.filename}</h3>
                  <div className="mt-1 text-[12px] text-ink-3">Digital Vault · GNU</div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-info/30 bg-info-light px-2 py-0.5 text-[10px] font-semibold text-info">
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  AES-256
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-surface-2 pt-3 text-[12px] text-ink-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px]">
                  Encrypted: AES-256
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => handleDownload(v.id, v.filename, v.storage_path)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Download
                </button>
                <button 
                  onClick={() => handleShare(v.id)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-surface-3 bg-white px-3 py-1.5 text-xs font-medium text-ink-2 transition hover:border-ink hover:text-ink"
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                  </svg>
                  Share
                </button>
                <button 
                  onClick={() => handleVerifyQR(v)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-surface-3 bg-white transition hover:border-ink hover:text-ink"
                  title="Verify QR"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z" /></svg>
                </button>
              </div>
            </article>
          ))}

          {loadingDocs && [1, 2].map((_, i) => (
            <article key={i} className="flex flex-col rounded-xl border border-dashed border-surface-3 bg-surface p-5">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-surface-2" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3.5 w-4/5 animate-pulse rounded bg-surface-2" />
                  <div className="h-3 w-2/5 animate-pulse rounded bg-surface-2" />
                </div>
              </div>
              <div className="mt-4 h-px bg-surface-2" />
              <div className="mt-3 flex gap-2">
                <div className="h-7 flex-1 animate-pulse rounded-full bg-surface-2" />
                <div className="h-7 flex-1 animate-pulse rounded-full bg-surface-2" />
              </div>
              <div className="mt-3 text-center text-[11px] font-medium text-ink-3">Synchronisation en cours…</div>
            </article>
          ))}
          
          {!loadingDocs && userDocs.length === 0 && (
            <div className="col-span-full py-12 text-center text-ink-3">
              No documents found in your vault. Request one from E-services.
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-surface-3 px-8 py-8 text-center text-xs text-ink-3">
        © 2025 GNU — Università degli Studi. All documents are PAdES-LTV signed and legally valid in the EU.
      </footer>

      <Chatbot onIntentDetected={handleIntentDetected} />
    </div>
  );
}
