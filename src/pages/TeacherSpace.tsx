import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Chatbot } from "@/components/Chatbot";
import ubmaLogo from "@/assets/ubma-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

import { RequestManagement } from "@/components/teacher/RequestManagement";
import { GradesManagement } from "@/components/teacher/GradesManagement";
import { StudentMonitoring } from "@/components/teacher/StudentMonitoring";
import { DocumentValidation } from "@/components/teacher/DocumentValidation";
import { CourseManagement } from "@/components/teacher/CourseManagement";
import { RequestTimeline } from "@/components/teacher/RequestTimeline";
import { Messaging } from "@/components/teacher/Messaging";
import { TeacherRequestsBell } from "@/components/teacher/TeacherRequestsBell";
import type { StudentRequest } from "@/data/teacherMockData";
import { mockRequests } from "@/data/teacherMockData";

const sectionLinks = [
  { id: "requests",   key: "teacher.section.requests" },
  { id: "grades",     key: "teacher.section.grades" },
  { id: "monitoring", key: "teacher.section.monitoring" },
  { id: "documents",  key: "teacher.section.documents" },
  { id: "timeline",   key: "teacher.section.timeline" },
  { id: "courses",    key: "teacher.section.courses" },
];

const stats = [
  { num: "12", key: "teacher.stat.pending" },
  { num: "84", key: "teacher.stat.active" },
  { num: "5",  key: "teacher.stat.docs" },
  { num: "3",  key: "teacher.stat.deadlines" },
];

function TeacherTopNav() {
  const { toggleSidebar } = useSidebar();
  const { t } = useLanguage();
  return (
    <nav className="glass-card sticky top-0 z-40 hidden h-[80px] items-center gap-8 border-x-0 border-t-0 bg-white/40 px-8 backdrop-blur-xl md:flex">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Open navigation menu"
        className="group flex shrink-0 items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 rounded-full"
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white p-1.5 shadow-[0_6px_16px_-4px_rgba(0,0,0,.25),0_0_0_3px_white,0_0_0_4px_color-mix(in_oklab,var(--ink)_25%,transparent)] ring-1 ring-surface-3 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
          <img src={ubmaLogo} alt="Université Badji Mokhtar Annaba" className="h-full w-full object-contain" />
        </div>
        <div className="hidden flex-col leading-tight text-left md:flex">
          <span dir="rtl" className="font-display text-[13px] font-bold text-ink">جامعة باجي مختار - عنابة</span>
          <span className="font-display text-[12px] font-semibold text-ink">{t("ts.brand_line2" as any)}</span>
          <span className="text-[10px] font-semibold tracking-[0.22em] text-ink-3">{t("ts.brand_teacher_sub" as any)}</span>
        </div>
      </button>

      <div className="flex-1" />

      <div className="ml-auto flex items-center gap-3">
        <LanguageSwitcher />
        <Link
          to="/help"
          className="rounded-full border border-surface-3 px-4 py-1.5 text-[13px] font-medium text-ink-2 transition hover:border-ink hover:bg-surface-2"
        >
          {t("common.help" as any)}
        </Link>
        <TeacherRequestsBell />
        <Link
          to="/profile"
          aria-label={t("common.profile" as any)}
          className="group/avatar relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-surface-2 text-lg ring-2 ring-transparent transition-all duration-300 hover:scale-110 hover:-rotate-6 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,.45)] hover:ring-ink/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          <User className="h-5 w-5" aria-hidden />
        </Link>
      </div>
    </nav>
  );
}

export default function TeacherSpace() {
  const [selected, setSelected] = useState<StudentRequest | undefined>(mockRequests[0]);
  const [view, setView] = useState<"dashboard" | "messaging">("dashboard");
  const { t } = useLanguage();

  useEffect(() => {
    const onNav = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail?.id;
      if (!id) return;
      setView(id === "messaging" ? "messaging" : "dashboard");
    };
    window.addEventListener("space:nav", onNav as EventListener);
    return () => window.removeEventListener("space:nav", onNav as EventListener);
  }, []);

  const scrollTo = (id: string) => {
    if (id === "messaging") setView("messaging");
    else setView("dashboard");
    window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: "smooth" });
      el.classList.add("section-flash");
      window.setTimeout(() => el.classList.remove("section-flash"), 900);
    }, 50);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile header */}
          <header className="glass-card sticky top-0 z-50 flex h-12 items-center gap-2 border-x-0 border-t-0 bg-white/40 px-3 backdrop-blur-xl md:hidden">
            <SidebarTrigger aria-label="Toggle navigation" />
            <span className="font-display text-sm font-bold text-ink">{t("ts.mobile_teacher" as any)}</span>
          </header>

          <TeacherTopNav />


          {/* Hero */}
          <header className="aurora-bg mx-auto w-full max-w-[1200px] px-4 pb-6 pt-8 md:px-8 md:pt-12">
            <div className="fade-up">
              <div className="glass-card mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-2">
                <span className="pulse-ring h-2 w-2 rounded-full bg-ink" />
                {t("teacher.badge_year" as any)}
              </div>
              <h1 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold leading-[1.05] tracking-tight text-ink">
                {t("teacher.hero_title" as any)}
              </h1>
              <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-ink-2 md:text-base">
                {t("teacher.hero_desc" as any)}
              </p>
            </div>

            <div className="fade-up delay-200 mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.key}
                  className="glass-card glass-card-hover rounded-xl p-4 text-center"
                  style={{ animation: `fadeUp .6s ${0.2 + i * 0.08}s both` }}
                >
                  <div className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">{s.num}</div>
                  <div className="mt-1 text-[11px] font-medium text-ink-3">{t(s.key as any)}</div>
                </div>
              ))}
            </div>
          </header>

          {/* Sections */}
          <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-40 md:px-8 [&>section]:scroll-mt-24">
            {view === "dashboard" ? (
              <>
                <RequestManagement onSelect={setSelected} />
                <RequestTimeline request={selected} />
                <div className="grid gap-6 lg:grid-cols-2">
                  <GradesManagement />
                  <DocumentValidation />
                </div>
                <StudentMonitoring />
                <CourseManagement />
              </>
            ) : (
              <Messaging />
            )}
          </main>

          <Chatbot />
        </div>
      </div>
    </SidebarProvider>
  );
}
