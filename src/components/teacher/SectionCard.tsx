import type { ReactNode } from "react";

export function SectionCard({ id, title, subtitle, action, children }: { id?: string; title: string; subtitle?: string; action?: ReactNode; children: ReactNode; }) {
  return (
    <section id={id} className="glass-card glass-card-hover fade-up rounded-2xl p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink md:text-xl">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[13px] text-ink-3">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
