import { useState, useEffect } from "react";
import { Activity, UserPlus, FileCheck2, FileText, Server, Lock } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { apiAdminGetActivityLogs } from "@/lib/api";

const ICONS: Record<string, { icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  user:     { icon: UserPlus,   cls: "bg-info-light text-info" },
  request:  { icon: FileCheck2, cls: "bg-success-light text-success" },
  document: { icon: FileText,   cls: "bg-warning-light text-warning-foreground" },
  system:   { icon: Server,     cls: "bg-surface-2 text-ink-2" },
  auth:     { icon: Lock,       cls: "bg-danger-light text-danger" },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMin = Math.round((now.getTime() - d.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function ActivityLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try { const data = await apiAdminGetActivityLogs(); setLogs(data); }
    catch (error) { console.error("Failed to fetch logs", error); }
    finally { setLoading(false); }
  };

  if (loading) return <div>Loading activity logs...</div>;

  return (
    <SectionCard id="activity" title="System Monitoring" description="Recent activity across users, requests, documents and security." icon={<Activity className="h-5 w-5" />}>
      <ol className="relative ml-2 space-y-4 border-l border-surface-3 pl-5">
        {logs.map((e) => {
          const { icon: Icon, cls } = ICONS[e.action_type] || ICONS.system;
          return (
            <li key={e.id} className="relative">
              <span className={`absolute -left-[34px] grid h-7 w-7 place-items-center rounded-full ring-4 ring-white ${cls}`}><Icon className="h-3.5 w-3.5" /></span>
              <div className="rounded-xl border border-surface-3 bg-white p-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[13px] text-ink-2"><span className="font-semibold text-ink">{e.user_id?.slice(0, 8)}</span> <span>{e.details}</span></p>
                  <time className="text-[11px] font-medium text-ink-3" dateTime={e.timestamp}>{formatTime(e.timestamp)}</time>
                </div>
              </div>
            </li>
          );
        })}
        {logs.length === 0 && (<li className="text-center text-sm text-ink-3 py-4">No recent activity found.</li>)}
      </ol>
    </SectionCard>
  );
}
