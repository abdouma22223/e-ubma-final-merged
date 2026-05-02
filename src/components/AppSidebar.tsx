import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid, Award, ListChecks, GitCommitVertical, ShieldCheck, LogOut,
  Inbox, GraduationCap, Users, FileCheck2, MessagesSquare, BookOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/Sidebar";
import ubmaLogo from "@/assets/ubma-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

type Item = { id: string; titleKey: string; icon: typeof LayoutGrid };

const studentItems: Item[] = [
  { id: "services",  titleKey: "sidebar.eservices",  icon: LayoutGrid },
  { id: "badges",    titleKey: "sidebar.openbadges", icon: Award },
  { id: "demarches", titleKey: "sidebar.demarches",  icon: ListChecks },
  { id: "timeline",  titleKey: "sidebar.timeline",   icon: GitCommitVertical },
  { id: "vault",     titleKey: "sidebar.vault",      icon: ShieldCheck },
  { id: "messaging", titleKey: "sidebar.messaging",  icon: MessagesSquare },
];

const teacherItems: Item[] = [
  { id: "requests",   titleKey: "sidebar.requests",   icon: Inbox },
  { id: "grades",     titleKey: "sidebar.grades",     icon: GraduationCap },
  { id: "monitoring", titleKey: "sidebar.monitoring", icon: Users },
  { id: "documents",  titleKey: "sidebar.documents",  icon: FileCheck2 },
  { id: "timeline",   titleKey: "sidebar.timeline",   icon: GitCommitVertical },
  { id: "courses",    titleKey: "sidebar.courses",    icon: BookOpen },
  { id: "messaging",  titleKey: "sidebar.messaging",  icon: MessagesSquare },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 16;
  window.scrollTo({ top, behavior: "smooth" });
  // brief highlight pulse
  el.classList.add("section-flash");
  window.setTimeout(() => el.classList.remove("section-flash"), 900);
}

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { t, dir } = useLanguage();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();
  const isTeacher = location.pathname === "/teacher-space";
  const items = useMemo(() => (isTeacher ? teacherItems : studentItems), [isTeacher]);
  const homePath = isTeacher ? "/teacher-space" : "/student-space";
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    setActive(items[0]?.id ?? "");
  }, [items]);

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [items, location.pathname]);

  const handleClick = (id: string) => {
    if (id === "profile") {
      navigate("/profile");
      if (isMobile) setOpenMobile(false);
      return;
    }
    
    // Notify space pages to switch view (messaging is hidden by default)
    window.dispatchEvent(new CustomEvent("space:nav", { detail: { id } }));

    // If we're on the home page, scroll. Allow conditional sections to mount first.
    if (location.pathname !== homePath) {
      navigate(homePath);
      window.setTimeout(() => scrollToSection(id), 250);
    } else {
      window.setTimeout(() => scrollToSection(id), 50);
    }
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="offcanvas" side={dir === "rtl" ? "right" : "left"} aria-label="Dashboard sections">
      <SidebarHeader className="border-b border-sidebar-border">
        <button 
          className="flex items-center gap-2.5 px-1.5 py-1 text-left w-full hover:bg-surface-2 rounded-lg transition-colors"
          onClick={() => navigate("/profile", { state: { role: isTeacher ? 'Teacher' : 'Student' } })}
        >
          <img
            src={ubmaLogo}
            alt="UBMA logo"
            className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain p-1"
          />
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-display text-sm font-bold text-ink">
                {isTeacher ? "Dr. Karim Boudraa" : "Amine Amara"}
              </span>
              <span className="truncate text-[11px] text-ink-3">
                {isTeacher ? "Faculty of Informatics" : "Computer Science · Y2"}
              </span>
            </div>
          )}
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {isTeacher ? t("sidebar.teacher_dashboard" as any) : t("sidebar.dashboard_sections" as any)}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, idx) => {
                const isActive = active === item.id;
                const title = t(item.titleKey as any);
                return (
                  <SidebarMenuItem
                    key={item.id}
                    className="animate-fade-in"
                    style={{
                      animationDelay: `${idx * 50}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={title}
                      onClick={() => handleClick(item.id)}
                      aria-current={isActive ? "location" : undefined}
                      aria-label={title}
                      className="transition-all duration-200 ease-out hover:translate-x-1 hover:bg-sidebar-accent/70 active:scale-[0.98]"
                    >
                      <item.icon className="h-4 w-4" aria-hidden />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={t("common.logout" as any)}
              aria-label={t("common.logout" as any)}
              onClick={() => navigate("/login")}
              className="text-danger hover:bg-danger-light hover:text-danger focus-visible:ring-danger"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span>{t("common.logout" as any)}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
