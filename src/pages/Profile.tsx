import { useLocation, useNavigate } from "react-router-dom";
import { User, Shield, GraduationCap, Briefcase, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import avatarStudent from "@/assets/avatar-student.png";
import avatarTeacher from "@/assets/avatar-teacher.png";
import ubmaLogo from "@/assets/ubma-logo.png";

const profiles = {
  Student: {
    type: "Student",
    name: "Amine Amara",
    role: "Computer Science Student",
    id: "202135001234",
    avatar: avatarStudent,
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-600",
    details: [
      { label: "Faculty", value: "Exact Sciences & IT" },
      { label: "Level", value: "Master 1 · Cyber Security" },
      { label: "Email", value: "amine.amara@univ-bm.dz" }
    ]
  },
  Teacher: {
    type: "Teacher",
    name: "Dr. Karim Boudraa",
    role: "Assistant Professor",
    id: "EMP-44921",
    avatar: avatarTeacher,
    icon: Briefcase,
    color: "bg-indigo-50 text-indigo-600",
    details: [
      { label: "Department", value: "Software Engineering" },
      { label: "Specialty", value: "Distributed Systems" },
      { label: "Email", value: "k.boudraa@univ-bm.dz" }
    ]
  },
  Administrator: {
    type: "Administrator",
    name: "System Admin",
    role: "IT Department Manager",
    id: "ADMIN-001",
    avatar: null,
    icon: Shield,
    color: "bg-slate-50 text-slate-600",
    details: [
      { label: "Office", value: "Central IT Hub" },
      { label: "Access Level", value: "Root / Full Access" },
      { label: "Email", value: "admin@univ-bm.dz" }
    ]
  }
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
  // Determine role from navigation state, or fallback to Admin/Teacher based on path if possible, or default to Student
  const role = (location.state?.role as keyof typeof profiles) || "Student";
  const profile = profiles[role] || profiles.Student;

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans selection:bg-indigo-100 flex flex-col">
      <header className="border-b border-slate-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ubmaLogo} alt="Logo" className="h-10 w-auto" />
            <h2 className="font-display text-sm font-bold text-slate-900 tracking-tight">University Profile</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-full text-slate-500">
            {t("common.return" as any)}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-16 flex-1 w-full">
        <div className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/50">
          {/* Profile Header */}
          <div className={`flex flex-col items-center p-10 text-center ${profile.color.split(' ')[0]}`}>
            <div className="mb-6 flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-xs font-black uppercase tracking-widest">
              <profile.icon className="h-4 w-4" />
              {profile.type}
            </div>
            
            <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-[2.5rem] border-4 border-white bg-white shadow-lg">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                  <User className="h-16 w-16" />
                </div>
              )}
            </div>
            
            <h3 className="text-3xl font-black text-slate-900">{profile.name}</h3>
            <p className="mt-2 text-sm font-bold opacity-80">{profile.role}</p>
          </div>

          {/* Profile Details */}
          <div className="p-10 bg-white">
            <div className="space-y-6">
              <div className="flex flex-col border-b border-slate-100 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">ID Number</span>
                <span className="text-base font-mono font-bold text-slate-800">{profile.id}</span>
              </div>
              {profile.details.map((detail, dIdx) => (
                <div key={dIdx} className="flex flex-col border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{detail.label}</span>
                  <span className="text-base font-bold text-slate-800">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
        © 2025 University Badji Mokhtar · User Directory Service
      </footer>
    </div>
  );
}
