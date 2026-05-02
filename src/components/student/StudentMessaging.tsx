import { useState, useRef, useEffect } from "react";
import { quickReplies } from "@/data/teacherMockData";
import { useChat } from "@/hooks/useChat";

export function StudentMessaging() {
  const { messages, send } = useChat();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const submit = (text: string) => { send("student", text); setDraft(""); };

  return (
    <section id="messaging" className="mx-auto max-w-[1200px] px-8 pb-16">
      <div className="mb-6"><h2 className="font-display text-2xl font-bold tracking-tight text-ink">Messaging</h2><p className="mt-1 text-[13px] text-ink-3">Quick chat with your teachers · live</p></div>
      <div className="rounded-2xl border border-surface-3 bg-white p-5 md:p-6">
        <div className="flex flex-col gap-3">
          <div className="h-64 overflow-y-auto rounded-xl border border-surface-3 bg-surface p-3">
            <div className="flex flex-col gap-2.5">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "student" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed ${m.from === "student" ? "rounded-br-md bg-ink text-white" : "rounded-bl-md border border-surface-3 bg-white text-ink"}`}>
                    <div>{m.text}</div>
                    <div className={`mt-1 text-[10px] ${m.from === "student" ? "text-white/70" : "text-ink-3"}`}>{m.time}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickReplies.map((q) => (<button key={q} onClick={() => submit(q)} className="rounded-full border border-surface-3 bg-white px-3 py-1 text-[11px] font-medium text-ink-2 transition hover:border-ink hover:text-ink">{q}</button>))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); submit(draft); }} className="flex gap-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-xl border-[1.5px] border-surface-3 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink" />
            <button type="submit" className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">Send</button>
          </form>
        </div>
      </div>
    </section>
  );
}
