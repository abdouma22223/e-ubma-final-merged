
import { Link } from "react-router-dom";
import { Chatbot } from "@/components/Chatbot";
import ubmaLogo from "@/assets/ubma-logo.png";
import avatarStudent from "@/assets/avatar-student.png";
import avatarTeacher from "@/assets/avatar-teacher.png";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "../supabaseClient";
import axios from "axios";

type SpaceMode = "student" | "teacher";

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

const navLinks = ["Dashboard", "E-services", "My Documents", "Open Badges", "Digital Vault"];

const stats = [
  { num: "3", label: "Documents ready" },
  { num: "7", label: "Open Badges earned" },
  { num: "12", label: "Vault items" },
  { num: "100%", label: "PAdES signed" },
];

const services = [
  { icon: "📋", name: "School Certificate", desc: "Digitally signed PDF, ready in under 5 minutes." },
  { icon: "📊", name: "Academic Transcript", desc: "Official grades with PAdES-LTV signature." },
  { icon: "🏅", name: "Open Badges", desc: "Verifiable credentials using OB 3.0 standard." },
  { icon: "🔐", name: "Digital Vault", desc: "Store and share documents with QR verification." },
  { icon: "✏️", name: "Enrollment Certificate", desc: "Official proof of active student enrollment." },
  { icon: "📬", name: "Delivery Request", desc: "Request physical copies sent by post." },
];

const demarches = [
  { ref: "#GNU-421", title: "Congé académique", step: "N1 instruit", sla: "J-7", status: "encours" },
  { ref: "#GNU-398", title: "Attestation scolarité", step: "Généré", sla: "Prêt", status: "disponible" },
  { ref: "#GNU-356", title: "Relevé de notes S1", step: "Archivé", sla: "OK", status: "coffre" },
  { ref: "#GNU-342", title: "Demande de stage", step: "N2 validation", sla: "J-3", status: "encours" },
];

const timeline = [
  {
    title: "Soumission",
    date: "12 avril 2025 · 09:14",
    desc: "Demande déposée par l'étudiant via le portail GNU.",
    state: "done" as const,
  },
  {
    title: "Réception par le département",
    date: "13 avril 2025 · 10:02",
    desc: "Dossier réceptionné et assigné au service de scolarité.",
    state: "done" as const,
  },
  {
    title: "Instruction en cours",
    date: "Aujourd'hui",
    desc: "Vérification administrative par le responsable N1.",
    state: "active" as const,
  },
  {
    title: "Décision finale",
    date: "En attente",
    desc: "Validation par le Doyen de la faculté.",
    state: "pending" as const,
  },
];

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

const BACKEND_URL = "http://localhost:8005"; 

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

      const formData = new FormData();
      formData.append("file", file);
      const encryptRes = await axios.post(`${BACKEND_URL}/api/crypto/encrypt`, formData, {
        responseType: "blob",
      });

      const fileName = `${Date.now()}_${file.name}.enc`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("vault")
        .upload(fileName, encryptRes.data);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("documents").insert({
        filename: file.name,
        storage_path: uploadData.path,
        mimetype: file.type,
        is_encrypted: true,
        owner_id: userId || 'anonymous',
        status: 'validated'
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

  const handleShare = async (docId: string) => {
    try {
      const { data, error } = await supabase.from("documents").select("storage_path").eq("id", docId).single();
      if (error) throw error;

      const { data: shareData, error: shareError } = await supabase.storage
        .from("vault")
        .createSignedUrl(data.storage_path, 86400); 

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
      const { error } = await supabase.from("documents").insert({
        owner_id: userId || 'anonymous',
        name: serviceName,
        status: 'pending'
      });
      if (error) throw error;
      toast.success(`Request for ${serviceName} submitted successfully!`);
    } catch (err) {
      toast.error("Failed to submit request");
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-40 flex h-[80px] items-center gap-8 border-b border-surface-3 bg-white/85 px-8 backdrop-blur-md">
        <a href="#" className="flex shrink-0 items-center gap-3 group">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white p-1.5 shadow-[0_6px_16px_-4px_rgba(0,0,0,.25),0_0_0_3px_white,0_0_0_4px_color-mix(in_oklab,var(--ink)_25%,transparent)] ring-1 ring-surface-3 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
            <img src={ubmaLogo} alt="UBMA" className="h-full w-full object-contain" />
          </div>
          <div className="hidden flex-col leading-tight md:flex">
            <span dir="rtl" className="font-display text-[13px] font-bold text-ink">جامعة باجي مختار - عنابة</span>
            <span className="font-display text-[12px] font-semibold text-ink">Badji Mokhtar University · Annaba</span>
          </div>
        </a>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/profile" className="group/avatar relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-ink ring-2 ring-transparent transition-all duration-300 hover:scale-110">
            <img src={mode === "teacher" ? avatarTeacher : avatarStudent} alt="avatar" className="h-full w-full object-cover" />
          </Link>
        </div>
      </nav>

      <header className="mx-auto grid max-w-[1200px] items-center gap-12 px-8 py-16 lg:grid-cols-[1fr_360px]">
        <div className="fade-up">
          <h1 className="font-display text-[clamp(2.2rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
            Your academic documents reimagined.
          </h1>
          <p className="mt-5 max-w-[480px] text-base leading-relaxed text-ink-2">
            Request, manage, and share certified documents, Open Badges, and e-signatures — all in one secure place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#services" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5">
              Request a document
            </a>
          </div>
        </div>
      </header>

      <section id="services" className="mx-auto max-w-[1200px] px-8 pb-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink mb-6">E-services</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <button key={s.name} onClick={() => handleRequest(s.name)} className="hover-lift group flex w-full flex-col gap-3 rounded-xl border border-surface-3 bg-white p-6 text-left">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-surface-2 text-xl">{s.icon}</div>
              <div className="font-semibold text-sm text-ink">{s.name}</div>
              <div className="text-[13px] text-ink-3">{s.desc}</div>
            </button>
          ))}
        </div>
      </section>

      <section id="vault" className="mx-auto max-w-[1200px] px-8 pb-16">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink mb-6">Digital Vault</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userDocs.map((v, i) => (
            <article key={v.id} className="hover-lift group flex flex-col rounded-xl border border-surface-3 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-info-light text-xl">📄</div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-semibold text-ink">{v.filename || v.name}</h3>
                  <div className="mt-1 text-[12px] text-ink-3">Status: {v.status}</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {v.storage_path && (
                  <button onClick={() => handleDownload(v.id, v.filename, v.storage_path)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">
                    Download
                  </button>
                )}
                <button onClick={() => handleVerifyQR(v)} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-surface-3 bg-white">
                   QR
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Chatbot />
    </div>
  );
}
