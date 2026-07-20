import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Crosshair,
  ExternalLink,
  Lightbulb,
  Shield,
  ShieldAlert,
  Terminal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { GroupCard } from "@/components/group-card";
import { type PrivVector, usePrivEscData } from "@/lib/privesc-data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const ADCS_LAB_URL = "https://github.com/heindall92/ADCS-ESC-Lab";

interface VectorDetailProps {
  vector: PrivVector;
}

export function VectorDetail({ vector }: VectorDetailProps) {
  const { getGroupById } = usePrivEscData();
  const { t, lang } = useI18n();
  const group = getGroupById(vector.category);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <header className="space-y-4 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="text-sm font-semibold"
            style={{ borderColor: group?.color, color: group?.color }}
          >
            {vector.shortName}
          </Badge>
          {group && (
            <Badge variant="secondary" className="text-xs">
              {group.label}
            </Badge>
          )}
          <DifficultyBadge difficulty={vector.difficulty} lang={lang} />
          {vector.source === "course" && (
            <Badge className="bg-primary/15 text-primary text-xs">{t("vector.courseBadge")}</Badge>
          )}
          {vector.stub && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {t("vector.stubBadge")}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {vector.name}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">{vector.tagline}</p>
      </header>

      <Section icon={Lightbulb} title={t("vector.oneLiner")}>
        <p className="text-sm leading-relaxed text-foreground">{vector.oneLiner}</p>
      </Section>

      <Section icon={ShieldAlert} title={t("vector.why")}>
        <p className="text-sm leading-relaxed text-foreground">{vector.whyItMatters}</p>
      </Section>

      <Section icon={Crosshair} title={t("vector.signature")}>
        <ul className="space-y-2">
          {vector.signature.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {vector.prerequisites.length > 0 && (
        <Section icon={BookOpen} title={t("vector.requires")}>
          <ul className="space-y-2">
            {vector.prerequisites.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section icon={Terminal} title={t("vector.attack")}>
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">{t("vector.labOnly")}</p>
        <ol className="space-y-4">
          {vector.attackSteps.map((step, i) => (
            <li key={i} className="rounded-lg border border-border/60 bg-card/40 p-4">
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-xs font-semibold text-primary">
                  {lang === "en" ? "Step" : "Paso"} {i + 1}
                </span>
                <span className="text-sm font-medium text-foreground">{step.title}</span>
              </div>
              {step.command && (
                <div className="mb-2">
                  <CodeBlock code={step.command} title={t("vector.command")} />
                </div>
              )}
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/80">{t("vector.whyStep")}: </span>
                {step.why}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section icon={Shield} title={t("vector.harden")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/60 p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">{t("vector.detection")}</h3>
            <ul className="space-y-2">
              {vector.detection.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed text-muted-foreground">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <h3 className="mb-2 text-sm font-semibold text-foreground">{t("vector.hardening")}</h3>
            <ul className="space-y-2">
              {vector.hardening.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed text-muted-foreground">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {vector.tools.length > 0 && (
        <Section icon={AlertTriangle} title={t("vector.tools")}>
          <p className="mb-2 text-xs text-muted-foreground">{t("vector.toolsNote")}</p>
          <div className="flex flex-wrap gap-2">
            {vector.tools.map((tool) => (
              <Badge key={tool} variant="outline" className="font-mono text-xs">
                {tool}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {vector.relatedAdcsLab && (
        <a
          href={ADCS_LAB_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 transition hover:bg-primary/15"
        >
          <div>
            <div className="text-sm font-semibold text-foreground">{t("vector.adcsCta")}</div>
            <div className="text-xs text-muted-foreground">{ADCS_LAB_URL}</div>
          </div>
          <ExternalLink className="h-5 w-5 shrink-0 text-primary" />
        </a>
      )}

      {group && (
        <div className="pt-4">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {t("vector.relatedGroup")}
          </h3>
          <GroupCard group={group} />
        </div>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      <div className="pl-7">{children}</div>
    </section>
  );
}

function DifficultyBadge({
  difficulty,
  lang,
}: {
  difficulty: "beginner" | "intermediate";
  lang: "es" | "en";
}) {
  const label =
    difficulty === "beginner"
      ? lang === "en"
        ? "Beginner"
        : "Principiante"
      : lang === "en"
        ? "Intermediate"
        : "Intermedio";
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        difficulty === "beginner" && "border-primary/50 text-primary",
        difficulty === "intermediate" && "border-accent/50 text-accent-foreground",
      )}
    >
      {label}
    </Badge>
  );
}

/** @deprecated */
export { VectorDetail as EscDetail };
