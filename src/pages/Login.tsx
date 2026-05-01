import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import ubmaLogo from "@/assets/ubma-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";


function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const id = studentId.trim();
    const isAdmin = id.startsWith("00");
    const isTeacher = id.startsWith("1900");
    const role = isAdmin ? "admin" : isTeacher ? "professor" : "student";
    const dest = isAdmin ? "/admin" : isTeacher ? "/teacher-space" : "/student-space";

    try {
      const { apiLogin } = await import("@/lib/api");
      const result = await apiLogin(id, password);

      localStorage.setItem("user_id", String(result.user_id));
      localStorage.setItem("user_name", result.first_name);
      localStorage.setItem("user_major", result.major);
      localStorage.setItem("user_role", result.role);

      const finalDest = result.role === "admin"
        ? "/admin"
        : result.role === "professor"
          ? "/teacher-space"
          : "/student-space";

      toast.success(
        result.role === "admin"
          ? "Welcome to admin space"
          : result.role === "professor"
            ? t("login.welcome_teacher" as any)
            : t("login.welcome_student" as any),
      );
      navigate(finalDest);
    } catch (err: any) {
      const msg = err?.message || "Login failed";
      if (msg.includes("fetch") || msg.includes("Failed") || msg.includes("NetworkError") || msg.includes("Load failed")) {
        localStorage.setItem("user_id", id);
        localStorage.setItem("user_name", isAdmin ? "Admin" : isTeacher ? "Professeur" : "Étudiant");
        localStorage.setItem("user_role", role);
        localStorage.setItem("user_major", "Informatique");
        toast.warning(
          role === "admin"
            ? "⚠️ Backend hors ligne — Accès admin en mode démo"
            : role === "professor"
            ? "⚠️ Backend hors ligne — Accès enseignant en mode démo"
            : "⚠️ Backend hors ligne — Mode démo activé"
        );
        setTimeout(() => navigate(dest), 600);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = (role: "admin" | "professor" | "student") => {
    const map = {
      admin:     { id: "001",      name: "Admin",      major: "Administration", dest: "/admin" },
      professor: { id: "19001",    name: "Professeur", major: "Informatique",   dest: "/teacher-space" },
      student:   { id: "20231234", name: "Étudiant",   major: "Informatique",   dest: "/student-space" },
    };
    const info = map[role];
    localStorage.setItem("user_id",    info.id);
    localStorage.setItem("user_name",  info.name);
    localStorage.setItem("user_role",  role);
    localStorage.setItem("user_major", info.major);
    navigate(info.dest);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 10%, color-mix(in oklab, var(--ink) 14%, transparent), transparent 60%), radial-gradient(50% 40% at 85% 90%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 60%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 18s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(var(--ink) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
          <LanguageSwitcher />
        </div>
        <div className="grid w-full gap-10 md:grid-cols-2 md:items-center">
          {/* Brand panel */}
          <div className="hidden flex-col items-start gap-6 md:flex fade-up">
            <img
              src={ubmaLogo}
              alt="UBMA logo"
              className="h-20 w-20 rounded-full bg-white object-contain p-2 shadow-[0_18px_50px_-10px_color-mix(in_oklab,var(--ink)_35%,transparent)] float"
            />
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.4em] text-ink-3">
                UBMA · GNU
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-ink lg:text-5xl">
                {t("login.brand_title" as any)}
              </h1>
              <p className="mt-4 max-w-md text-sm text-ink-3">
                {t("login.brand_desc" as any)}
              </p>
            </div>
            <ul className="space-y-2 text-sm text-ink-2">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" /> {t("login.feature_pades" as any)}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" /> {t("login.feature_ob" as any)}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" /> {t("login.feature_vault" as any)}
              </li>
            </ul>
          </div>

          {/* Form card */}
          <div className="fade-up delay-200">
            <div className="rounded-3xl border border-surface-3 bg-white/85 p-7 shadow-[0_18px_60px_-18px_color-mix(in_oklab,var(--ink)_30%,transparent)] backdrop-blur-md md:p-9">
              <div className="mb-6 flex items-center gap-3 md:hidden">
                <img
                  src={ubmaLogo}
                  alt="UBMA logo"
                  className="h-10 w-10 rounded-full bg-white object-contain p-1"
                />
                <span className="font-display text-lg font-bold text-ink">
                  {t("login.brand_mobile" as any)}
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-ink">{t("login.title" as any)}</h2>
              <p className="mt-1 text-sm text-ink-3">{t("login.subtitle" as any)}</p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="studentId" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-2">
                    {t("login.id" as any)}
                  </label>
                  <input
                    id="studentId"
                    type="text"
                    autoComplete="username"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 202312345678"
                    className="w-full rounded-xl border-[1.5px] border-surface-3 bg-surface-2 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-ink focus:bg-white"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-ink-2">
                      {t("login.password" as any)}
                    </label>
                    <button type="button" className="text-xs font-medium text-ink-3 hover:text-ink">
                      {t("login.forgot" as any)}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={show ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border-[1.5px] border-surface-3 bg-surface-2 px-4 py-3 pr-20 text-sm text-ink outline-none transition-colors focus:border-ink focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-ink-3 hover:text-ink"
                    >
                      {show ? t("login.hide" as any) : t("login.show" as any)}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-surface-3 accent-[var(--ink)]"
                  />
                  {t("login.remember" as any)}
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_color-mix(in_oklab,var(--ink)_55%,transparent)] transition hover:opacity-95 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="dot-anim flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                  ) : (
                    <>
                      {t("login.submit" as any)}
                      <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-4 text-center text-xs">
              <Link to="/" className="text-ink-3 hover:text-ink">{t("common.back_home" as any)}</Link>
            </div>

            {/* Demo Quick Access */}
            <div className="mt-4 rounded-2xl border border-dashed border-surface-3 bg-surface-2/60 p-4">
              <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest text-ink-3">
                ⚡ Accès rapide démo
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => demoLogin("admin")}
                  className="flex flex-col items-center gap-1 rounded-xl border border-surface-3 bg-white px-2 py-3 text-[11px] font-semibold text-ink shadow-sm transition hover:border-ink hover:bg-ink hover:text-white"
                >
                  <span className="text-lg">🛡️</span>
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin("professor")}
                  className="flex flex-col items-center gap-1 rounded-xl border border-surface-3 bg-white px-2 py-3 text-[11px] font-semibold text-ink shadow-sm transition hover:border-ink hover:bg-ink hover:text-white"
                >
                  <span className="text-lg">👨‍🏫</span>
                  Enseignant
                </button>
                <button
                  type="button"
                  onClick={() => demoLogin("student")}
                  className="flex flex-col items-center gap-1 rounded-xl border border-surface-3 bg-white px-2 py-3 text-[11px] font-semibold text-ink shadow-sm transition hover:border-ink hover:bg-ink hover:text-white"
                >
                  <span className="text-lg">🎓</span>
                  Étudiant
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
