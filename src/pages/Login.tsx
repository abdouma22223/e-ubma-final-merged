import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import ubmaLogo from "@/assets/ubma-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { apiLogin } = await import("@/lib/api");
      const result = await apiLogin(email, password);

      localStorage.setItem("user_id", String(result.user_id));
      localStorage.setItem("user_name", result.first_name);
      localStorage.setItem("user_major", result.major);
      localStorage.setItem("user_role", result.role);

      const dest = result.role === "admin" 
        ? "/admin" 
        : result.role === "professor" 
          ? "/teacher-space" 
          : "/student-space";

      toast.success("Welcome back!");
      navigate(dest);
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 10%, color-mix(in oklab, var(--ink) 14%, transparent), transparent 60%), radial-gradient(50% 40% at 85% 90%, color-mix(in oklab, var(--gold) 22%, transparent), transparent 60%)",
        }}
      />
      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
          <LanguageSwitcher />
        </div>
        <div className="grid w-full gap-10 md:grid-cols-2 md:items-center">
          <div className="hidden flex-col items-start gap-6 md:flex">
            <img src={ubmaLogo} alt="UBMA logo" className="h-20 w-20 rounded-full bg-white object-contain p-2 shadow-xl" />
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.4em] text-ink-3">UBMA · GNU</p>
              <h1 className="font-display text-4xl font-bold leading-tight text-ink lg:text-5xl">{t("login.brand_title" as any)}</h1>
              <p className="mt-4 max-w-md text-sm text-ink-3">{t("login.brand_desc" as any)}</p>
            </div>
          </div>
          <div className="fade-up delay-200">
            <div className="rounded-3xl border border-surface-3 bg-white/85 p-7 shadow-2xl backdrop-blur-md md:p-9">
              <h2 className="font-display text-2xl font-bold text-ink">Connexion</h2>
              <p className="mt-1 text-sm text-ink-3">Entrez vos identifiants pour accéder à votre espace</p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-2">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border-[1.5px] border-surface-3 bg-surface-2 px-4 py-3 text-sm text-ink outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-2">Mot de passe</label>
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border-[1.5px] border-surface-3 bg-surface-2 px-4 py-3 pr-20 text-sm text-ink outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white shadow-xl"
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
