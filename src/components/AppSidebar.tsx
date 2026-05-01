import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid, Award, ListChecks, GitCommitVertical, ShieldCheck, LogOut,
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
} from "@/components/ui/sidebar";
import { UBMA_LOGO } from "@/assets/images";

type Item = { id: string; title: string; icon: typeof LayoutGrid };

const items: Item[] = [
  { id: "services", title: "E-services", icon: LayoutGrid },
  { id: "badges", title: "Open Badges", icon: Award },
  { id: "demarches", title: "Mes d\u00e9marches", icon: ListChecks },
  { id: "timeline", title: "Frise dossier", icon: GitCommitVertical },
  { id: "vault", title: "Coffre-fort", icon: ShieldCheck },
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
  const collapsed = state === "collapsed";
  const [active, setActive] = useState<string>("services");
  const navigate = useNavigate();
  const location = useLocation();

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
    if (location.pathname !== "/student-space") {
      navigate("/student-space");
      window.setTimeout(() => scrollToSection(id), 250);
    } else {
      scrollToSection(id);
    }
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" aria-label="Dashboard sections">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-1.5 py-1">
          <img
            src={UBMA_LOGO}
            alt="UBMA logo"
            className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain p-1"
          />
          {!collapsed && (
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-display text-sm font-bold text-ink">Amine Amara</span>
              <span className="truncate text-[11px] text-ink-3">Computer Science \u00b7 Y2</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = active === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      onClick={() => handleClick(item.id)}
                      aria-current={isActive ? "location" : undefined}
                      aria-label={`Jump to ${item.title}`}
                      className="transition-colors"
                    >
                      <item.icon className="h-4 w-4" aria-hidden />
                      <span>{item.title}</span>
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
              tooltip="Logout"
              aria-label="Logout"
              onClick={() => navigate("/login")}
              className="text-danger hover:bg-danger-light hover:text-danger focus-visible:ring-danger"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
