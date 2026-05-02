import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, ArrowLeft, Building2 } from "lucide-react";

function HelpPage() {
  const { lang } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Link to={-1 as any} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-3 hover:text-ink transition-colors"><ArrowLeft className="h-4 w-4" />Back</Link>
      <div className="glass-card overflow-hidden rounded-[24px] border border-surface-3 bg-white/40 p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white shadow-lg shadow-ink/20"><Building2 className="h-6 w-6" /></div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink">{lang === "ar" ? "مركز المساعدة والتواصل" : "Aide & Contact"}</h1>
            <p className="text-sm text-ink-3">Université Badji Mokhtar - Annaba</p>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="rounded-2xl border border-surface-3 bg-white p-6">
            <div className="mb-4 flex items-center gap-3 text-ink"><Mail className="h-5 w-5" /><h2 className="font-bold">Support Email</h2></div>
            <div className="space-y-2">
              <a href="mailto:contact@univ-annaba.dz" className="block text-sm font-medium text-ink-2 hover:text-ink hover:underline">contact@univ-annaba.dz</a>
              <a href="mailto:support.etudiant@univ-annaba.dz" className="block text-sm font-medium text-ink-2 hover:text-ink hover:underline">support.etudiant@univ-annaba.dz</a>
            </div>
          </div>
          <div className="rounded-2xl border border-surface-3 bg-white p-6">
            <div className="mb-4 flex items-center gap-3 text-ink"><Phone className="h-5 w-5" /><h2 className="font-bold">Ligne Fixe</h2></div>
            <p className="text-sm font-medium text-ink-2">+213 (0) 38 87 19 89</p>
            <p className="mt-1 text-[11px] text-ink-3">Disponible Dim-Jeu, 08:30 - 16:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HelpPage;
