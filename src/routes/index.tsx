import { Link, createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  FileTerminal,
  Grid3X3,
  Shield,
  ShieldAlert,
  Table2,
  Terminal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePrivEscData } from "@/lib/privesc-data";
import { HomeTutorial } from "@/components/home-tutorial";
import { HeroStage } from "@/components/hero-stage";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AD PrivEsc Lab — Aprende privilege escalation por firma" },
      {
        name: "description",
        content:
          "Lab visual local: privilegios Se*, Kerberos, ACL y delegación. Pedagógico, para labs autorizados.",
      },
      { property: "og:title", content: "AD PrivEsc Lab" },
      {
        property: "og:description",
        content: "Reconoce vectores de privilege escalation por su firma. Solo labs autorizados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const TERMINAL_LINES = [
  { t: "$ whoami /priv", cls: "text-code-command" },
  { t: "PRIVILEGES INFORMATION", cls: "text-code-comment" },
  { t: "SeImpersonatePrivilege    Impersonate a client after auth    Enabled", cls: "text-primary" },
  { t: "SeDebugPrivilege          Debug programs                     Disabled", cls: "text-code-comment" },
  { t: "[!] Firma: SeImpersonate Enabled → vector local (Potato en lab)", cls: "text-warning" },
  { t: "$ GetUserSPNs ... -request", cls: "text-code-command" },
  { t: "[*] SPN svc_sql → TGS listo para roast (offline)", cls: "text-primary" },
  { t: "[+] Siguiente: abrir ficha → practicar → mitigar", cls: "text-code-string" },
];

function HomePage() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const { vectors, groups } = usePrivEscData();
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (reduce) {
      setVisible(TERMINAL_LINES.length);
      return;
    }
    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id) return;
      id = setInterval(() => {
        setVisible((v) => (v >= TERMINAL_LINES.length ? 1 : v + 1));
      }, 750);
    };
    const stop = () => {
      if (id) {
        clearInterval(id);
        id = null;
      }
    };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduce]);

  const fade = reduce
    ? { initial: false, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="relative pb-20">
      {/* First composition: banner edge-to-edge in the content column */}
      <HeroStage />

      <div className="mt-12 space-y-16 px-4 md:px-8">
      <motion.div
            {...fade}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="panel-elevated relative mx-auto max-w-7xl overflow-hidden rounded-2xl"
            role="img"
            aria-label="Ejemplo de whoami /priv y firma de Kerberoasting en un laboratorio autorizado"
          >
            <div
              className="flex items-center gap-2 border-b border-border/60 bg-background/60 px-4 py-2.5"
              aria-hidden="true"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="ml-2 font-mono text-[11px] text-muted-foreground">
                whoami /priv — lab.local
              </span>
              <Terminal className="ml-auto h-3.5 w-3.5 text-muted-foreground/70" />
            </div>
            <div
              className="min-h-[260px] bg-terminal p-5 font-mono text-[13px] leading-relaxed sm:p-6"
              aria-hidden="true"
            >
              {TERMINAL_LINES.slice(0, visible).map((l, i) => (
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className={l.cls}
                >
                  {l.t}
                  {i === visible - 1 && <span className="caret" aria-hidden="true" />}
                </motion.div>
              ))}
            </div>
          </motion.div>

      {/* ================= ETHICAL WARNING ================= */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-warning/25 bg-warning/5 p-6 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-warning/20 bg-warning/10 text-warning">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-foreground">{t("home.legal.title")}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t("home.legal.body1")}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{t("home.legal.body2")}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= GROUPS ================= */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-2xl"
        >
          <p className="eyebrow text-muted-foreground">{t("home.groups.eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            {t("home.groups.title")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("home.groups.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, idx) => {
            const count = vectors.filter((e) => e.category === group.id).length;
            return (
              <motion.div
                key={group.id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
              >
                <Link
                  to="/mapa"
                  className="group panel-elevated block h-full rounded-2xl p-6 transition-colors duration-300 hover:border-border"
                  style={{ borderLeftWidth: "3px", borderLeftColor: group.color }}
                >
                  <div
                    className="mb-4 font-mono text-xs font-medium uppercase tracking-wider"
                    style={{ color: group.color }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{group.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.description}</p>
                  <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">
                      {count} {t("home.groups.escs")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                      {t("home.groups.explore")}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= JOURNEY + TUTORIAL ================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="journey-layout">
          <div className="journey-area-header max-w-2xl">
            <p className="eyebrow text-muted-foreground">{t("home.journey.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              {t("home.journey.title")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("home.cta2.desc")}
            </p>
          </div>

          <div className="journey-area-nav glass-surface overflow-hidden rounded-2xl">
            {[
              { icon: BookOpen, title: "Solo curso", desc: "Los 11 Se* del profesor, paso a paso.", to: "/curso" as const },
              { icon: Brain, title: "Mapa", desc: "Categorías Local, Kerberos, ACL, Delegación…", to: "/mapa" as const },
              { icon: Table2, title: "Tabla maestra", desc: "Todos los vectores en una vista comparable.", to: "/tabla" as const },
              { icon: ShieldAlert, title: "Hardening", desc: "Quita privilegios y ACL que nadie necesita.", to: "/parche" as const },
              { icon: Grid3X3, title: "Tabla de decisión", desc: "Si ves esta firma → abre este vector.", to: "/decision" as const },
              { icon: Shield, title: "Blue Team", desc: "Detección y hardening por categoría.", to: "/blue-team" as const },
              { icon: FileTerminal, title: "Cheat sheet", desc: "Firmas rápidas siempre a mano.", to: "/cheat-sheet" as const },
              { icon: BookOpen, title: "ADCS (lab hermano)", desc: "ESC1–16 viven en ADCS-ESC-Lab.", to: "/adcs" as const },
            ].map((item, idx, arr) => (
              <Link
                key={item.title}
                to={item.to}
                className={cn(
                  "glass-list-row group flex items-start gap-4 px-5 py-4 transition-colors duration-300 sm:items-center sm:px-6 sm:py-5",
                  idx < arr.length - 1 && "border-b",
                )}
              >
                <div className="glass-chip flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors group-hover:text-primary sm:h-11 sm:w-11">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold tracking-tight text-foreground">{item.title}</div>
                  <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</div>
                </div>
                <ArrowRight className="mt-1 hidden h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:mt-0 sm:block" />
              </Link>
            ))}
          </div>

          <div className="journey-area-flow glass-surface rounded-2xl p-5 sm:p-6">
            <p className="eyebrow text-muted-foreground">Flujo de identificación</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Cada hallazgo sigue la misma cadena: mira la firma, abre la ficha y practica en lab.
            </p>
            <ol className="mt-5 grid gap-3 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-3">
              {[
                { n: "01", label: "whoami /priv", hint: "¿Hay Se* Enabled?" },
                { n: "02", label: "firma → vector", hint: "Abre la ficha correcta" },
                { n: "03", label: "practicar · mitigar", hint: "Lab + blue team" },
              ].map((step) => (
                <li
                  key={step.n}
                  className="glass-chip rounded-xl px-4 py-4"
                >
                  <div className="font-mono text-xs text-primary">{step.n}</div>
                  <div className="mt-1.5 text-sm font-medium leading-snug text-foreground">{step.label}</div>
                  <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.hint}</div>
                </li>
              ))}
            </ol>
          </div>

          <div className="journey-area-tutorial glass-surface rounded-2xl p-5 sm:p-6">
            <HomeTutorial embedded />
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="journey-area-cta glass-surface-strong rounded-2xl p-10 text-center sm:p-12"
          >
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              <span className="text-accent-line">{t("home.cta2.a")}</span>
              <br />
              {t("home.cta2.b")}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              {t("home.cta2.desc")}
            </p>
            <Button asChild size="lg" className="mt-8 h-11 gap-2 rounded-lg px-8 text-sm font-medium">
              <Link to="/mapa">
                {t("home.cta2.button")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      </div>
    </div>
  );
}
