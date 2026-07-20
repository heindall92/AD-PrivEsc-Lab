import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

import { usePrivEscData } from "@/lib/privesc-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/parche")({
  head: () => ({
    meta: [
      { title: "Hardening — AD PrivEsc Lab" },
      {
        name: "description",
        content: "Checklist de hardening: privilegios Se*, ACL peligrosas y señales de dominio.",
      },
    ],
  }),
  component: ParchePage,
});

function ParchePage() {
  const { lang } = useI18n();
  const { patchContext } = usePrivEscData();

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-12 pt-6">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-warning">
          <ShieldAlert className="h-6 w-6" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            {lang === "en" ? "Hardening checklist" : "Checklist de hardening"}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {patchContext.title}
        </h1>
      </header>

      <section className="space-y-4">
        {patchContext.paragraphs.map((p, i) => (
          <p key={i} className="text-base leading-relaxed text-foreground">
            {p}
          </p>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          {lang === "en" ? "Mental rules" : "Reglas mentales"}
        </h2>
        <ul className="space-y-3">
          {patchContext.rule.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-xl border border-border bg-card/40 p-5">
        <h2 className="text-xl font-semibold text-foreground">
          {lang === "en" ? "Why privileges and ACLs matter" : "Por qué importan privilegios y ACL"}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{patchContext.whySid}</p>
      </section>
    </div>
  );
}
