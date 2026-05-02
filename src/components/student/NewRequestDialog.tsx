import { useState } from "react";
import { useRequests } from "@/hooks/useRequests";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send } from "lucide-react";

const REQUEST_TYPES = ["Certificate of enrollment", "Transcript", "Open badge issuance", "Document re-delivery", "Other"];

export function NewRequestDialog({ open, onOpenChange, studentName = "Amine Amara" }: { open: boolean; onOpenChange: (v: boolean) => void; studentName?: string; }) {
  const { create } = useRequests();
  const [type, setType] = useState(REQUEST_TYPES[0]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      create({ type, subject: "N/A", message: "Requested via portal", student: studentName });
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setType(REQUEST_TYPES[0]); onOpenChange(false); }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-ink/50 p-4 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
      <div className="w-full max-w-md rounded-2xl border border-surface-3 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-ink">{lang === "ar" ? "طلب وثيقة جديد" : "New Request"}</h3>
            <p className="mt-1 text-[12px] text-ink-3">{lang === "ar" ? "سيتم إرسال طلبك للإدارة للمراجعة" : "Sent to the administration · you will be notified when reviewed."}</p>
          </div>
          <button type="button" aria-label="Close" onClick={() => onOpenChange(false)} className="grid h-8 w-8 place-items-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-ink">✕</button>
        </div>
        {submitted ? (
          <div className="rounded-xl border border-warning/40 bg-warning-light p-5 text-center">
            <h4 className="text-base font-bold text-warning">{lang === "ar" ? "تم إرسال الطلب للإدارة!" : "Request Sent to Admin!"}</h4>
            <p className="mt-1 text-xs text-warning/80">{lang === "ar" ? "طلبك قيد المراجعة" : "Your request is under review."}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">{lang === "ar" ? "نوع الوثيقة" : "Document Type"}</span>
              <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-surface-3 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-ink">
                {REQUEST_TYPES.map((t) => (<option key={t}>{t}</option>))}
              </select>
            </label>
            <div className="mt-2 flex justify-end gap-2">
              <button type="button" onClick={() => onOpenChange(false)} className="rounded-full border border-surface-3 bg-white px-5 py-2 text-[13px] font-medium text-ink-2 hover:border-ink hover:text-ink transition-all">{lang === "ar" ? "إلغاء" : "Cancel"}</button>
              <Button type="submit" disabled={loading} className="rounded-full bg-ink px-6 py-5 text-[14px] font-bold text-white">
                <Send className="mr-2 h-4 w-4" />{lang === "ar" ? "إرسال الطلب الآن" : "Send Request Now"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
