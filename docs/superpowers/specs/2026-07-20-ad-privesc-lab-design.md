# AD-PrivEsc-Lab — Design Spec

**Date:** 2026-07-20  
**Repo name:** `AD-PrivEsc-Lab`  
**Author intent:** Laboratorio web local educativo para aprender escalada de privilegios en Active Directory / Windows, calcando metodología y formato de [ADCS-ESC-Lab](https://github.com/heindall92/ADCS-ESC-Lab).

---

## 1. Goal

Ayudar a un aprendiz **que parte de cero** a reconocer vectores de privilege escalation por su **firma**, practicarlos en labs autorizados y entender mitigaciones — sin memorizar el mindmap entero.

## 2. Constraints & principles

- Solo entornos controlados y autorizados (aviso legal visible, como ADCS-ESC-Lab).
- Pedagogía primero: progresivo, una idea por pantalla, jerga con glosario.
- Base técnica: clonar ADCS-ESC-Lab y adaptar (no rehacer el framework).
- ADCS ESC1–16: **enlace** a ADCS-ESC-Lab, no duplicar.
- Fuentes de contenido:
  - **Curso:** 11 privilegios Se* del material del profesor.
  - **OCD mindmap 2025.03:** taxonomía y vectores de dominio ([atribución](https://orange-cyberdefense.github.io/ocd-mindmaps/)).
- i18n ES/EN, glass UI, tema claro/oscuro, acentos.

## 3. Pedagogy (axis of the product)

**Learning path:**

1. Foothold → ¿qué señales veo?
2. Modo **Solo curso**: 11 Se* (principiante).
3. Firma → ficha del vector.
4. Dominio: Kerberos → ACL → Delegation.
5. Práctica guiada (1 output + 1 pregunta).
6. Blue team / hardening.

**Every vector card (fixed template):**

1. En una frase (qué es)
2. Por qué importa
3. Cómo lo reconoces (firma + comando)
4. Pasos en lab (3–6, cada comando con “para qué”)
5. Cómo se mitiga

**UX aids:** glosario, badge Principiante/Intermedio, filtro Solo curso, árbol de decisión “si ves X → ve a Y”, cheat sheet por firmas.

## 4. Architecture

- Stack: React 19, TanStack Start, TypeScript, Tailwind, mismo layout/sidebar que ADCS-ESC-Lab.
- Data: `src/lib/data/privesc.{es,en}.ts` + `types.ts`.
- Routes:

| Route | Purpose |
|-------|---------|
| `/` | Home + tutorial + terminal animado |
| `/mapa` | Mapa por categorías |
| `/tabla` | Comparativa |
| `/vector/$vectorId` | Ficha |
| `/practica` | Escenarios |
| `/decision` | Árbol / tabla de decisión |
| `/cheat-sheet` | Firmas rápidas |
| `/blue-team` | Detección + hardening |
| `/parche` | Hardening checklist |
| `/adcs` | Puente a ADCS-ESC-Lab |
| `/curso` | Vista Solo curso (11 Se*) |

## 5. Content taxonomy

| Category | Source | MVP |
|----------|--------|-----|
| `local` | Curso (11 Se*) | Completo |
| `kerberos` | OCD | Completo |
| `acl` | OCD | Completo |
| `delegation` | OCD | Completo |
| `coerce`, `creds`, `trusts`, `sccm`, `mssql`, `misc` | OCD | Stubs |
| `adcs` | Puente | Enlace |

**11 Se* (course):** SeImpersonate, SeAssignPrimaryToken, SeBackup, SeRestore, SeDebug, SeTakeOwnership, SeLoadDriver, SeManageVolume, SeTcb, SeCreateToken, SeSecurity.

## 6. Data model

```ts
type PrivCategory =
  | "local" | "kerberos" | "acl" | "delegation"
  | "coerce" | "creds" | "trusts" | "adcs" | "sccm" | "mssql" | "misc"

type Difficulty = "beginner" | "intermediate"

interface PrivVector {
  id: string
  category: PrivCategory
  name: string
  shortName: string
  tagline: string
  difficulty: Difficulty
  oneLiner: string
  whyItMatters: string
  signature: string[]
  prerequisites: string[]
  attackSteps: { title: string; command?: string; why: string }[]
  detection: string[]
  hardening: string[]
  tools: string[]
  glossaryTerms?: string[]
  relatedAdcsLab?: boolean
  source: "course" | "ocd" | "both"
}
```

## 7. Out of scope (v1)

- Duplicar documentación ESC1–16.
- Automatizar explotación real / malware.
- Cobertura 100% de cada nodo OCD.
- Publicar sin aviso legal.

## 8. Phases

1. Scaffold desde ADCS-ESC-Lab + rebrand + rutas + types.
2. Contenido MVP pedagógico (local + kerberos + acl + delegation).
3. Práctica, decisión, cheat sheet, blue team, puente ADCS.
4. Stubs OCD + README + tarjeta/docs + i18n polish.

## 9. Success criteria

- Un novato puede completar el modo Solo curso sin conocimientos previos de Impacket.
- Cada ficha MVP sigue la plantilla de 5 bloques.
- `npm run dev` funciona en :8080.
- Enlace claro a ADCS-ESC-Lab.
- Aviso legal presente.
