import { useNavigate } from "react-router-dom";
import { Messaging } from "@/components/teacher/Messaging";
import { useLanguage } from "@/contexts/LanguageContext";

function MessagesPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-display text-3xl font-extrabold text-ink">{t("common.messages" as any)}</h1>
      <p className="mt-2 text-sm text-ink-3">{t("messages.subtitle" as any)}</p>
      <div className="mt-8">
        <Messaging />
      </div>
      <button onClick={() => navigate(-1)} className="mt-6 inline-block text-sm font-semibold text-ink underline">{t("common.return" as any)}</button>
    </div>
  );
}
export default MessagesPage;
