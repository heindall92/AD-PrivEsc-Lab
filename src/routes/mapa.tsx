import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { GroupCard } from "@/components/group-card";
import { usePrivEscData } from "@/lib/privesc-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa — AD PrivEsc Lab" },
      {
        name: "description",
        content:
          "Mapa pedagógico de privilege escalation: privilegios Se*, Kerberos, ACL, delegación y puente ADCS.",
      },
    ],
  }),
  component: MapaPage,
});

const CHAIN_STEPS = [
  { id: "foothold", es: "Foothold", en: "Foothold", subEs: "Shell o credenciales", subEn: "Shell or credentials" },
  { id: "priv", es: "whoami /priv", en: "whoami /priv", subEs: "¿Hay Se*?", subEn: "Any Se*?" },
  { id: "sign", es: "Firma", en: "Signature", subEs: "Reconocer el vector", subEn: "Recognize the vector" },
  { id: "domain", es: "Dominio", en: "Domain", subEs: "Kerberos · ACL · Delegación", subEn: "Kerberos · ACL · Delegation" },
  { id: "practice", es: "Practicar", en: "Practice", subEs: "Escenario guiado", subEn: "Guided scenario" },
  { id: "blue", es: "Mitigar", en: "Mitigate", subEs: "Blue team", subEn: "Blue team" },
] as const;

function MapaPage() {
  const { lang, t } = useI18n();
  const { vectors, groups } = usePrivEscData();

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-12 pt-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("nav.map")}
        </h1>
        <p className="max-w-3xl text-lg text-muted-foreground leading-relaxed">
          {lang === "en" ? (
            <>
              Start with <strong>Local / Se*</strong> (course track). Then explore domain vectors.
              ADCS certificates live in the sibling lab.
            </>
          ) : (
            <>
              Empieza por <strong>Local / Se*</strong> (ruta del curso). Luego explora vectores de
              dominio. Los certificados ADCS viven en el lab hermano.
            </>
          )}
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-border bg-card/40 p-5 sm:p-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            {lang === "en" ? "Learning chain" : "Cadena de aprendizaje"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {lang === "en"
              ? "One mental model: signature → card → practice → defend."
              : "Un solo modelo mental: firma → ficha → practicar → defender."}
          </p>
        </div>
        <ol className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-stretch lg:gap-1">
          {CHAIN_STEPS.map((step, i) => (
            <li key={step.id} className="flex items-center gap-1 lg:min-w-[8rem] lg:flex-1">
              <div className="flex w-full flex-col rounded-lg border border-border bg-background px-3 py-3">
                <span className="text-[10px] font-medium uppercase tracking-wider text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 text-sm font-semibold text-foreground">
                  {lang === "en" ? step.en : step.es}
                </span>
                <span className="mt-0.5 text-xs text-muted-foreground">
                  {lang === "en" ? step.subEn : step.subEs}
                </span>
              </div>
              {i < CHAIN_STEPS.length - 1 && (
                <ArrowRight
                  className="mx-0.5 hidden h-4 w-4 shrink-0 text-muted-foreground lg:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          {lang === "en" ? "All vectors" : "Todos los vectores"}
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {vectors.map((v) => {
            const group = groups.find((g) => g.id === v.category);
            return (
              <Link
                key={v.id}
                to="/vector/$vectorId"
                params={{ vectorId: v.id }}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3 transition-colors hover:bg-card/80"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: group?.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{v.shortName}</span>
                </div>
                <span className="max-w-[180px] truncate text-xs text-muted-foreground">
                  {v.tagline}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
