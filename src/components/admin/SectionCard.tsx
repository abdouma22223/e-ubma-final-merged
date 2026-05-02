import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  id?: string; title: string; description?: string;
  icon?: ReactNode; actions?: ReactNode; className?: string; children: ReactNode;
}

export function SectionCard({ id, title, description, icon, actions, className, children }: Props) {
  return (
    <section id={id} className={cn("glass-card glass-card-hover rounded-2xl p-5 md:p-6", className)}>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-surface-3 pb-4">
        <div className="flex items-start gap-3">
          {icon && (<div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink">{icon}</div>)}
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold leading-tight text-ink md:text-xl">{title}</h2>
            {description && (<p className="mt-0.5 text-[13px] leading-relaxed text-ink-3">{description}</p>)}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </header>
      {children}
    </section>
  );
}
