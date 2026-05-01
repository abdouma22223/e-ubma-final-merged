import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiChat } from "@/lib/api";

type Msg = { role: "bot" | "user"; html: string };

// Localized suggestion prompts
const SUGGESTIONS_BY_LANG: Record<string, string[]> = {
  ar: [
    "كيف أستخرج شهادة التسجيل؟",
    "اشرح لي الخزنة الرقمية",
    "ما هو توقيع PAdES؟",
    "كيف أتحقق من وثيقتي؟",
  ],
  fr: [
    "Comment extraire mon attestation de scolarité?",
    "Vérifier mon Open Badge",
    "C'est quoi la signature PAdES?",
    "Comment utiliser le Coffre-fort?",
  ],
  en: [
    "How to extract my school certificate?",
    "Verify my Open Badge",
    "What is PAdES signature?",
    "Check Digital Vault QR code",
  ],
};

const WELCOME_BY_LANG: Record<string, string> = {
  ar: "مرحباً، أنا <strong>مساعد GNU الذكي</strong>، مساعدك الأكاديمي في جامعة باجي مختار. كيف يمكنني مساعدتك اليوم؟",
  fr: "Bonjour, je suis <strong>GNU Assistant</strong>, votre guide IA pour les documents, badges et e-services. Comment puis-je vous aider?",
  en: "Hi, I'm <strong>GNU Assistant</strong>, your AI guide for documents, badges and e-services. How can I help today?",
};

// Fallback hardcoded responses when backend is offline
const OFFLINE_RESPONSES: Record<string, string> = {
  "How to extract my school certificate?":
    "To get your <strong>school certificate</strong>:<br/><br/>1. Go to <em>E-services → Request School Certificate</em>.<br/>2. Pick the academic year and language.<br/>3. Submit — the registrar signs it digitally (PAdES).<br/>4. Download from <em>My Documents</em> with an embedded QR code for verification.<br/><br/>Average processing time: under 5 minutes ⚡",
  "Verify my Open Badge":
    "Each <strong>Open Badge</strong> is cryptographically issued and verifiable. Go to <em>Open Badges → Select badge → Verify</em>, or share its public URL.",
  "What is PAdES signature?":
    "<strong>PAdES</strong> (PDF Advanced Electronic Signature) is an EU-standard digital signature embedded in PDFs. It guarantees:<br/><br/>• <strong>Authenticity</strong><br/>• <strong>Integrity</strong><br/>• <strong>Long-term validity</strong><br/><br/>All GNU documents are PAdES-LTV signed.",
  "Check Digital Vault QR code":
    "Every document in your <strong>Digital Vault</strong> carries a unique QR code. Scan it with any phone — it opens a public verification page showing the issuer, date, and signature status in real time.",
};

type ChatbotProps = {
  defaultOpen?: boolean;
  inline?: boolean;
  onAction?: (action: { type: string; payload?: any }) => void;
};

export function Chatbot({ defaultOpen = false, inline = false, onAction }: ChatbotProps = {}) {
  const { dir, lang } = useLanguage();
  const isRtl = dir === "rtl";
  const langRef = useRef(lang);

  const [open, setOpen] = useState(defaultOpen || inline);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", html: WELCOME_BY_LANG[lang] ?? WELCOME_BY_LANG["fr"] },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only reset welcome if language changes AND no user messages yet
  useEffect(() => {
    if (langRef.current !== lang) {
      langRef.current = lang;
      setMsgs((prev) => {
        const hasUserMessages = prev.some((m) => m.role === "user");
        if (!hasUserMessages) {
          setShowSuggestions(true);
          return [{ role: "bot", html: WELCOME_BY_LANG[lang] ?? WELCOME_BY_LANG["fr"] }];
        }
        return prev;
      });
    }
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t) return;

    setMsgs((m) => [...m, { role: "user", html: t }]);
    setInput("");
    setShowSuggestions(false);
    setTyping(true);

    // Build user context from localStorage
    const userContext = {
      ui_language: lang,
      user_id: localStorage.getItem("user_id") || "anonymous",
      user_name: localStorage.getItem("user_name") || "",
      user_major: localStorage.getItem("user_major") || "",
      user_role: localStorage.getItem("user_role") || "student",
    };

    try {
      const response = await apiChat(t, userContext.user_id, userContext);

      const reply = response.reply || "...";
      const htmlReply = reply.replace(/\n/g, "<br/>");

      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", html: htmlReply }]);

      // Handle agentic intents
      const intentData = response.intent_detected;
      if (intentData) {
        if (intentData.intent === "navigate") {
          const dest = intentData.destination;
          const currentRole = localStorage.getItem("user_role") || "student";
          const baseRoute = currentRole === "admin" ? "/admin-space" : currentRole === "professor" ? "/teacher-space" : "/student-space";
          
          const routeMap: Record<string, string> = {
            vault: baseRoute,
            home: baseRoute,
            badges: baseRoute,
            eservices: baseRoute,
          };
          if (dest && routeMap[dest]) {
            setTimeout(() => { window.location.href = routeMap[dest]; }, 1500);
          }
        } else if (intentData.intent === "request_document" || intentData.intent === "fill_form") {
          if (onAction) {
            onAction({ type: "OPEN_REQUEST_DIALOG", payload: intentData.fields });
          }
        }
      }
    } catch {
      setTyping(false);
      // Offline fallback — try hardcoded responses
      const offlineReply = OFFLINE_RESPONSES[t] ||
        (lang === "ar"
          ? "عذراً، الخادم غير متاح حالياً. تأكد من تشغيل الـ Backend على المنفذ 8001."
          : lang === "fr"
            ? "Désolé, le serveur IA est indisponible. Vérifiez que le Backend tourne sur le port 8001."
            : "Sorry, the AI server is unreachable. Make sure the Backend is running on port 8001.");
      setMsgs((m) => [...m, { role: "bot", html: offlineReply }]);
    }
  };

  const suggestions = SUGGESTIONS_BY_LANG[lang] ?? SUGGESTIONS_BY_LANG["fr"];
  const placeholder = lang === "ar" ? "اكتب سؤالك هنا…" : lang === "fr" ? "Posez votre question…" : "Ask something…";

  return (
    <>
      {!inline && (
        <div className={`group fixed bottom-6 z-50 flex items-center gap-3 ${isRtl ? "left-6 flex-row-reverse" : "right-6"}`}>
          <span
            className={`pointer-events-none whitespace-nowrap rounded-full border border-surface-3 bg-white px-3 py-1.5 font-display text-xs font-semibold text-ink shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ${isRtl ? "-translate-x-3" : "translate-x-3"}`}
          >
            <span className="mx-2 inline-block h-1.5 w-1.5 rounded-full bg-ink align-middle" />
            {lang === "ar" ? "مساعد الذكاء الاصطناعي" : lang === "fr" ? "Assistant IA GNU" : "AI Chat Bot Assistant"}
          </span>
          <button
            aria-label="Open GNU Assistant"
            onClick={() => setOpen((o) => !o)}
            className={`grid h-14 w-14 place-items-center rounded-full bg-ink text-white shadow-[0_8px_28px_-4px_rgba(0,0,0,.35)] transition-transform duration-300 pulse-ring ${open ? "rotate-45" : "hover:scale-110"}`}
          >
            {open ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            )}
          </button>
        </div>
      )}

      <div
        role="dialog"
        aria-label="GNU AI Assistant"
        className={
          inline
            ? "glass-card relative mx-auto flex h-[560px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white/40 shadow-[0_16px_60px_-12px_rgba(0,0,0,.18)] backdrop-blur-xl"
            : `glass-card fixed bottom-24 z-40 flex h-[560px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl bg-white/40 shadow-[0_16px_60px_-12px_rgba(0,0,0,.18)] backdrop-blur-xl transition-all duration-300 ${isRtl ? "left-6 origin-bottom-left" : "right-6 origin-bottom-right"} ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-90 translate-y-4 pointer-events-none"}`
        }
      >
        <div className="flex flex-shrink-0 items-center gap-3 bg-ink px-4 py-3 text-white">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20 float">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="3" /><path d="M12 8V4M8 4h8M8 14h.01M16 14h.01M9 18h6" /></svg>
          </div>
          <div className="flex-1">
            <div className="font-display text-sm font-bold">GNU Assistant</div>
            <div className="flex items-center gap-1.5 text-[11px] text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" /> Online · Groq AI
            </div>
          </div>
          {!inline && <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-7 w-7 place-items-center rounded-md text-white/80 hover:bg-white/15">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>}
        </div>

        <div ref={scrollRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-surface-2 p-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex max-w-[88%] flex-col gap-1 ${m.role === "user" ? "self-end items-end" : "self-start items-start"} fade-up`} style={{ animationDuration: ".35s" }}>
              <div
                className={`px-3.5 py-2.5 text-[13.5px] leading-snug rounded-2xl ${m.role === "user" ? "bg-ink text-white rounded-br-sm" : "bg-white border border-surface-3 text-ink rounded-bl-sm"}`}
                dangerouslySetInnerHTML={{ __html: m.html }}
              />
            </div>
          ))}
          {typing && (
            <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-sm border border-surface-3 bg-white px-4 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-ink-3" style={{ animation: "blink 1.2s infinite" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-ink-3" style={{ animation: "blink 1.2s infinite", animationDelay: ".2s" }} />
              <span className="h-1.5 w-1.5 rounded-full bg-ink-3" style={{ animation: "blink 1.2s infinite", animationDelay: ".4s" }} />
            </div>
          )}
        </div>

        {showSuggestions && (
          <div className="flex flex-wrap gap-1.5 bg-surface-2 px-4 pt-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-surface-3 bg-white px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:border-ink hover:text-ink"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex flex-shrink-0 items-center gap-2 border-t border-surface-2 bg-white px-3.5 py-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-full border-[1.5px] border-surface-3 bg-surface-2 px-4 py-2 text-[13.5px] text-ink outline-none transition-colors focus:border-ink focus:bg-white"
          />
          <button type="submit" aria-label="Send" className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-ink text-white transition hover:opacity-85 hover:scale-110">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
        </form>
      </div>
    </>
  );
}
