import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

type Dict = Record<string, string>;

const es: Dict = {
  "app.name": "PrivEsc Lab",
  "app.tagline": "AD Privilege Escalation",
  "nav.sections": "Secciones",
  "nav.vectors": "Vectores",
  "nav.escCases": "Vectores",
  "nav.home": "Inicio",
  "nav.course": "Solo curso",
  "nav.map": "Mapa",
  "nav.masterTable": "Tabla maestra",
  "nav.practice": "Práctica guiada",
  "nav.patch": "Hardening",
  "nav.decision": "Tabla de decisión",
  "nav.blueTeam": "Blue Team",
  "nav.cheatSheet": "Cheat Sheet",
  "nav.adcs": "ADCS (lab)",

  "a11y.skip": "Saltar al contenido",
  "a11y.themeToggle": "Cambiar tema",
  "a11y.langToggle": "Cambiar idioma",
  "a11y.accentToggle": "Cambiar acento",
  "a11y.accentPicker": "Elegir color de acento",
  "theme.accentColor": "Color de acento",
  "accent.blue": "Azul",
  "accent.green": "Verde",
  "accent.yellow": "Amarillo",
  "accent.orange": "Naranja",
  "accent.red": "Rojo",
  "accent.pink": "Rosa",
  "accent.purple": "Púrpura",
  "accent.teal": "Turquesa",
  "accent.coral": "Coral",
  "theme.light": "Claro",
  "theme.dark": "Oscuro",

  "home.badge": "AD PrivEsc · Lab educativo",
  "home.title1": "Reconoce la",
  "home.title2": "firma del vector.",
  "home.title3": "Luego escala con método.",
  "home.subtitle":
    "Laboratorio visual local: privilegios Se* del curso, vectores de dominio (Kerberos, ACL, delegación) y puente a ADCS-ESC-Lab. Pensado para quien empieza de cero.",
  "home.cta.start": "Empezar por el curso (11 Se*)",
  "home.cta.explore": "Explorar el mapa",
  "home.stat.cases": "Vectores",
  "home.stat.groups": "Categorías",
  "home.stat.steps": "Firma · ficha · practica · mitiga",
  "home.stat.edu": "Uso educativo",
  "home.legal.title": "Aviso legal y ético",
  "home.legal.body1":
    "Cada técnica puede elevar privilegios en Active Directory o Windows. Úsala solo en sistemas propios, laboratorios autorizados (HTB, TryHackMe, GOAD, VulnHub) o auditorías con autorización escrita.",
  "home.legal.body2":
    "El mindmap de Orange Cyberdefense se usa como referencia pedagógica con atribución. No ataques redes sin permiso.",
  "home.groups.eyebrow": "Categorías",
  "home.groups.title": "Empieza por Local / Se*. El resto engorda el superlab.",
  "home.groups.subtitle": "Aprende a reconocer el patrón antes que la herramienta.",
  "home.groups.escs": "vectores",
  "home.groups.explore": "Explorar",
  "home.journey.eyebrow": "Tu recorrido",
  "home.journey.title": "De whoami /priv al Domain Admin… con método.",
  "home.cta2.a": "Aprende viendo.",
  "home.cta2.b": "Identifica al instante.",
  "home.cta2.desc": "Cada vector tiene una firma. Este lab te entrena para verla.",
  "home.cta2.button": "Entrar al mapa",

  "vector.oneLiner": "En una frase",
  "vector.why": "Por qué importa",
  "vector.signature": "Cómo lo reconoces",
  "vector.requires": "Antes de empezar",
  "vector.attack": "Pasos en el lab",
  "vector.labOnly": "Solo entornos controlados y autorizados. Cada comando incluye el “para qué”.",
  "vector.command": "Comando de referencia",
  "vector.whyStep": "Para qué",
  "vector.harden": "Detección y mitigación",
  "vector.detection": "Detección",
  "vector.hardening": "Hardening",
  "vector.tools": "Herramientas (referencia)",
  "vector.toolsNote": "No son magia: primero la firma, luego la tool del lab.",
  "vector.adcsCta": "Abrir ADCS-ESC-Lab (ESC1–ESC16)",
  "vector.relatedGroup": "Categoría relacionada",
  "vector.courseBadge": "Curso",
  "vector.stubBadge": "En expansión",

  "curso.eyebrow": "Ruta del curso",
  "curso.title": "Los 11 privilegios Se*",
  "curso.subtitle":
    "Material del profesor, explicado para principiantes. Una ficha = una idea. Cuando termines, pasa a Kerberos y ACL.",

  "adcs.title": "Certificados ADCS → lab hermano",
  "adcs.body":
    "Este superlab no duplica ESC1–ESC16. Si tu firma apunta a plantillas o a la CA, continúa en ADCS-ESC-Lab con la misma metodología (find → firma → ESC → mitigar).",
  "adcs.cta": "Ir a ADCS-ESC-Lab en GitHub",
};

const en: Dict = {
  "app.name": "PrivEsc Lab",
  "app.tagline": "AD Privilege Escalation",
  "nav.sections": "Sections",
  "nav.vectors": "Vectors",
  "nav.escCases": "Vectors",
  "nav.home": "Home",
  "nav.course": "Course only",
  "nav.map": "Map",
  "nav.masterTable": "Master table",
  "nav.practice": "Guided practice",
  "nav.patch": "Hardening",
  "nav.decision": "Decision table",
  "nav.blueTeam": "Blue Team",
  "nav.cheatSheet": "Cheat sheet",
  "nav.adcs": "ADCS (lab)",

  "a11y.skip": "Skip to content",
  "a11y.themeToggle": "Toggle theme",
  "a11y.langToggle": "Toggle language",
  "a11y.accentToggle": "Toggle accent",
  "a11y.accentPicker": "Pick accent color",
  "theme.accentColor": "Accent color",
  "accent.blue": "Blue",
  "accent.green": "Green",
  "accent.yellow": "Yellow",
  "accent.orange": "Orange",
  "accent.red": "Red",
  "accent.pink": "Pink",
  "accent.purple": "Purple",
  "accent.teal": "Teal",
  "accent.coral": "Coral",
  "theme.light": "Light",
  "theme.dark": "Dark",

  "home.badge": "AD PrivEsc · Educational lab",
  "home.title1": "Spot the",
  "home.title2": "vector signature.",
  "home.title3": "Then escalate with method.",
  "home.subtitle":
    "Local visual lab: course Se* privileges, domain vectors (Kerberos, ACL, delegation), and a bridge to ADCS-ESC-Lab. Built for absolute beginners.",
  "home.cta.start": "Start with the course (11 Se*)",
  "home.cta.explore": "Explore the map",
  "home.stat.cases": "Vectors",
  "home.stat.groups": "Categories",
  "home.stat.steps": "Signature · card · practice · mitigate",
  "home.stat.edu": "Educational only",
  "home.legal.title": "Legal & ethical notice",
  "home.legal.body1":
    "Each technique can raise privileges in Active Directory or Windows. Use only on systems you own, authorized labs (HTB, TryHackMe, GOAD, VulnHub), or engagements with written authorization.",
  "home.legal.body2":
    "The Orange Cyberdefense mindmap is used as pedagogical reference with attribution. Do not attack networks without permission.",
  "home.groups.eyebrow": "Categories",
  "home.groups.title": "Start with Local / Se*. The rest grows the superlab.",
  "home.groups.subtitle": "Learn to recognize the pattern before the tool.",
  "home.groups.escs": "vectors",
  "home.groups.explore": "Explore",
  "home.journey.eyebrow": "Your journey",
  "home.journey.title": "From whoami /priv to Domain Admin… with method.",
  "home.cta2.a": "Learn by seeing.",
  "home.cta2.b": "Identify instantly.",
  "home.cta2.desc": "Every vector has a signature. This lab trains you to spot it.",
  "home.cta2.button": "Enter the map",

  "vector.oneLiner": "In one sentence",
  "vector.why": "Why it matters",
  "vector.signature": "How you recognize it",
  "vector.requires": "Before you start",
  "vector.attack": "Lab steps",
  "vector.labOnly": "Authorized labs only. Every command includes the “why”.",
  "vector.command": "Reference command",
  "vector.whyStep": "Why",
  "vector.harden": "Detection & mitigation",
  "vector.detection": "Detection",
  "vector.hardening": "Hardening",
  "vector.tools": "Tools (reference)",
  "vector.toolsNote": "Tools are not magic: signature first, then the lab tool.",
  "vector.adcsCta": "Open ADCS-ESC-Lab (ESC1–ESC16)",
  "vector.relatedGroup": "Related category",
  "vector.courseBadge": "Course",
  "vector.stubBadge": "Expanding",

  "curso.eyebrow": "Course track",
  "curso.title": "The 11 Se* privileges",
  "curso.subtitle":
    "Course material explained for beginners. One card = one idea. Then move to Kerberos and ACL.",

  "adcs.title": "ADCS certificates → sibling lab",
  "adcs.body":
    "This superlab does not duplicate ESC1–ESC16. If your signature points to templates or the CA, continue in ADCS-ESC-Lab with the same methodology.",
  "adcs.cta": "Go to ADCS-ESC-Lab on GitHub",
};

const dictionaries: Record<Lang, Dict> = { es, en };

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "ad-privesc-lab-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    let initial: Lang = "es";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "es" || stored === "en") initial = stored;
      else if (
        typeof navigator !== "undefined" &&
        navigator.language?.toLowerCase().startsWith("en")
      )
        initial = "en";
    } catch {
      /* ignore */
    }
    setLangState(initial);
    if (typeof document !== "undefined") document.documentElement.lang = initial;
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      toggle: () => setLang(lang === "es" ? "en" : "es"),
      t: (key: string) => dictionaries[lang][key] ?? dictionaries.es[key] ?? key,
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
