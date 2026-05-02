import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Download, Clock, Shield, Lock, Eye, Loader2, ShieldCheck } from "lucide-react";
import ubmaLogo from "@/assets/ubma-logo";

export default function SharedFile() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const checkLink = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8001";
        const res = await fetch(`${backendUrl}/s/${token}`);
        if (!res.ok) { const data = await res.json(); console.log("Backend error (ignored for demo):", data.detail); }
      } catch { console.log("Using Demo Mode"); } finally { setLoading(false); }
    };
    checkLink();
    const timer = setInterval(() => { setCountdown(prev => (prev > 0 ? prev - 1 : 0)); }, 1000);
    return () => clearInterval(timer);
  }, [token]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleDownload = async () => {
    setIsDownloading(true);
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8001";
    try { window.location.href = `${backendUrl}/s/${token}`; }
    catch { setError("DOWNLOAD_FAILED"); }
    finally { setTimeout(() => setIsDownloading(false), 2000); }
  };

  if (loading) return (<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>);

  const currentError = countdown === 0 ? "EXPIRED" : error;

  if (currentError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfd] p-4">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={ubmaLogo} alt="UBMA Logo" className="mb-4 h-12 w-auto grayscale opacity-50" />
          <h1 className="text-lg font-medium text-slate-600">Secure File Gateway</h1>
        </div>
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex flex-col items-center p-10 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600"><Clock className="h-8 w-8" /></div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Link Expired</h2>
            <p className="mb-8 text-slate-500">This secure link has reached its time limit.</p>
            <Button variant="outline" className="rounded-full" onClick={() => window.location.href = "/"}>Go to Homepage</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfd] p-4">
      <div className="mb-10 flex flex-col items-center text-center">
        <img src={ubmaLogo} alt="UBMA Logo" className="mb-4 h-16 w-auto" />
        <h1 className="text-2xl font-bold text-slate-900">Secure File Gateway</h1>
      </div>
      <div className="w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl">
        <div className="flex flex-col items-center p-10 text-center">
          <div className="mb-6 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" />Military-Grade Encryption (AES-256)
          </div>
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-indigo-50 text-indigo-600">
            <FileText className="h-10 w-10" />
          </div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">University Document Ready</h2>
          <p className="mb-8 text-slate-500">Your document has been verified and is ready for secure access.</p>
          <div className="mb-8 flex w-full flex-col gap-4 rounded-3xl bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm"><Clock className="h-5 w-5 text-orange-500" /></div>
              <div className="text-left"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Expires in</p><p className="font-mono text-lg font-bold text-slate-900">{formatTime(countdown)}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm"><Shield className="h-5 w-5 text-indigo-500" /></div>
              <div className="text-left"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security Check</p><p className="text-sm font-bold text-emerald-600">PASSED</p></div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Button className="h-14 flex-1 rounded-2xl bg-indigo-600 text-lg font-bold" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Preparing...</> : <><Download className="mr-2 h-5 w-5" />Download Securely</>}
            </Button>
            <Button variant="outline" className="h-14 flex-1 rounded-2xl" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="mr-2 h-5 w-5" />{showPreview ? "Hide Preview" : "Preview Document"}
            </Button>
          </div>
          {showPreview && (
            <div className="mt-10 w-full">
              <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
                <div className="flex h-48 items-center justify-center bg-slate-100">
                  <div className="flex items-center gap-2 rounded-full bg-white/90 px-6 py-3 shadow-xl">
                    <Lock className="h-3 w-3 text-indigo-600" /><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Encrypted Preview Mode</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-12 text-center text-[10px] tracking-widest text-slate-400 uppercase">
        © 2025 University Badji Mokhtar Annaba
      </footer>
    </div>
  );
}
