import { useMemo, useState } from "react";
import { useRequests } from "@/hooks/useRequests";

function fmt(ts: number) {
  return new Date(ts).toLocaleString([], { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" });
}

export function TeacherRequestsBell({ teacherName }: { teacherName?: string }) {
  const { requests } = useRequests();
  const [open, setOpen] = useState(false);

  const incoming = useMemo(() => requests.filter((r) => r.status === "transferred" && (!teacherName || !r.assignedTeacher || r.assignedTeacher === teacherName)), [requests, teacherName]);

  return (
    <>
      <button type="button" aria-label="Transferred requests" onClick={() => setOpen((v) => !v)} className="relative grid h-9 w-9 place-items-center rounded-full border border-surface-3 bg-white text-ink-2 transition hover:border-ink hover:bg-surface-2 hover:text-ink">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
        {incoming.length > 0 && (<><span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-white">{incoming.length}</span><span className="absolute right-1 top-1 h-2 w-2 animate-ping rounded-full bg-danger/70" /></>)}
      </button>
      {open && (
        <div className="fixed inset-0 z-[80]" onClick={() => setOpen(false)}>
          <div className="absolute right-4 top-20 w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-surface-3 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-surface-3 bg-surface-2 px-4 py-3">
              <div><div className="font-display text-sm font-bold text-ink">Transferred to you</div><div className="text-[11px] text-ink-3">{incoming.length} request(s) from admin</div></div>
              <button onClick={() => setOpen(false)} className="text-ink-3 hover:text-ink" aria-label="Close">✕</button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {incoming.length === 0 ? (<div className="p-8 text-center text-sm text-ink-3">No transferred requests</div>) : (
                incoming.map((r) => (
                  <div key={r.id} className="border-b border-surface-3 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">{r.type}</span>
                      <span className="text-[11px] text-ink-3">{fmt(r.createdAt)}</span>
                    </div>
                    <div className="mt-1 text-sm font-semibold text-ink">{r.subject}</div>
                    <div className="text-[12px] text-ink-2">From {r.student}</div>
                    {r.assignedTeacher && (<div className="mt-2 inline-flex rounded-full border border-info/40 bg-info-light px-2 py-0.5 text-[10px] font-semibold text-info">Assigned: {r.assignedTeacher}</div>)}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
