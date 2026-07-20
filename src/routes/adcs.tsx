import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Shield } from "lucide-react";

import { useI18n } from "@/lib/i18n";

const ADCS_LAB_URL = "https://github.com/heindall92/ADCS-ESC-Lab";

export const Route = createFileRoute("/adcs")({
  head: () => ({
    meta: [
      { title: "ADCS — AD PrivEsc Lab" },
      {
        name: "description",
        content: "Puente al laboratorio hermano ADCS-ESC-Lab (ESC1–ESC16).",
      },
    ],
  }),
  component: AdcsBridgePage,
});

function AdcsBridgePage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-16 pt-10">
      <div className="flex items-center gap-2 text-primary">
        <Shield className="h-6 w-6" />
        <span className="text-sm font-semibold uppercase tracking-wider">ADCS</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{t("adcs.title")}</h1>
      <p className="text-muted-foreground leading-relaxed">{t("adcs.body")}</p>
      <a
        href={ADCS_LAB_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        {t("adcs.cta")}
        <ExternalLink className="h-4 w-4" />
      </a>
      <p className="text-xs text-muted-foreground font-mono">{ADCS_LAB_URL}</p>
    </div>
  );
}
