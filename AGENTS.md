# AD PrivEsc Lab — notas para agentes

Lab educativo local sobre privilege escalation en Active Directory / Windows. Stack: TanStack Start, React 19, Tailwind v4, Nitro. Metodología calcada de ADCS-ESC-Lab.

## Desarrollo local

```bash
npm install
npm run dev    # http://localhost:8080
npm run build
npm run preview
```

## Convenciones

- i18n ES/EN en `src/lib/i18n.tsx` y datos en `src/lib/data/privesc.{es,en}.ts`
- Tema glass global en `src/styles.css`
- Pedagogía: firma → ficha (5 bloques) → práctica → blue team
- Ruta curso `/curso` = 11 Se* del material del profesor
- ADCS ESC1–16: enlace a https://github.com/heindall92/ADCS-ESC-Lab (no duplicar)
- Referencia taxonomía: Orange Cyberdefense AD mindmap 2025.03 (atribución en README)
- Solo entornos de laboratorio autorizados

## Rutas principales

| Ruta | Uso |
|------|-----|
| `/` | Home + tutorial |
| `/curso` | Solo los 11 Se* |
| `/mapa` | Mapa por categorías |
| `/tabla` | Tabla comparativa |
| `/vector/$vectorId` | Ficha pedagógica |
| `/practica` | Escenarios guiados |
| `/decision` | Firma → acción |
| `/cheat-sheet` | Referencia rápida |
| `/blue-team` | Mitigaciones |
| `/parche` | Hardening |
| `/adcs` | Puente a ADCS-ESC-Lab |
