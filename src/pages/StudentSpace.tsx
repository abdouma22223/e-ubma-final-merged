import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList, BarChart3, Award, ShieldCheck, PenSquare, Mailbox,
  Binary, Globe, Bot, Lock, FileText, GraduationCap, User, Trash2, QrCode, X, Share2, DownloadCloud
} from "lucide-react";
import { Chatbot } from "@/components/Chatbot";
import { UBMA_LOGO as ubmaLogo } from "@/assets/images";
import avatarStudent from "@/assets/avatar-student.png";
import avatarTeacher from "@/assets/avatar-teacher.png";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "../supabaseClient";

function StudentSpace() {
  const { t, language } = useLanguage();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("user_id");
      if (!userId) return;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setUserData(data);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-surface-1">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-3 bg-white/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="h-6 w-px bg-surface-3" />
              <div className="flex items-center gap-2">
                <img src={ubmaLogo} alt="Logo" className="h-8 w-8 rounded-full" />
                <span className="font-display font-bold text-ink">E-UBMA</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
              <div className="flex items-center gap-2 rounded-full bg-surface-2 p-1 pr-3">
                <img src={avatarStudent} alt="Avatar" className="h-8 w-8 rounded-full" />
                <span className="text-sm font-medium text-ink">{userData?.first_name || 'Student'}</span>
              </div>
            </div>
          </header>

          <main className="p-6 lg:p-8">
             {/* Content here */}
             <div className="mb-8">
               <h1 className="font-display text-3xl font-bold text-ink">{t('welcome')}, {userData?.first_name}!</h1>
               <p className="text-ink-3">{t('portalDescription')}</p>
             </div>
             
             {/* Grid items */}
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Dashboard cards */}
             </div>
          </main>
        </div>
      </div>
      <Chatbot />
    </SidebarProvider>
  );
}

export default StudentSpace;
