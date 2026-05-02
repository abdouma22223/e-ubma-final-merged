import { useEffect, useState, Component, ReactNode } from "react";
import { User, Menu, AlertTriangle } from "lucide-react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/Sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import ubmaLogo from "@/assets/ubma-logo";
import { useNavigate } from "react-router-dom";

import { StatsOverview } from "@/components/admin/StatsOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { RequestsManagement } from "@/components/admin/RequestsManagement";
import { FacultiesManagement } from "@/components/admin/FacultiesManagement";
import { RolesPermissions } from "@/components/admin/RolesPermissions";
import { DocumentsManagement } from "@/components/admin/DocumentsManagement";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { AdminMessaging } from "@/components/admin/AdminMessaging";
import { AdminRequestsBell } from "@/components/admin/AdminRequestsBell";

class SafetyGuard extends Component<{children: ReactNode, name: string}, {hasError: boolean}> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border-2 border-dashed border-danger/20 bg-danger/5 rounded-2xl text-danger text-sm flex flex-col items-center gap-3">
          <AlertTriangle className="h-6 w-6" />
          <p className="font-bold text-center">عذراً، فشل تحميل قسم: {this.props.name}</p>
          <button onClick={() => window.location.reload()} className="text-[10px] underline uppercase tracking-widest hover:text-ink transition">إعادة المحاولة</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const sectionLinks = [
  { id: "overview",  labelKey: "admin.nav.overview" },
  { id: "users",     labelKey: "admin.nav.users" },
  { id: "requests",  labelKey: "admin.nav.requests" },
  { id: "faculties", labelKey: "admin.nav.faculties" },
  { id: "roles",     labelKey: "admin.nav.roles" },
  { id: "documents", labelKey: "admin.nav.documents" },
  { id: "activity",  labelKey: "admin.nav.activity" },
];

function AdminTopNav() {
  const { toggleSidebar } = useSidebar();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const resetLocal = () => { localStorage.clear(); window.location.reload(); };

  return (
    <nav className="glass-card sticky top-0 z-40 flex h-[70px] items-center gap-6 border-x-0 border-t-0 bg-white/40 px-6 backdrop-blur-xl">
      <button type="button" onClick={toggleSidebar} className="group flex shrink-0 items-center gap-3 rounded-full outline-none">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white p-1 shadow-md transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
          <img src={ubmaLogo} alt="UBMA" className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col leading-tight text-left">
          <span className="font-display text-[12px] font-bold text-ink">جامعة باجي مختار - عنابة</span>
          <span className="font-display text-[11px] font-semibold text-ink-2">{lang === "ar" ? "لوحة التحكم الإدارية" : "Admin Panel"}</span>
        </div>
      </button>

      <div className="hidden flex-1 justify-center gap-1 xl:flex">
        {sectionLinks.map((l) => (
          <button key={l.id} onClick={() => document.getElementById(l.id)?.scrollIntoView({behavior:'smooth', block:'center'})} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-medium text-ink-2 transition hover:bg-white/50 hover:text-ink">
            {t(l.labelKey as any)}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button onClick={resetLocal} className="text-[10px] font-black uppercase text-danger hover:underline">Reset System</button>
        <LanguageSwitcher />
        <SafetyGuard name="Notifications"><AdminRequestsBell /></SafetyGuard>
        <button 
          onClick={() => navigate("/profile", { state: { role: 'Administrator' } })}
          className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-ink shadow-sm transition hover:scale-105 active:scale-95"
          aria-label="Admin Profile"
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </nav>
  );
}

export default function AdminSpace() {
  const { t, dir, lang } = useLanguage();
  const [view, setView] = useState<"dashboard" | "messaging">("dashboard");

  useEffect(() => {
    const onNav = (e: any) => setView(e.detail?.id === "messaging" ? "messaging" : "dashboard");
    window.addEventListener("admin:nav", onNav);
    return () => window.removeEventListener("admin:nav", onNav);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#fdfcfb]" dir={dir}>
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass-card sticky top-0 z-50 flex h-14 items-center gap-3 border-x-0 border-t-0 bg-white/40 px-4 backdrop-blur-xl md:hidden">
            <SidebarTrigger><Menu className="h-5 w-5 text-ink" /></SidebarTrigger>
            <span className="font-display text-sm font-bold text-ink">{lang === "ar" ? "الإدارة" : "Admin"}</span>
          </header>

          <AdminTopNav />

          <div className="relative flex-1">
             <div className="pointer-events-none fixed inset-0 aurora-bg opacity-20" />
             <main className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8 md:py-12 space-y-10">
                <header className="space-y-2">
                   <h1 className="font-display text-3xl font-black tracking-tight text-ink md:text-5xl">
                      {view === "messaging" ? (lang === "ar" ? "مركز المراسلة" : "Messaging Center") : t("admin.title" as any)}
                   </h1>
                </header>

                {view === "dashboard" ? (
                   <div className="space-y-12 pb-24">
                      <section id="overview"><SafetyGuard name="Stats"><StatsOverview /></SafetyGuard></section>
                      <section id="users"><SafetyGuard name="Users"><UserManagement /></SafetyGuard></section>
                      <section id="requests"><SafetyGuard name="Requests"><RequestsManagement /></SafetyGuard></section>
                      <section id="faculties"><SafetyGuard name="Faculties"><FacultiesManagement /></SafetyGuard></section>
                      <section id="roles"><SafetyGuard name="Roles"><RolesPermissions /></SafetyGuard></section>
                      <section id="documents"><SafetyGuard name="Documents"><DocumentsManagement /></SafetyGuard></section>
                      <section id="activity"><SafetyGuard name="Logs"><ActivityLog /></SafetyGuard></section>
                   </div>
                ) : (
                   <SafetyGuard name="Messaging"><AdminMessaging /></SafetyGuard>
                )}
             </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
