import { useMemo, useState } from "react";
import { User } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { mockStudents } from "@/data/teacherMockData";

function bar(value: number, color: string) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-2"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div>
      <span className="text-[12px] font-semibold text-ink-2">{value}%</span>
    </div>
  );
}

export function StudentMonitoring() {
  const courses = useMemo(() => Array.from(new Set(mockStudents.map((s) => s.course))), []);
  const [course, setCourse] = useState<string>(courses[0]);
  const list = mockStudents.filter((s) => s.course === course);

  return (
    <SectionCard id="monitoring" title="Student Monitoring" subtitle="Performance and attendance per course"
      action={<select value={course} onChange={(e) => setCourse(e.target.value)} className="rounded-full border border-surface-3 bg-white px-3 py-1.5 text-[12px] font-medium text-ink-2 outline-none focus:border-ink">{courses.map((c) => (<option key={c} value={c}>{c}</option>))}</select>}>
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((s) => (
          <div key={s.id} className="hover-lift flex flex-col gap-3 rounded-xl border border-surface-3 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 text-ink-2"><User className="h-4 w-4" aria-hidden /></div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-ink">{s.name}</div>
                <div className="text-[11px] text-ink-3">{s.id} · {s.course}</div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-[11px] font-medium text-ink-3">Performance</div>{bar(s.performance, "bg-info")}
              <div className="text-[11px] font-medium text-ink-3">Attendance</div>{bar(s.attendance, "bg-success")}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
