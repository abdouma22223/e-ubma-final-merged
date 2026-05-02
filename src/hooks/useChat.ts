import { useEffect, useState, useCallback } from "react";

export type ChatMsg = { id: string; from: "student" | "teacher"; text: string; time: string; };

const KEY = "ubma:chat:student-teacher";
const EVT = "ubma:chat:update";

const seed: ChatMsg[] = [
  { id: "m1", from: "teacher", text: "Bonjour Amine, comment puis-je vous aider ?", time: "09:14" },
  { id: "m2", from: "student", text: "Bonjour, j'ai une question sur le devoir.",   time: "09:15" },
  { id: "m3", from: "teacher", text: "Bien sûr, je vous écoute.",                    time: "09:16" },
];

function read(): ChatMsg[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed; }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ChatMsg[]) : seed;
  } catch { return seed; }
}

function write(next: ChatMsg[]) {
  try { localStorage.setItem(KEY, JSON.stringify(next)); window.dispatchEvent(new CustomEvent(EVT)); } catch { /* ignore */ }
}

export const nowHM = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function useChat() {
  const [messages, setMessages] = useState<ChatMsg[]>(() => read());

  useEffect(() => {
    const sync = () => setMessages(read());
    window.addEventListener("storage", sync);
    window.addEventListener(EVT, sync as EventListener);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener(EVT, sync as EventListener); };
  }, []);

  const send = useCallback((from: ChatMsg["from"], text: string) => {
    const t = text.trim();
    if (!t) return;
    const next: ChatMsg[] = [...read(), { id: `m-${Date.now()}`, from, text: t, time: nowHM() }];
    write(next); setMessages(next);
  }, []);

  const reset = useCallback(() => { write(seed); setMessages(seed); }, []);

  return { messages, send, reset };
}
