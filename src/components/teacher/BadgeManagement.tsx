import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SectionCard } from "./SectionCard";
import { mockStudents } from "@/data/teacherMockData";
import { Award, Search, User, ShieldCheck, X, Star, BookOpen, Code, Rocket } from "lucide-react";
import { toast } from "sonner";

const BADGE_PRESETS = [
  { title: "Student of the Month", ar: "طالب الشهر", iconStr: "⭐", desc: "Awarded for exceptional academic performance and dedication." },
  { title: "Top Researcher", ar: "باحث متميز", iconStr: "📚", desc: "Recognized for outstanding contributions to research and analysis." },
  { title: "Coding Master", ar: "خبير البرمجة", iconStr: "💻", desc: "Demonstrated superior programming skills and project execution." },
  { title: "Leadership Award", ar: "جائزة القيادة", iconStr: "🚀", desc: "Exhibited great leadership and teamwork during the semester." },
];

export function BadgeManagement() {
  const { t, lang, dir } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", icon: "🏅" });

  const filtered = mockStudents.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

  const handleAward = (student: any) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleQuickAward = (student: any) => {
    toast.success(lang === "ar" ? `تم منح شارة "أداء ممتاز" لـ ${student.name}` : `Awarded "Excellent Performance" to ${student.name}`);
  };

  const submit = () => {
    toast.success(lang === "ar" ? `تم منح شارة ${form.title} بنجاح!` : `Badge "${form.title}" awarded successfully!`);
    setShowModal(false);
    setForm({ title: "", description: "", icon: "🏅" });
  };

  return (
    <SectionCard id="badges" title={t("teacher.section.badges" as any)}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-ink-3">
            {lang === "ar" ? "كافئ طلبتك المتميزين بشارات Open Badges رقمية موثقة." : "Reward your top students with verifiable digital Open Badges."}
          </p>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
            <input
              type="text"
              placeholder={lang === "ar" ? "ابحث عن طالب..." : "Search students..."}
              className="w-full rounded-xl border border-surface-3 bg-white/50 pl-9 pr-4 py-2 text-sm outline-none focus:border-ink transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-2xl border border-surface-3 bg-white/60 p-4 shadow-sm hover:border-ink/20 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-2">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate font-bold text-sm text-ink">{s.name}</span>
                  <span className="truncate text-[10px] text-ink-3 font-semibold uppercase">{s.course}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickAward(s)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-lg transition hover:bg-emerald-50 hover:scale-110 active:scale-95"
                  title="Quick 🏅 Award"
                >
                  🏅
                </button>
                <button
                  onClick={() => handleAward(s)}
                  className="rounded-lg bg-ink px-3 py-1.5 text-[11px] font-bold text-white transition hover:opacity-90 active:scale-95"
                >
                  {lang === "ar" ? "منح" : "Award"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir={dir}>
          <div className="w-full max-w-md rounded-3xl border border-surface-3 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-ink">
                {lang === "ar" ? "منح شارة جديدة" : "Award New Badge"}
              </h3>
              <button onClick={() => setShowModal(false)} className="rounded-full p-2 hover:bg-surface-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-surface-2 p-3 flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink shadow-sm">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ink-3 uppercase">{lang === "ar" ? "الطالب" : "Student"}</p>
                  <p className="text-sm font-bold text-ink">{selectedStudent?.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-ink-3 uppercase mb-2">{lang === "ar" ? "قوالب سريعة" : "Quick Presets"}</label>
                <div className="grid grid-cols-2 gap-2">
                  {BADGE_PRESETS.map((p) => (
                    <button
                      key={p.title}
                      onClick={() => setForm({ title: lang === "ar" ? p.ar : p.title, description: p.desc, icon: p.iconStr })}
                      className="flex items-center gap-2 rounded-xl border border-surface-3 bg-surface-1 px-3 py-2 text-left text-[11px] font-medium text-ink-2 transition hover:border-emerald-400 hover:bg-emerald-50"
                    >
                      <span className="text-sm">{p.iconStr}</span>
                      <span className="truncate">{lang === "ar" ? p.ar : p.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder={lang === "ar" ? "عنوان الشارة" : "Badge Title"}
                  className="w-full rounded-xl border border-surface-3 bg-white px-4 py-2.5 text-sm outline-none focus:border-ink"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                  placeholder={lang === "ar" ? "الوصف" : "Description"}
                  className="w-full rounded-xl border border-surface-3 bg-white px-4 py-2.5 text-sm outline-none focus:border-ink min-h-[60px]"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <button
                onClick={submit}
                disabled={!form.title}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-ink py-4 text-sm font-bold text-white shadow-xl transition hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                <ShieldCheck className="h-5 w-5" />
                {lang === "ar" ? "تأكيد ومنح الشارة" : "Confirm & Award Badge"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
