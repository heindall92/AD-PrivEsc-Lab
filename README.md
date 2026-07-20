<p align="center">
  <img src="Multimedia/Banner.png" alt="AD PrivEsc Lab — Banner" width="100%"/>
</p>

<p align="center">
  <strong>Aprende a reconocer vectores de privilege escalation por su firma, no de memoria.</strong><br/>
  Laboratorio visual local: <code>whoami /priv → firma → vector → practicar → mitigar</code>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/TanStack_Start-1.x-FF4154?style=flat-square" alt="TanStack Start"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/License-MIT-52E695?style=flat-square" alt="MIT License"/>
  <img src="https://img.shields.io/badge/Uso-Labs_autorizados-E7B85B?style=flat-square" alt="Solo labs autorizados"/>
</p>

> **Solo para entornos controlados y autorizados:** HackTheBox, TryHackMe, VulnHub, GOAD, laboratorios propios y prácticas con permiso explícito.

---

## ¿Qué es AD PrivEsc Lab?

Aplicación web local para **aprender privilege escalation en Windows / Active Directory** con la misma metodología y formato que [ADCS-ESC-Lab](https://github.com/heindall92/ADCS-ESC-Lab):

```
whoami /priv + enum → firma → ficha /vector/$id → /practica → /blue-team
```

### Capas de contenido

1. **Curso (11 Se*)** — Material del profesor: SeImpersonate, SeAssignPrimaryToken, SeBackup, SeRestore, SeDebug, SeTakeOwnership, SeLoadDriver, SeManageVolume, SeTcb, SeCreateToken, SeSecurity. Ruta: `/curso`.
2. **Dominio (OCD)** — Kerberos, ACL/ACE, Delegation y stubs (coerce, creds, trusts, SCCM, MSSQL…), inspirado en el [mindmap AD 2025.03 de Orange Cyberdefense](https://orange-cyberdefense.github.io/ocd-mindmaps/).
3. **ADCS** — No se duplican ESC1–16: puente a [ADCS-ESC-Lab](https://github.com/heindall92/ADCS-ESC-Lab).

Pedagogía: cada ficha sigue **en una frase → por qué importa → firma → pasos de lab → mitigación**. Pensado para quien parte de cero.

---

## Características

- Mapa por categorías, tabla, práctica guiada, árbol de decisión, cheat sheet, blue team
- UI glassmorphism, tema claro/oscuro, 9 acentos, i18n ES/EN
- 100% local — clonar y `npm run dev`

---

## Requisitos

| Requisito | Versión |
|-----------|---------|
| Node.js   | 20+     |
| npm       | 10+     |

Herramientas de referencia en el lab (no incluidas): Impacket, BloodHound, Rubeus, Certipy (vía lab ADCS), etc.

---

## Inicio rápido

```bash
git clone https://github.com/heindall92/AD-PrivEsc-Lab.git
cd AD-PrivEsc-Lab
npm install
npm run dev    # http://localhost:8080
```

---

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Home + tutorial |
| `/curso` | Solo los 11 Se* del curso |
| `/mapa` | Mapa por categorías |
| `/tabla` | Tabla comparativa |
| `/vector/$vectorId` | Ficha (ej. `/vector/se-impersonate`) |
| `/practica` | Escenarios guiados |
| `/decision` | Si ves X → mira Y |
| `/cheat-sheet` | Firmas rápidas |
| `/blue-team` | Detección y hardening |
| `/parche` | Checklist de hardening |
| `/adcs` | Puente a ADCS-ESC-Lab |

---

## Atribución

- Estructura / UI: fork metodológico de [ADCS-ESC-Lab](https://github.com/heindall92/ADCS-ESC-Lab)
- Taxonomía de dominio: [Orange Cyberdefense OCD mindmaps](https://github.com/Orange-Cyberdefense/ocd-mindmaps) (referencia educativa; atribución obligatoria)
- Material de curso: privilegios Windows Se* (apuntes del profesor)

---

## Aviso legal

Proyecto **exclusivamente educativo**. El uso contra sistemas sin autorización es ilegal. El autor no se responsabiliza del mal uso.

---

## Autor

**Yoandy Ramírez Delgado** · Junior Pentester · eJPTv2
