import { useNavigate } from "react-router-dom";
import { User, Shield, GraduationCap, Briefcase, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import avatarStudent from "@/assets/avatar-student.png";
import avatarTeacher from "@/assets/avatar-teacher.png";
import ubmaLogo from "@/assets/ubma-logo.png";

const profiles = [
  {
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
  {
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
  {
    type: "Administrator",
    name: "System Admin",
    role: "IT Department Manager",
    id: "ADMIN-001",
    avatar: null, // We'll use a generic icon
    icon: Shield,
    color: "bg-slate-50 text-slate-600",
    details: [
      { label: "Office", value: "Central IT Hub" },
      { label: "Access Level", value: "Root / Full Access" },
      { label: "Email", value: "admin@univ-bm.dz" }
    ]
  }
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#fcfcfd] font-sans selection:bg-indigo-100">
      <header className="border-b border-slate-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={ubmaLogo} alt="Logo" className="h-10 w-auto" />
            <h2 className="font-display text-sm font-bold text-slate-900 tracking-tight">University Profile Directory</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-full text-slate-500">
            {t("common.return" as any)}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-16 text-center">
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Platform User Profiles</h1>
          <p className="mt-2 text-slate-500 font-medium">Standardized identification for all university members.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {profiles.map((profile, idx) => (
            <div key={idx} className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-100/50 transition-all hover:scale-[1.02]">
              {/* Profile Header */}
              <div className={`flex flex-col items-center p-8 text-center ${profile.color.split(' ')[0]}`}>
                <div className="mb-4 flex items-center gap-2 rounded-full bg-white/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  <profile.icon className="h-3 w-3" />
                  {profile.type}
                </div>
                
                <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-md">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900">{profile.name}</h3>
                <p className="text-xs font-bold opacity-70">{profile.role}</p>
              </div>

              {/* Profile Details */}
              <div className="flex-1 p-8">
                <div className="mb-6 space-y-4">
                  <div className="flex flex-col border-b border-slate-50 pb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ID Number</span>
                    <span className="text-sm font-mono font-bold text-slate-700">{profile.id}</span>
                  </div>
                  {profile.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex flex-col border-b border-slate-50 pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{detail.label}</span>
                      <span className="text-sm font-bold text-slate-700">{detail.value}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                  View Credentials
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 rounded-3xl bg-slate-900 p-8 text-white">
           <Shield className="h-8 w-8 text-indigo-400" />
           <div>
             <h4 className="font-bold">Identity Verification Protocol Active</h4>
             <p className="text-xs text-slate-400">All profiles are cryptographically linked to the UBMA Central Directory.</p>
           </div>
        </div>
      </main>

      <footer className="py-12 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
        © 2025 University Badji Mokhtar · User Directory Service
      </footer>
    </div>
  );
}
