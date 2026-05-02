import { SectionCard } from "./SectionCard";
import { workflowSteps, type WorkflowStep, type StudentRequest } from "@/data/teacherMockData";

const STATUS_TO_STEP: Record<StudentRequest["status"], number> = {
  Pending: 1, "In Progress": 2, Approved: 3, Rejected: 3,
};

export function RequestTimeline({ request }: { request?: StudentRequest }) {
  const currentIndex = request ? STATUS_TO_STEP[request.status] : 2;
  return (
    <SectionCard id="timeline" title="Request Timeline" subtitle={request ? `${request.id} · ${request.student} · ${request.type}` : "Click a request above to see its progress"}>
      <ol className="relative flex flex-col gap-5 md:flex-row md:gap-0">
        {workflowSteps.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const dotColor = done ? "bg-success text-success-foreground" : active ? "bg-ink text-white" : "bg-surface-2 text-ink-3";
          return (
            <li key={s.key} className="relative flex flex-1 items-start gap-3 md:flex-col md:items-center md:text-center">
              <div className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-bold ${dotColor}`}>{done ? "✓" : i + 1}</div>
              <div className="min-w-0 flex-1 pb-2 md:px-3">
                <div className={`text-sm font-semibold ${active ? "text-ink" : done ? "text-ink-2" : "text-ink-3"}`}>{s.key}</div>
                <div className="text-[12px] leading-relaxed text-ink-3">{s.desc}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </SectionCard>
  );
}

export type { WorkflowStep };
