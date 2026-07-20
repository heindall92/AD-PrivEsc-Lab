# AD-PrivEsc-Lab Implementation Plan

> **For agentic workers:** Implement task-by-task. Checkboxes track progress.

**Goal:** Laboratorio web local pedagógico de AD Privilege Escalation, calcando ADCS-ESC-Lab, con 11 Se* del curso + vectores OCD + puente a ADCS.

**Architecture:** Clonar ADCS-ESC-Lab; reemplazar datos ESC por `PrivVector`; renombrar rutas/componentes; pedagogía (Solo curso, plantilla 5 bloques, glosario).

**Tech Stack:** React 19, TanStack Start, TypeScript, Tailwind, Vite/Nitro (heredado).

**Spec:** `docs/superpowers/specs/2026-07-20-ad-privesc-lab-design.md`

---

### Task 1: Scaffold & rebrand

- [ ] Copiar código de ADCS-ESC-Lab al root del proyecto (preservar docs/superpowers y captura)
- [ ] Actualizar `package.json` name → `ad-privesc-lab`
- [ ] Reescribir README + AGENTS.md + aviso legal
- [ ] Renombrar strings UI ADCS/ESC → PrivEsc/Vectores

### Task 2: Types & data layer

- [ ] Crear `src/lib/data/types.ts` con PrivVector / PrivCategory
- [ ] Crear `privesc.es.ts` / `privesc.en.ts` con 11 Se* + kerberos + acl + delegation + stubs
- [ ] Actualizar `index.ts` exports; retirar adcs-data o adaptar fachada

### Task 3: Routes & components

- [ ] `/esc/$escId` → `/vector/$vectorId` + `vector-detail.tsx`
- [ ] Añadir `/curso` y `/adcs`
- [ ] Adaptar mapa, tabla, práctica, decisión, cheat-sheet, blue-team, parche, sidebar, home

### Task 4: Pedagogy UX

- [ ] Filtro Solo curso / plantilla 5 bloques en ficha
- [ ] Glosario términos clave
- [ ] Tutorial home alineado al flujo whoami → firma → vector

### Task 5: Polish & verify

- [ ] i18n keys ES/EN
- [ ] Multimedia: mover captura profesor; placeholders screenshots
- [ ] `npm install` + `npm run build` (o dev) sin errores críticos
