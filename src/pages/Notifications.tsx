import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

function NotificationsPage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-3xl px-8 py-16">
      <h1 className="font-display text-3xl font-extrabold text-ink">{t("common.notifications" as any)}</h1>
      <p className="mt-3 text-ink-3">{t("common.under_construction" as any)}</p>
      <Link to="/" className="mt-6 inline-block text-sm font-semibold text-ink underline">{t("common.back_home" as any)}</Link>
    </div>
  );
}
export default NotificationsPage;
