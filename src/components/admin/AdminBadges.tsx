import { cn } from "@/lib/utils";
import type { UserRole, UserStatus, RequestStatus, DocumentStatus } from "@/data/adminMockData";

const base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset whitespace-nowrap";

export function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, string> = {
    student: "bg-info-light text-info ring-info/30",
    teacher: "bg-warning-light text-warning-foreground ring-warning/40",
    admin:   "bg-ink/10 text-ink ring-ink/25",
  };
  const label = role[0].toUpperCase() + role.slice(1);
  return <span className={cn(base, map[role])}>{label}</span>;
}

export function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, string> = {
    active:   "bg-success-light text-success ring-success/30",
    inactive: "bg-surface-2 text-ink-3 ring-surface-3",
  };
  const label = status === "active" ? "Active" : "Inactive";
  return (
    <span className={cn(base, map[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "active" ? "bg-success" : "bg-ink-3")} />
      {label}
    </span>
  );
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const map: Record<RequestStatus, { cls: string; label: string }> = {
    pending:     { cls: "bg-warning-light text-warning-foreground ring-warning/40", label: "Pending" },
    in_progress: { cls: "bg-info-light text-info ring-info/30",                    label: "In Progress" },
    approved:    { cls: "bg-success-light text-success ring-success/30",           label: "Approved" },
    rejected:    { cls: "bg-danger-light text-danger ring-danger/30",              label: "Rejected" },
  };
  return <span className={cn(base, map[status].cls)}>{map[status].label}</span>;
}

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const map: Record<DocumentStatus, { cls: string; label: string }> = {
    valid:   { cls: "bg-success-light text-success ring-success/30",           label: "Valid" },
    pending: { cls: "bg-warning-light text-warning-foreground ring-warning/40", label: "Pending" },
    flagged: { cls: "bg-danger-light text-danger ring-danger/30",              label: "Flagged" },
  };
  return <span className={cn(base, map[status].cls)}>{map[status].label}</span>;
}
