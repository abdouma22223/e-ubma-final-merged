import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Inbox, Building2, ShieldCheck, FileText, Activity, LogOut, MessagesSquare,
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

const items = [
  { id: "overview",   titleKey: "admin.nav.overview",      icon: LayoutDashboard },
  { id: "users",      titleKey: "admin.nav.users",         icon: Users },
  { id: "requests",   titleKey: "admin.nav.requests",      icon: Inbox },
  { id: "faculties",  titleKey: "admin.nav.faculties",     icon: Building2 },
  { id: "roles",      titleKey: "admin.nav.roles",         icon: ShieldCheck },
  { id: "documents",  titleKey: "admin.nav.documents",     icon: FileText },
  { id: "activity",   titleKey: "admin.nav.activity",      icon: Activity },
  { id: "messaging",  titleKey: "sidebar.messaging",       icon: MessagesSquare },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 16;
  window.scrollTo({ top, behavior: "smooth" });
  el.classList.add("section-flash");
  window.setTimeout(() => el.classList.remove("section-flash"), 900);
}

export function AdminSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { dir, t } = useLanguage();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const [active, setActive] = useState<string>("overview");

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
  }, []);

  const handleClick = (id: string) => {
    // Notify AdminSpace to switch view (messaging is hidden by default)
    window.dispatchEvent(new CustomEvent("admin:nav", { detail: { id } }));
    // Scroll after a tick to allow conditional sections to mount
    window.setTimeout(() => scrollToSection(id), 50);
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="offcanvas" side={dir === "rtl" ? "right" : "left"} className="border-r-0 border-l-0">
      <SidebarHeader className="border-b border-sidebar-border">
        <button 
          className="flex items-center gap-2.5 px-1.5 py-1 text-left w-full hover:bg-surface-2 rounded-lg transition-colors"
          onClick={() => navigate("/profile", { state: { role: 'Administrator' } })}
        >
          <img src={ubmaLogo} alt="UBMA logo" className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain p-1" />
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-display text-sm font-bold text-ink">Nadia Chelbi</span>
              <span className="truncate text-[11px] text-ink-3">{t("ts.mobile_teacher" as any).replace("GNU · ", "")}</span>
            </div>
          )}
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("ts.mobile_teacher" as any).replace("GNU · ", "")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, idx) => {
                const isActive = active === item.id;
                return (
                  <SidebarMenuItem
                    key={item.id}
                  >
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={t(item.titleKey as any)}
                      onClick={() => handleClick(item.id)}
                      aria-current={isActive ? "location" : undefined}
                      aria-label={t(item.titleKey as any)}
                      className="transition-all duration-200 ease-out hover:translate-x-1 hover:bg-sidebar-accent/70 active:scale-[0.98]"
                    >
                      <item.icon className="h-4 w-4" aria-hidden />
                      <span>{t(item.titleKey as any)}</span>
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
