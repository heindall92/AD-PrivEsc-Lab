import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Shield, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { usePrivEscData } from "@/lib/privesc-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/blue-team")({
  head: () => ({
    meta: [
      { title: "Blue Team — AD PrivEsc Lab" },
      {
        name: "description",
        content: "Detección y hardening por categoría de privilege escalation.",
      },
    ],
  }),
  component: BlueTeamPage,
});

function BlueTeamPage() {
  const { lang } = useI18n();
  const { blueTeam, getGroupById } = usePrivEscData();

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-12 pt-6">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Shield className="h-6 w-6" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            {lang === "en" ? "Defensive focus" : "Enfoque defensivo"}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Blue Team</h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {lang === "en"
            ? "Detection and hardening by category. Inventory privileges and dangerous ACLs before attackers do."
            : "Detección y hardening por categoría. Inventaria privilegios y ACL peligrosas antes que el atacante."}
        </p>
      </header>

      <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-sm leading-relaxed text-foreground">
            {lang === "en"
              ? "Educational guidance only. Apply changes in authorized labs or with written approval."
              : "Solo orientación educativa. Aplica cambios en labs autorizados o con aprobación escrita."}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {blueTeam.map((row) => {
          const group = getGroupById(row.category);
          return (
            <div
              key={row.category}
              className="rounded-xl border border-border bg-card p-5"
              style={{ borderTopColor: group?.color, borderTopWidth: "4px" }}
            >
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">{group?.label}</h2>
                <Badge variant="outline" style={{ borderColor: group?.color, color: group?.color }}>
                  {group?.vectorIds.length ?? 0}{" "}
                  {lang === "en" ? "vectors" : "vectores"}
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {lang === "en" ? "Detection" : "Detección"}
                  </h3>
                  <ul className="space-y-2">
                    {row.detection.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm leading-relaxed text-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Hardening
                  </h3>
                  <ul className="space-y-2">
                    {row.hardening.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm leading-relaxed text-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
