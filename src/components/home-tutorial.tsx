import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Compass,
  Eye,
  Fingerprint,
  Globe,
  GraduationCap,
  RotateCcw,
  Shield,
  Target,
  TerminalSquare,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/code-block";
import { GlossaryChips } from "@/components/glossary";
import { cn } from "@/lib/utils";

interface Checkpoint {
  id: string;
  label: string;
}

type PreviewTone = "cmd" | "info" | "warn" | "hit" | "ok" | "muted" | "dim";

interface PreviewLine {
  t: string;
  tone?: PreviewTone;
}

interface StepPreview {
  title: string;
  caption?: string;
  lines: PreviewLine[];
}

interface Step {
  id: string;
  icon: typeof Compass;
  title: string;
  goal: string;
  command?: string;
  checkpoints: Checkpoint[];
  glossary?: string[];
  preview?: StepPreview;
  signals?: string[];
  links?: { to: string; label: string }[];
}

const STEPS: Step[] = [
  {
    id: "s1-lab",
    icon: Compass,
    title: "Confirma lab y foothold",
    goal: "Trabaja solo en entornos autorizados y consigue acceso inicial: credenciales de bajo privilegio o shell en el objetivo.",
    checkpoints: [
      { id: "c1", label: "Lab autorizado (HTB, GOAD, VulnLab, Dockerlabs o propio)" },
      { id: "c2", label: "Tienes credenciales válidas o shell como usuario sin admin" },
      { id: "c3", label: "Sabes si el objetivo es Windows local, miembro de dominio o ambos" },
    ],
    glossary: ["labonly", "privilege"],
    preview: {
      title: "Foothold típico en un lab",
      caption: "Antes de escalar: confirma acceso y contexto del host.",
      lines: [
        { t: "$ nxc smb 10.10.10.50 -u lowpriv -p 'Password1!'", tone: "cmd" },
        { t: "SMB   10.10.10.50  445  WS01   [+] lab.local\\lowpriv:Password1!", tone: "ok" },
        { t: "$ evil-winrm -i 10.10.10.50 -u lowpriv -p 'Password1!'", tone: "cmd" },
        { t: "Evil-WinRM shell", tone: "info" },
        { t: "PS C:\\Users\\lowpriv> hostname", tone: "cmd" },
        { t: "WS01", tone: "muted" },
        { t: "PS C:\\Users\\lowpriv> systeminfo | findstr /B /C:\"Domain\"", tone: "cmd" },
        { t: "Domain:                    lab.local", tone: "hit" },
      ],
    },
    signals: [
      "Las credenciales funcionan contra SMB o WinRM en el objetivo.",
      "La sesión corre como usuario estándar, no como Administrator ni SYSTEM.",
      "systeminfo indica si el host pertenece a un dominio.",
      "Tienes permiso explícito para atacar ese entorno.",
    ],
  },
  {
    id: "s2-whoami",
    icon: Shield,
    title: "Enumera privilegios locales",
    goal: "Ejecuta whoami /priv y localiza privilegios Se* habilitados: son la firma de escalada en el host.",
    command: "whoami /priv",
    checkpoints: [
      { id: "c1", label: "Ejecutaste whoami /priv en la sesión actual" },
      { id: "c2", label: "Identificas al menos un Se* en estado Enabled" },
      { id: "c3", label: "Anotas el nombre exacto (p. ej. SeImpersonatePrivilege)" },
    ],
    glossary: ["privilege", "seimpersonate", "token"],
    preview: {
      title: "Salida de whoami /priv",
      caption: "Los Se* habilitados delatan el vector local.",
      lines: [
        { t: "PS C:\\Users\\lowpriv> whoami /priv", tone: "cmd" },
        { t: "PRIVILEGES INFORMATION", tone: "dim" },
        { t: "----------------------", tone: "dim" },
        { t: "Privilege Name                Description                          State", tone: "muted" },
        { t: "SeChangeNotifyPrivilege       Bypass traverse checking             Enabled", tone: "muted" },
        { t: "SeImpersonatePrivilege        Impersonate a client after auth.     Enabled  ← FIRMA", tone: "hit" },
        { t: "SeIncreaseWorkingSetPrivilege Increase a process working set       Disabled", tone: "muted" },
        { t: "SeAssignPrimaryTokenPrivilege Replace a process level token        Disabled", tone: "muted" },
        { t: "# SeImpersonate → PrintSpoofer / RoguePotato / Juicy Potato", tone: "ok" },
      ],
    },
    signals: [
      "Aparece la tabla PRIVILEGES INFORMATION con columna State.",
      "Al menos un privilegio Se* figura como Enabled.",
      "SeImpersonatePrivilege habilitado es la firma más común en labs.",
      "SeAssignPrimaryToken o SeBackup también pueden abrir vectores concretos.",
    ],
  },
  {
    id: "s3-signature",
    icon: Fingerprint,
    title: "Lee la firma y abre la ficha",
    goal: "No memorices nombres: cruza el Se* o síntoma con la ficha pedagógica en /curso o /vector.",
    checkpoints: [
      { id: "c1", label: "Nombras la firma observada (Se*, servicio, ACL…)" },
      { id: "c2", label: "Abres la ficha del vector en /curso o /vector/$id" },
      { id: "c3", label: "Lees los 5 bloques: qué es, firma, explotación, detección, mitigación" },
    ],
    glossary: ["privilege", "token"],
    preview: {
      title: "De la firma a la ficha",
      caption: "Misma cadena pedagógica en todo el lab.",
      lines: [
        { t: "# Firma en el host", tone: "dim" },
        { t: "  SeImpersonatePrivilege    Enabled", tone: "hit" },
        { t: "  Servicio Spooler          Running", tone: "muted" },
        { t: "# Cruce en el lab", tone: "info" },
        { t: "  /curso → SeImpersonatePrivilege (bloque del profesor)", tone: "ok" },
        { t: "  /vector/seimpersonate → ficha completa con PoC y blue team", tone: "ok" },
        { t: "# Antes de explotar: entiende requisitos y detección", tone: "warn" },
      ],
    },
    signals: [
      "La firma local (Se*, servicio, permiso NTFS) se escribe en una línea.",
      "La ficha del vector explica por qué esa firma es explotable.",
      "El bloque de mitigación te dice qué buscaría blue team.",
      "No saltas a dominio hasta cerrar la escalada local si aplica.",
    ],
    links: [
      { to: "/curso", label: "Ver curso Se*" },
      { to: "/mapa", label: "Abrir mapa de vectores" },
    ],
  },
  {
    id: "s4-domain",
    icon: Globe,
    title: "Escala en dominio (tras local)",
    goal: "Con foothold de dominio y host local resuelto, enumera Kerberos, ACLs y rutas hacia Tier 0.",
    command: "bloodhound-python -u lowpriv -p 'Password1!' -d lab.local -dc 10.10.10.10 -c All",
    checkpoints: [
      { id: "c1", label: "Completaste (o descartaste) escalada local en el host" },
      { id: "c2", label: "Recopilaste datos AD (BloodHound, ldapsearch, PowerView…)" },
      { id: "c3", label: "Identificas un vector candidato: Kerberoast, ACL abuse o DCSync" },
    ],
    glossary: ["kerberoast", "acl", "bloodhound", "dcsync"],
    preview: {
      title: "Reconocimiento de dominio",
      caption: "Solo después del host: Kerberos, ACLs y rutas en el grafo.",
      lines: [
        { t: "$ GetUserSPNs.py lab.local/lowpriv:'Password1!' -dc-ip 10.10.10.10 -request", tone: "cmd" },
        { t: "$krb5tgs$23$*svc_sql$lab.local*...  → Kerberoast", tone: "hit" },
        { t: "$ bloodhound-python -u lowpriv -p 'Password1!' -d lab.local -dc 10.10.10.10 -c All", tone: "cmd" },
        { t: "[+] Compressing output into 20260720_lab.local_bloodhound.zip", tone: "ok" },
        { t: "# En BloodHound: GenericAll sobre svc_backup → DCSync path", tone: "warn" },
        { t: "# Regla: local primero, dominio después", tone: "info" },
      ],
    },
    signals: [
      "Hay cuentas con SPN registrado susceptibles de Kerberoast.",
      "BloodHound (o equivalente) muestra ACLs peligrosas hacia objetivos Tier 0.",
      "GenericAll, WriteDacl o DCSync rights aparecen en la ruta de ataque.",
      "No mezclas vectores de host con los de AD hasta tener contexto claro.",
    ],
  },
  {
    id: "s5-practice",
    icon: GraduationCap,
    title: "Practica y revisa blue team",
    goal: "Entrena la lectura de firmas en /practica y contrasta cada vector con sus mitigaciones en /blue-team.",
    checkpoints: [
      { id: "c1", label: "Completas al menos un escenario guiado en /practica" },
      { id: "c2", label: "Revisas mitigaciones del vector que practicaste" },
      { id: "c3", label: "Puedes explicar firma → vector → mitigación sin mirar la ficha" },
    ],
    glossary: ["bloodhound", "acl"],
    preview: {
      title: "Práctica + perspectiva defensiva",
      caption: "Así cierras el ciclo pedagógico del lab.",
      lines: [
        { t: "Escenario 03 · Firma local", tone: "dim" },
        { t: "  whoami /priv → SeImpersonatePrivilege Enabled", tone: "hit" },
        { t: "Pregunta → ¿Qué vector y primer paso lógico?", tone: "info" },
        { t: "Tu respuesta → SeImpersonate · PrintSpoofer / RoguePotato", tone: "cmd" },
        { t: "[+] Correcto. Blue team: restringir SeImpersonate a cuentas de servicio.", tone: "ok" },
        { t: "→ /blue-team para detección y hardening del mismo vector", tone: "muted" },
      ],
    },
    signals: [
      "La práctica pregunta firma → vector, no solo el nombre de la herramienta.",
      "El feedback explica la relación causa-efecto del hallazgo.",
      "Cada vector enlaza detección y mitigación en /blue-team.",
      "Repites el ciclo hasta reconocer firmas sin consultar la chuleta.",
    ],
    links: [
      { to: "/practica", label: "Ir a la práctica guiada" },
      { to: "/blue-team", label: "Ver mitigaciones blue team" },
    ],
  },
];

const TONE_CLASS: Record<PreviewTone, string> = {
  cmd: "text-code-command",
  info: "text-code-comment",
  warn: "text-warning",
  hit: "text-primary",
  ok: "text-code-string",
  muted: "text-terminal-foreground/85",
  dim: "text-muted-foreground",
};

function TerminalPreview({ preview }: { preview: StepPreview }) {
  return (
    <figure className="space-y-2">
      <figcaption className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <TerminalSquare className="h-3.5 w-3.5" aria-hidden="true" />
        Vista previa · {preview.title}
      </figcaption>
      <div
        className="panel-elevated overflow-hidden rounded-xl"
        role="img"
        aria-label={`Ejemplo de salida: ${preview.title}`}
      >
        <div
          className="flex items-center gap-1.5 border-b border-border/60 bg-background/40 px-3 py-1.5"
          aria-hidden="true"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
          <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            simulación · no ejecutable
          </span>
        </div>
        <pre
          className="scroll-hidden max-h-72 overflow-x-auto overflow-y-auto bg-terminal/90 px-4 py-3 font-mono text-[12.5px] leading-relaxed"
          aria-hidden="true"
        >
          {preview.lines.map((l, i) => (
            <div key={i} className={cn("whitespace-pre", TONE_CLASS[l.tone ?? "muted"])}>
              {l.t}
            </div>
          ))}
        </pre>
      </div>
      {preview.caption && (
        <p className="text-xs text-muted-foreground">{preview.caption}</p>
      )}
    </figure>
  );
}

const STORAGE_KEY = "ad-privesc-lab.tutorial.checkpoints.v1";
const COMPARE_KEY = "ad-privesc-lab.tutorial.comparisons.v1";

type CheckMap = Record<string, boolean>;
type CompareVerdict = "match" | "miss";
type CompareMap = Record<string, CompareVerdict>;

function usePersistentMap<T extends Record<string, unknown>>(storageKey: string) {
  const [state, setState] = useState<T>({} as T);
  const [hydrated, setHydrated] = useState(false);
  const skipPersistRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setState(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey || event.storageArea !== localStorage) return;
      skipPersistRef.current = true;
      if (!event.newValue) {
        setState({} as T);
        return;
      }
      try {
        setState(JSON.parse(event.newValue) as T);
      } catch {
        /* ignore malformed payloads from other tabs */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated, storageKey]);

  return { state, setState, hydrated };
}

function useCheckpoints() {
  const { state, setState, hydrated } = usePersistentMap<CheckMap>(STORAGE_KEY);
  const toggle = (key: string) =>
    setState((s) => ({ ...s, [key]: !s[key] }));
  const reset = () => setState({});
  return { state, toggle, reset, hydrated };
}

function useComparisons() {
  const { state, setState, hydrated } = usePersistentMap<CompareMap>(COMPARE_KEY);
  const setVerdict = (key: string, verdict: CompareVerdict) =>
    setState((s) => {
      if (s[key] === verdict) {
        const next = { ...s };
        delete next[key];
        return next;
      }
      return { ...s, [key]: verdict };
    });
  const resetStep = (stepId: string) =>
    setState((s) => {
      const next: CompareMap = {};
      const prefix = `${stepId}.`;
      for (const k of Object.keys(s)) if (!k.startsWith(prefix)) next[k] = s[k];
      return next;
    });
  return { state, setVerdict, resetStep, hydrated };
}

export function HomeTutorial({ embedded = false }: { embedded?: boolean }) {
  const reduce = useReducedMotion();
  const { state, toggle, reset, hydrated } = useCheckpoints();
  const {
    state: compareState,
    setVerdict,
    resetStep: resetStepCompare,
    hydrated: compareHydrated,
  } = useComparisons();
  const [activeStep, setActiveStep] = useState(-1);

  const stepProgress = useMemo(() => {
    return STEPS.map((step) => {
      const done = step.checkpoints.filter((c) => state[`${step.id}.${c.id}`]).length;
      return { done, total: step.checkpoints.length, complete: done === step.checkpoints.length };
    });
  }, [state]);

  const totalDone = stepProgress.filter((s) => s.complete).length;
  const percent = Math.round((totalDone / STEPS.length) * 100);

  return (
    <section
      aria-labelledby={embedded ? undefined : "tutorial-heading"}
      className={cn(embedded ? "" : "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8")}
    >
      <div
        className={cn(
          "flex flex-col gap-6",
          embedded ? "md:flex-row md:items-start md:justify-between" : "mb-12 md:flex-row md:items-end md:justify-between",
        )}
      >
        {!embedded && (
          <div className="max-w-2xl">
            <p className="eyebrow text-muted-foreground">Tutorial paso a paso</p>
            <h2
              id="tutorial-heading"
              className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
            >
              Cómo escalar privilegios en AD.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Sigue los 5 pasos, marca cada checkpoint y recorre el flujo{" "}
              <code className="rounded bg-card px-1.5 py-0.5 text-primary">foothold → firma → vector</code>.
              Tu progreso se guarda automáticamente en este navegador.
            </p>
          </div>
        )}

        {embedded && (
          <div className="max-w-2xl md:flex-1">
            <p className="eyebrow text-muted-foreground">Tutorial interactivo</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              5 pasos · foothold → firma → vector
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Marca cada checkpoint mientras recorres el flujo. Tu progreso se guarda en este navegador.
            </p>
          </div>
        )}

        <div className={cn("panel-elevated rounded-2xl p-5", embedded ? "w-full md:w-80 md:shrink-0" : "md:w-72")} aria-live="polite">
          {embedded && (
            <div className="mb-4 border-b border-border/60 pb-4 md:hidden">
              <p className="text-sm font-semibold text-foreground">Progreso del tutorial</p>
            </div>
          )}
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Progreso
            </span>
            <span className="font-mono text-2xl font-bold text-primary">
              {hydrated ? `${percent}%` : "—"}
            </span>
          </div>
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={hydrated ? percent : 0}
            aria-label="Progreso del tutorial"
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${hydrated ? percent : 0}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {totalDone} / {STEPS.length} pasos completados
            </span>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <ol className="relative mt-6 grid grid-cols-1 gap-3">
        <div
          className="pointer-events-none absolute left-[27px] top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-primary/40 via-border to-transparent md:block"
          aria-hidden="true"
        />
        {STEPS.map((step, i) => {
          const progress = stepProgress[i];
          const isActive = activeStep === i;
          const Icon = step.icon;
          return (
            <li
              key={step.id}
              className={cn(
                "relative min-w-0 rounded-xl border transition-colors",
                progress.complete
                  ? "border-primary/35 bg-primary/5"
                  : "panel-elevated border-border/80",
                isActive && "ring-1 ring-primary/20",
              )}
            >
              <button
                type="button"
                onClick={() => setActiveStep(isActive ? -1 : i)}
                aria-expanded={isActive}
                aria-controls={`${step.id}-panel`}
                className="flex w-full items-start gap-3 rounded-xl p-4 text-left"
              >
                <div
                  className={cn(
                    "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors",
                    progress.complete
                      ? "border-electric bg-electric text-electric-foreground"
                      : "border-border bg-background text-foreground",
                  )}
                  aria-hidden="true"
                >
                  {progress.complete ? <Check className="h-6 w-6" /> : String(i + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <span
                      className={cn(
                        "ml-auto rounded-full border px-2 py-0.5 font-mono text-xs",
                        progress.complete
                          ? "border-electric/50 text-electric"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {progress.done}/{progress.total}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{step.goal}</p>

                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={cn("h-full", progress.complete ? "bg-electric" : "bg-primary")}
                      initial={false}
                      animate={{ width: `${(progress.done / progress.total) * 100}%` }}
                      transition={{ type: "spring", stiffness: 140, damping: 22 }}
                    />
                  </div>
                </div>
              </button>

              <div
                id={`${step.id}-panel`}
                className={cn("overflow-hidden transition-[grid-template-rows] duration-300 ease-out", isActive ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]")}
              >
                <div className="min-h-0 space-y-4 border-t border-border/60 px-4 pb-5 pt-4 sm:px-5">
                  {step.command && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Comando sugerido
                      </div>
                      <CodeBlock code={step.command} title="terminal" />
                    </div>
                  )}

                  {step.preview && <TerminalPreview preview={step.preview} />}

                  {step.signals && step.signals.length > 0 && (() => {
                    const total = step.signals.length;
                    const matched = step.signals.filter(
                      (_, idx) => compareState[`${step.id}.sig${idx}`] === "match",
                    ).length;
                    const missed = step.signals.filter(
                      (_, idx) => compareState[`${step.id}.sig${idx}`] === "miss",
                    ).length;
                    const answered = matched + missed;
                    return (
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Qué mirar · comparativa
                          </div>
                          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                            {compareHydrated ? (
                              <>
                                <span className="text-electric">{matched}✓</span>
                                {" · "}
                                <span className="text-warning">{missed}✗</span>
                                {" · "}
                                {answered}/{total}
                              </>
                            ) : (
                              "—"
                            )}
                          </span>
                          {answered > 0 && (
                            <button
                              type="button"
                              onClick={() => resetStepCompare(step.id)}
                              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <RotateCcw className="h-3 w-3" aria-hidden="true" />
                              Limpiar
                            </button>
                          )}
                        </div>
                        <ul className="grid gap-2">
                          {step.signals.map((signal, idx) => {
                            const key = `${step.id}.sig${idx}`;
                            const verdict = compareState[key];
                            return (
                              <li
                                key={key}
                                className={cn(
                                  "flex items-start gap-3 rounded-xl border p-3 text-sm transition-colors",
                                  verdict === "match" && "border-electric/40 bg-electric/5",
                                  verdict === "miss" && "border-warning/40 bg-warning/5",
                                  !verdict && "border-border bg-background",
                                )}
                              >
                                <Eye
                                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                                  aria-hidden="true"
                                />
                                <span className="flex-1 text-foreground">{signal}</span>
                                <div className="flex shrink-0 items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setVerdict(key, "match")}
                                    aria-pressed={verdict === "match"}
                                    aria-label="Coincide con mi salida"
                                    title="Coincide"
                                    className={cn(
                                      "inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors",
                                      verdict === "match"
                                        ? "border-electric bg-electric text-electric-foreground"
                                        : "border-border text-muted-foreground hover:border-electric/50 hover:text-electric",
                                    )}
                                  >
                                    <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setVerdict(key, "miss")}
                                    aria-pressed={verdict === "miss"}
                                    aria-label="No coincide con mi salida"
                                    title="No coincide"
                                    className={cn(
                                      "inline-flex h-7 w-7 items-center justify-center rounded-md border transition-colors",
                                      verdict === "miss"
                                        ? "border-warning bg-warning/20 text-warning"
                                        : "border-border text-muted-foreground hover:border-warning/50 hover:text-warning",
                                    )}
                                  >
                                    <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
                                  </button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })()}

                  <div className="space-y-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Checkpoints
                    </div>
                    <ul className="grid gap-2">
                      {step.checkpoints.map((c) => {
                        const key = `${step.id}.${c.id}`;
                        const checked = !!state[key];
                        return (
                          <li key={c.id}>
                            <button
                              type="button"
                              onClick={() => toggle(key)}
                              aria-pressed={checked}
                              className={cn(
                                "group flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors",
                                checked
                                  ? "border-electric/40 bg-electric/5 text-foreground"
                                  : "border-border bg-background hover:border-electric/40 hover:bg-electric/5",
                              )}
                            >
                              {checked ? (
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-electric" aria-hidden="true" />
                              ) : (
                                <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground group-hover:text-electric" aria-hidden="true" />
                              )}
                              <span className={cn(checked && "text-foreground")}>{c.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {step.glossary && step.glossary.length > 0 && (
                    <GlossaryChips keys={step.glossary} />
                  )}

                  {step.links && step.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {step.links.map((link) => (
                        <Button key={link.to} asChild size="sm" className="gap-2">
                          <Link to={link.to}>
                            {link.label}
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  )}

                  {step.id === "s5-practice" && (
                    <Button asChild size="sm" className="gap-2">
                      <Link to="/practica">
                        Ir a la práctica guiada
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {hydrated && totalDone === STEPS.length && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="panel-elevated mt-8 flex flex-col gap-3 rounded-2xl p-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"
          role="status"
        >
          <div>
            <div className="text-sm font-semibold text-primary">Tutorial completado</div>
            <div className="text-sm text-muted-foreground">
              Ya conoces el flujo. Practica firmas y revisa mitigaciones en blue team.
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/blue-team">
                Blue team
                <Target className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link to="/practica">
                Empezar la práctica
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
