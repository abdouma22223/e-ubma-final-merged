import { useLanguage, type Lang } from "@/contexts/LanguageContext";

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "DZ" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className={`inline-flex items-center gap-1 rounded-full border border-surface-3 bg-white/80 p-1 shadow-sm backdrop-blur ${className}`}
    >
      {OPTIONS.map((opt) => {
        const active = lang === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => setLang(opt.code)}
            aria-pressed={active}
            className={`inline-flex items-center justify-center rounded-md px-2.5 py-1 text-[11px] font-bold transition ${
              active
                ? "bg-ink text-white shadow"
                : "text-ink-3 hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {opt.label === "DZ" ? "AR" : opt.label}
          </button>
        );
      })}
    </div>
  );
}
