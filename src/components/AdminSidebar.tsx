import {
  LayoutGrid,
  FileText,
  MessageSquare,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Users,
  GraduationCap
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { UBMA_LOGO as ubmaLogo } from "@/assets/images";
import { useLanguage } from "@/contexts/LanguageContext";

const items = [
  { id: "dashboard", titleKey: "adminDashboard", icon: LayoutGrid, url: "/admin-dashboard" },
  { id: "users", titleKey: "manageUsers", icon: Users, url: "/admin/users" },
  { id: "verification", titleKey: "verifyDocs", icon: ShieldCheck, url: "/admin/verify" },
  { id: "settings", titleKey: "settings", icon: Settings, url: "/settings" },
];

export function AdminSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const { t } = useLanguage();

  return (
    <Sidebar collapsible="icon" className="border-r border-surface-3 bg-white">
      <SidebarContent>
        <div className="flex h-16 items-center px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white shadow-lg shadow-ink/20">
              <img src={ubmaLogo} alt="Logo" className="h-7 w-7 rounded-full" />
            </div>
            {state !== "collapsed" && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-ink">Admin Portal</span>
                <span className="text-[10px] font-medium text-ink-3">UBMA · GNU</span>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-3">
            {t('mainMenu')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild tooltip={t(item.titleKey)}>
                    <a href={item.url} className="flex items-center gap-3 rounded-xl px-4 py-2 text-ink-2 transition-all hover:bg-surface-2 hover:text-ink">
                      <item.icon className="h-5 w-5" />
                      <span>{t(item.titleKey)}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto border-t border-surface-3 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full text-red-500 hover:bg-red-50 hover:text-red-600">
              <LogOut className="h-5 w-5" />
              <span>{t('signOut')}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
