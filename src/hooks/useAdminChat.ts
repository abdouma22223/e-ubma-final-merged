import { useEffect, useState, useCallback } from "react";

export type AdminChatMsg = { id: string; from: "admin" | "teacher"; text: string; time: string; };

const KEY = "ubma:chat:admin-teacher";
const EVT = "ubma:chat:admin:update";

const seed: AdminChatMsg[] = [
  { id: "a1", from: "teacher", text: "Bonjour, j'ai besoin d'accès à un nouveau module.", time: "08:30" },
  { id: "a2", from: "admin",   text: "Bonjour Dr. Boudraa, je m'en occupe.",              time: "08:32" },
  { id: "a3", from: "teacher", text: "Merci beaucoup !",                                   time: "08:33" },
];

function read(): AdminChatMsg[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed; }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AdminChatMsg[]) : seed;
  } catch { return seed; }
}

function write(next: AdminChatMsg[]) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); window.dispatchEvent(new CustomEvent(EVT)); } catch { /* ignore */ }
}

export const nowHM = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function useAdminChat() {
  const [messages, setMessages] = useState<AdminChatMsg[]>(() => read());

  useEffect(() => {
    const sync = () => setMessages(read());
    window.addEventListener("storage", sync);
    window.addEventListener(EVT, sync as EventListener);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener(EVT, sync as EventListener); };
  }, []);

  const send = useCallback((from: AdminChatMsg["from"], text: string) => {
    const t = text.trim();
    if (!t) return;
    const next: AdminChatMsg[] = [...read(), { id: `am-${Date.now()}`, from, text: t, time: nowHM() }];
    write(next); setMessages(next);
  }, []);

  return { messages, send };
}
