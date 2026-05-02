import type { RequestStatus } from "@/data/teacherMockData";

const TONE: Record<RequestStatus | "Validated", string> = {
  Pending:       "border-warning/40 bg-warning-light text-warning",
  Approved:      "border-success/40 bg-success-light text-success",
  Rejected:      "border-danger/40 bg-danger-light text-danger",
  "In Progress": "border-info/40 bg-info-light text-info",
  Validated:     "border-success/40 bg-success-light text-success",
};

const DOT: Record<string, string> = {
  Pending: "bg-warning", Approved: "bg-success", Rejected: "bg-danger",
  "In Progress": "bg-info", Validated: "bg-success",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = TONE[status as keyof typeof TONE] ?? "border-surface-3 bg-surface-2 text-ink-2";
  const dot = DOT[status] ?? "bg-ink-3";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{status}
    </span>
  );
}
