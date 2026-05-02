import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Chatbot } from "@/components/Chatbot";
import ubmaLogo from "@/assets/ubma-logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const EN = "Welcome to the University Space of Badji Mokhtar Annaba";
const AR = "مرحبا بك في فضاء جامعة باجي مختار عنابة";

function useTypewriter(text: string, speed = 45, startDelay = 0) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut("");
    setDone(false);
    let i = 0;
    const start = window.setTimeout(() => {
      const id = window.setInterval(() => {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          window.clearInterval(id);
          setDone(true);
        }
      }, speed);
    }, startDelay);
    return () => window.clearTimeout(start);
  }, [text, speed, startDelay]);
  return { out, done };
}

function Welcome() {
  const en = useTypewriter(EN, 18, 400);
  const ar = useTypewriter(AR, 32, 400 + EN.length * 18 + 200);
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(60% 50% at 20% 10%, color-mix(in oklab, var(--ink) 14%, transparent), transparent 60%), radial-gradient(50% 40% at 85% 90%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 60%)",
        }}
      />
      <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
        <LanguageSwitcher />
      </div>
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-10 grid place-items-center">
          <img
            src={ubmaLogo}
            alt="UBMA Logo"
            className="h-32 w-32 rounded-full bg-white object-contain p-3 shadow-xl md:h-40 md:w-40"
          />
        </div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-ink-3">
          {t("welcome.tagline")}
        </p>
        <h1 className="font-display text-3xl font-bold leading-tight text-ink md:text-5xl lg:text-6xl">
          {en.out}
        </h1>
        <h2 className="mt-6 font-display text-2xl font-bold leading-tight text-ink-2 md:text-4xl lg:text-5xl">
          {ar.out}
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-sm text-ink-3 md:text-base">
          {t("welcome.subtitle")}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/login" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-lg">
            {t("welcome.cta.enter")} →
          </Link>
          <a href="https://www.univ-annaba.dz" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-surface-3 bg-white/70 px-6 py-3 text-sm font-semibold text-ink">
            {t("welcome.cta.about")}
          </a>
        </div>
      </main>
      <Chatbot />
    </div>
  );
}

export default Welcome;
