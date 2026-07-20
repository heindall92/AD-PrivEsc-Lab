import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { usePrivEscData } from "@/lib/privesc-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/curso")({
  head: () => ({
    meta: [
      { title: "Solo curso — AD PrivEsc Lab" },
      {
        name: "description",
        content: "Los 11 privilegios Se* del material del curso, explicados para quien empieza de cero.",
      },
    ],
  }),
  component: CursoPage,
});

function CursoPage() {
  const { getCourseVectors, getGroupById } = usePrivEscData();
  const { t, lang } = useI18n();
  const course = getCourseVectors().filter((v) => v.category === "local");
  const local = getGroupById("local");

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16 pt-6">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <GraduationCap className="h-6 w-6" />
          <span className="text-sm font-semibold uppercase tracking-wider">{t("curso.eyebrow")}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("curso.title")}</h1>
        <p className="text-muted-foreground leading-relaxed">{t("curso.subtitle")}</p>
        {local && (
          <p className="text-sm text-muted-foreground" style={{ borderLeft: `3px solid ${local.color}`, paddingLeft: 12 }}>
            {local.description}
          </p>
        )}
      </header>

      <ol className="space-y-3">
        {course.map((v, i) => (
          <li key={v.id}>
            <Link
              to="/vector/$vectorId"
              params={{ vectorId: v.id }}
              className="glass-panel flex items-start gap-4 rounded-xl border border-border/50 px-4 py-4 transition hover:border-primary/40"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-foreground">{v.shortName}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {v.difficulty === "beginner"
                      ? lang === "en"
                        ? "Beginner"
                        : "Principiante"
                      : lang === "en"
                        ? "Intermediate"
                        : "Intermedio"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{v.tagline}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
