import { Link } from "react-router-dom";
import { User, WifiOff, ShieldCheck, FileText, GraduationCap, Globe, Download, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import ubmaLogo from "@/assets/ubma-logo";

const vault = [
  { Icon: FileText,      nameKey: "student.vault.v1.name", dateKey: "student.vault.v1.date", sourceKey: "student.vault.v1.source", signature: "PAdES-LTV" },
  { Icon: GraduationCap, nameKey: "student.vault.v2.name", dateKey: "student.vault.v2.date", sourceKey: "student.vault.v2.source", signature: "PAdES" },
  { Icon: Globe,         nameKey: "student.vault.v3.name", dateKey: "student.vault.v3.date", sourceKey: "student.vault.v3.source", signature: "PAdES-LTV" },
];

export default function OfflinePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-surface-3 bg-white/90 px-6 backdrop-blur-md">
        <img src={ubmaLogo} alt="UBMA" className="h-9 w-9 rounded-lg bg-white object-contain p-1 ring-1 ring-surface-3" />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate font-display text-sm font-bold text-ink">{t("offline.title" as any)}</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-3"><WifiOff className="h-3 w-3" />{t("offline.subtitle" as any)}</span>
        </div>
        <div className="ms-auto flex items-center gap-3">
          <LanguageSwitcher />
          <Link to="/" className="rounded-full border border-surface-3 px-4 py-1.5 text-[13px] font-medium text-ink-2 transition hover:border-ink hover:bg-surface-2 hover:text-ink">{t("common.back_home" as any)}</Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning-light px-4 py-3 text-[13px] text-warning">
          <WifiOff className="mt-0.5 h-4 w-4 shrink-0" /><p>{t("offline.notice" as any)}</p>
        </div>
        <section className="mb-10">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{t("common.profile" as any)}</h1>
          <div className="mt-5 flex items-center gap-5 rounded-2xl border border-surface-3 bg-white p-6 shadow-sm">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-surface-2 text-ink"><User className="h-8 w-8" /></div>
            <div className="flex min-w-0 flex-col">
              <span className="font-display text-xl font-bold text-ink">Amine Amara</span>
              <span className="text-sm text-ink-3">{t("student.card.major" as any)}</span>
            </div>
          </div>
        </section>
        <section>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">{t("student.section.vault" as any)}</h2>
            <span className="text-[12px] text-ink-3">{t("offline.cached" as any)}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vault.map((v) => {
              const Icon = v.Icon;
              return (
                <article key={v.nameKey} className="flex flex-col rounded-xl border border-surface-3 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-info-light text-info"><Icon className="h-5 w-5" /></div>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{t(v.nameKey as any)}</h3>
                      <div className="mt-1 text-[12px] text-ink-3">{t(v.sourceKey as any)}</div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-info/30 bg-info-light px-2 py-0.5 text-[10px] font-semibold text-info"><ShieldCheck className="h-3 w-3" />{v.signature}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-surface-2 pt-3 text-[12px] text-ink-3">
                    <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" />{t(v.dateKey as any)}</span>
                  </div>
                  <div className="mt-3">
                    <button type="button" className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90">
                      <Download className="h-3 w-3" />PDF
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
