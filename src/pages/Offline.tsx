import { Link } from "react-router-dom";
import { 
  WifiOff, 
  FileText, 
  Download, 
  RefreshCw, 
  ChevronRight,
  ShieldCheck,
  Lock,
  ArrowLeft
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { UBMA_LOGO as ubmaLogo } from "@/assets/images";

type VaultEntry = {
  Icon: typeof FileText;
  title: string;
  id: string;
  size: string;
  date: string;
};

const cachedVault: VaultEntry[] = [
  { id: '1', title: "Certificat de Scolarité 2023/2024", size: "450 KB", date: "Oct 12, 2023", Icon: FileText },
  { id: '2', title: "Relevé de Notes - Semestre 1", size: "1.2 MB", date: "Feb 05, 2024", Icon: FileText },
];

function OfflinePage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-black/5">
      <nav className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <img src={ubmaLogo} alt="Logo" className="h-8 w-8 rounded-full" />
            <div className="h-4 w-px bg-black/10" />
            <span className="font-display text-sm font-bold uppercase tracking-widest text-black">
              Offline Access
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black">
              <ArrowLeft className="h-4 w-4" />
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-orange-500 shadow-sm">
            <WifiOff className="h-10 w-10" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-black sm:text-5xl">
            {t('offlineTitle')}
          </h1>
          <p className="mt-4 max-w-lg text-lg text-black/40">
            {t('offlineDescription')}
          </p>
        </div>

        <div className="space-y-4">
           {/* Offline content */}
        </div>
      </main>
    </div>
  );
}

export default OfflinePage;
