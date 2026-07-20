import { BookMarked } from "lucide-react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface GlossaryEntry {
  term: string;
  short: string;
  long: string;
  href?: string;
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  labonly: {
    term: "Lab autorizado",
    short: "Entorno controlado",
    long: "Solo practica en laboratorios donde tengas permiso explícito (HTB, GOAD, VulnLab, Dockerlabs o infra propia). Nunca pruebes estas técnicas en redes ajenas.",
  },
  privilege: {
    term: "Privilegio",
    short: "Permiso del sistema",
    long: "Derecho concreto que Windows concede a un proceso o usuario (p. ej. cargar un driver, hacer backup o impersonar un token). En local, los Se* son la primera pista.",
    href: "/curso",
  },
  token: {
    term: "Token",
    short: "Identidad en ejecución",
    long: "Objeto de seguridad que representa quién eres en ese momento (usuario, grupos, privilegios). Impersonar un token de SYSTEM o de un admin es el objetivo de muchos vectores locales.",
  },
  seimpersonate: {
    term: "SeImpersonatePrivilege",
    short: "Impersonación local",
    long: "Privilegio que permite suplantar otro usuario en el mismo equipo. Si whoami /priv lo muestra habilitado, vectores como PrintSpoofer, RoguePotato o Juicy Potato entran en juego.",
    href: "/vector/se-impersonate",
  },
  kerberoast: {
    term: "Kerberoast",
    short: "Crackeo de cuentas de servicio",
    long: "Ataque contra cuentas con SPN registrado: pides un TGS cifrado con la contraseña del servicio y lo crackeas offline. Es reconocimiento de dominio, no escalada local.",
    href: "/vector/kerberoasting",
  },
  acl: {
    term: "ACL",
    short: "Lista de control de acceso",
    long: "Conjunto de permisos (ACE) sobre un objeto de AD o del sistema de ficheros. GenericAll, WriteDacl o GenericWrite sobre usuarios, grupos o GPOs abren rutas de escalada.",
    href: "/mapa",
  },
  bloodhound: {
    term: "BloodHound",
    short: "Grafo de AD",
    long: "Herramienta que visualiza rutas de ataque en Active Directory a partir de datos recopilados (SharpHound). Úsala cuando ya tengas foothold de dominio, no antes de cerrar el host local.",
    href: "/mapa",
  },
  dcsync: {
    term: "DCSync",
    short: "Réplica de secretos del DC",
    long: "Técnica que simula un controlador de dominio para extraer hashes (incluido krbtgt). Requiere permisos de replicación sobre el dominio; suele ser el objetivo final de una cadena ACL → admin.",
    href: "/vector/dcsync",
  },
};

interface GlossaryChipsProps {
  keys: string[];
  className?: string;
}

/**
 * Chips clicables. En desktop se muestra la definición en HoverCard (hover/foco);
 * en móvil se activa por tap con Popover para mantener la accesibilidad táctil.
 */
export function GlossaryChips({ keys, className }: GlossaryChipsProps) {
  const entries = keys.map((k) => GLOSSARY[k]).filter(Boolean);
  if (entries.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
        Glosario del paso
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {entries.map((e) => (
          <li key={e.term}>
            <GlossaryChip entry={e} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function GlossaryChip({ entry }: { entry: GlossaryEntry }) {
  const label = (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 font-mono text-xs text-primary transition-colors hover:border-primary/60 hover:bg-primary/10 focus-visible:border-primary"
      aria-label={`Definición de ${entry.term}`}
    >
      {entry.term}
    </button>
  );

  const body = (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-sm font-semibold text-primary">{entry.term}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{entry.short}</span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{entry.long}</p>
      {entry.href && (
        <a
          href={entry.href}
          className="inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Abrir referencia →
        </a>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: hover / focus */}
      <span className="hidden md:inline-block">
        <HoverCard openDelay={120} closeDelay={80}>
          <HoverCardTrigger asChild>{label}</HoverCardTrigger>
          <HoverCardContent className="w-72 border-primary/20" side="top" align="start">
            {body}
          </HoverCardContent>
        </HoverCard>
      </span>
      {/* Móvil: tap */}
      <span className="inline-block md:hidden">
        <Popover>
          <PopoverTrigger asChild>{label}</PopoverTrigger>
          <PopoverContent className="w-64 border-primary/20" side="top" align="start">
            {body}
          </PopoverContent>
        </Popover>
      </span>
    </>
  );
}
