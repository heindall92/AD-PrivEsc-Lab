import type {
  BlueTeamRow,
  CheatSheet,
  DecisionTable,
  PatchContext,
  PrivCategoryMeta,
  PrivVector,
} from "./types";

export const groups: PrivCategoryMeta[] = [
  {
    "id": "local",
    "label": "Local / Se*",
    "description": "Start here: 11 course privileges + local misconfigs.",
    "color": "#38BDF8",
    "courseTrack": true,
    "vectorIds": [
      "se-impersonate",
      "se-assign-primary-token",
      "se-backup",
      "se-restore",
      "se-debug",
      "se-take-ownership",
      "se-load-driver",
      "se-manage-volume",
      "se-tcb",
      "se-create-token",
      "se-security",
      "always-install-elevated",
      "unquoted-service-path",
      "weak-service-permissions",
      "dll-hijacking",
      "scheduled-task-abuse"
    ]
  },
  {
    "id": "kerberos",
    "label": "Kerberos",
    "description": "Tickets, roasting and forgery. After you understand tokens.",
    "color": "#A78BFA",
    "vectorIds": [
      "asrep-roast",
      "kerberoasting",
      "overpass-the-hash",
      "pass-the-ticket",
      "golden-ticket",
      "silver-ticket",
      "diamond-ticket"
    ]
  },
  {
    "id": "acl",
    "label": "ACL / ACE",
    "description": "Dangerous permissions on AD objects (BloodHound).",
    "color": "#FB7185",
    "vectorIds": [
      "force-change-password",
      "generic-all",
      "generic-write",
      "write-dacl",
      "write-owner",
      "add-member",
      "owns",
      "dcsync",
      "shadow-credentials",
      "adminsdholder"
    ]
  },
  {
    "id": "delegation",
    "label": "Delegation",
    "description": "Unconstrained, Constrained and RBCD.",
    "color": "#FBBF24",
    "vectorIds": [
      "unconstrained-delegation",
      "constrained-delegation",
      "rbcd"
    ]
  },
  {
    "id": "coerce",
    "label": "Coerce / Relay",
    "description": "Force auth and relay it (OCD mindmap).",
    "color": "#34D399",
    "vectorIds": [
      "petitpotam-relay",
      "printerbug-coerce",
      "webdav-coerce",
      "scf-lnk-coerce",
      "ntlm-relay-ldap",
      "ntlm-relay-smb"
    ]
  },
  {
    "id": "creds",
    "label": "Credentials",
    "description": "SAM, LSASS, DPAPI, GPP, LAPS, NTDS.",
    "color": "#F472B6",
    "vectorIds": [
      "sam-lsa-dump",
      "lsass-dump",
      "dpapi-secrets",
      "gpp-passwords",
      "laps-read",
      "ntds-dump"
    ]
  },
  {
    "id": "trusts",
    "label": "Trusts",
    "description": "Abuse of trusts between domains/forests.",
    "color": "#60A5FA",
    "vectorIds": [
      "sid-history-abuse",
      "inter-realm-tgt",
      "forest-trust-abuse"
    ]
  },
  {
    "id": "adcs",
    "label": "ADCS",
    "description": "Bridge to ADCS-ESC-Lab (does not duplicate ESCs).",
    "color": "#2DD4BF",
    "vectorIds": [
      "adcs-bridge",
      "adcs-enum-bridge"
    ]
  },
  {
    "id": "sccm",
    "label": "SCCM",
    "description": "NAA, site admin and SCCM coerce.",
    "color": "#94A3B8",
    "vectorIds": [
      "sccm-naa",
      "sccm-admin-site",
      "sccm-coerce"
    ]
  },
  {
    "id": "mssql",
    "label": "MSSQL",
    "description": "xp_cmdshell, linked servers, impersonation.",
    "color": "#94A3B8",
    "vectorIds": [
      "mssql-xp-cmdshell",
      "mssql-linked-server",
      "mssql-impersonation"
    ]
  },
  {
    "id": "misc",
    "label": "Misc / Labs",
    "description": "MAQ, GPO abuse, lab CVEs and more.",
    "color": "#94A3B8",
    "vectorIds": [
      "hive-nightmare",
      "machine-account-quota",
      "nopac-concept",
      "printnightmare-lab",
      "gpo-abuse"
    ]
  }
];

export const vectors: PrivVector[] = [
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "whoami /priv"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-impersonate",
    "category": "local",
    "name": "SeImpersonatePrivilege",
    "shortName": "SeImpersonate",
    "tagline": "Puedes impersonar tras auth.",
    "oneLiner": "Permite adoptar la identidad de un cliente autenticado.",
    "whyItMatters": "Servicios IIS/SQL con Potato → SYSTEM en lab.",
    "signature": [
      "whoami /priv → SeImpersonate Enabled"
    ],
    "glossaryTerms": [
      "token"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "whoami /priv"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-assign-primary-token",
    "category": "local",
    "name": "SeAssignPrimaryTokenPrivilege",
    "shortName": "SeAssignPrimaryToken",
    "tagline": "Asignar token primario a proceso nuevo.",
    "oneLiner": "Crear procesos con token de otro como primario.",
    "whyItMatters": "Junto a SeImpersonate en servicios.",
    "signature": [
      "whoami /priv → SeAssignPrimaryToken Enabled"
    ],
    "glossaryTerms": [
      "token"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "whoami /priv"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-backup",
    "category": "local",
    "name": "SeBackupPrivilege",
    "shortName": "SeBackup",
    "tagline": "Leer ficheros saltando ACL (backup).",
    "oneLiner": "Bypass de lectura pensado para backups.",
    "whyItMatters": "Lectura de SAM/secretos en lab.",
    "signature": [
      "whoami /priv → SeBackup Enabled"
    ],
    "glossaryTerms": [
      "ACL",
      "SAM"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "whoami /priv"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-restore",
    "category": "local",
    "name": "SeRestorePrivilege",
    "shortName": "SeRestore",
    "tagline": "Escribir ficheros saltando ACL (restore).",
    "oneLiner": "Bypass de escritura para restauración.",
    "whyItMatters": "Sustitución de binarios/servicios en lab.",
    "signature": [
      "whoami /priv → SeRestore Enabled"
    ],
    "glossaryTerms": [
      "ACL"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "whoami /priv"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-debug",
    "category": "local",
    "name": "SeDebugPrivilege",
    "shortName": "SeDebug",
    "tagline": "Depurar procesos del sistema.",
    "oneLiner": "Abrir procesos privilegiados (p.ej. LSASS).",
    "whyItMatters": "Dump de credenciales en lab.",
    "signature": [
      "whoami /priv → SeDebug Enabled"
    ],
    "glossaryTerms": [
      "LSASS"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "takeown /f <ruta>"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-take-ownership",
    "category": "local",
    "name": "SeTakeOwnershipPrivilege",
    "shortName": "SeTakeOwnership",
    "tagline": "Tomar posesión de objetos.",
    "oneLiner": "Ownership → reescribir DACL.",
    "whyItMatters": "Acceso a lo bloqueado por ACL.",
    "signature": [
      "whoami /priv → SeTakeOwnership Enabled"
    ],
    "glossaryTerms": [
      "owner",
      "DACL"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "whoami /priv"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-load-driver",
    "category": "local",
    "name": "SeLoadDriverPrivilege",
    "shortName": "SeLoadDriver",
    "tagline": "Cargar drivers del kernel.",
    "oneLiner": "Código en kernel = control de la máquina.",
    "whyItMatters": "Privilegio casi-SYSTEM.",
    "signature": [
      "whoami /priv → SeLoadDriver Enabled"
    ],
    "glossaryTerms": [
      "kernel"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "whoami /priv"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-manage-volume",
    "category": "local",
    "name": "SeManageVolumePrivilege",
    "shortName": "SeManageVolume",
    "tagline": "Gestionar volúmenes a bajo nivel.",
    "oneLiner": "Operaciones de volumen más allá de ficheros.",
    "whyItMatters": "Lectura creativa saltando ACL.",
    "signature": [
      "whoami /priv → SeManageVolume Enabled"
    ],
    "glossaryTerms": [
      "volumen"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "whoami /priv"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-tcb",
    "category": "local",
    "name": "SeTcbPrivilege",
    "shortName": "SeTcb",
    "tagline": "Actuar como parte del SO (TCB).",
    "oneLiner": "Operaciones del Trusted Computing Base.",
    "whyItMatters": "Señal de compromiso casi total.",
    "signature": [
      "whoami /priv → SeTcb Enabled"
    ],
    "glossaryTerms": [
      "TCB"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "whoami /priv"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-create-token",
    "category": "local",
    "name": "SeCreateTokenPrivilege",
    "shortName": "SeCreateToken",
    "tagline": "Crear tokens arbitrarios.",
    "oneLiner": "Fabricar tokens con grupos elegidos.",
    "whyItMatters": "Escalada directa en lab.",
    "signature": [
      "whoami /priv → SeCreateToken Enabled"
    ],
    "glossaryTerms": [
      "token",
      "SID"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "whoami /priv"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Quitar el privilegio si no hace falta",
      "Auditar User Rights Assignment"
    ],
    "tools": [
      "whoami"
    ],
    "source": "course",
    "id": "se-security",
    "category": "local",
    "name": "SeSecurityPrivilege",
    "shortName": "SeSecurity",
    "tagline": "Gestionar el Security log.",
    "oneLiner": "Ver/limpiar/configurar auditoría.",
    "whyItMatters": "Impacto blue team: borrar huellas.",
    "signature": [
      "whoami /priv → SeSecurity Enabled"
    ],
    "glossaryTerms": [
      "auditoría"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "reg",
      "msiexec"
    ],
    "source": "ocd",
    "id": "always-install-elevated",
    "category": "local",
    "name": "AlwaysInstallElevated",
    "shortName": "AlwaysInstallElevated",
    "tagline": "MSI se instalan como SYSTEM.",
    "oneLiner": "Si AlwaysInstallElevated=1 en HKLM y HKCU, cualquier usuario puede instalar MSI como SYSTEM.",
    "whyItMatters": "Escalada local clásica en labs mal hardenizados.",
    "signature": [
      "reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated",
      "Ambas claves = 0x1"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "wmic service get name,pathname"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "wmic",
      "sc"
    ],
    "source": "ocd",
    "id": "unquoted-service-path",
    "category": "local",
    "name": "Unquoted Service Path",
    "shortName": "UnquotedPath",
    "tagline": "Ruta de servicio sin comillas → hijack.",
    "oneLiner": "Si el binPath tiene espacios y no va entre comillas, Windows puede ejecutar otro .exe intermedio.",
    "whyItMatters": "Escritura en rutas intermedias permite SYSTEM al reiniciar el servicio.",
    "signature": [
      "wmic service get name,pathname",
      "Path con espacios sin comillas"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "sc qc <servicio>"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "accesschk",
      "sc"
    ],
    "source": "ocd",
    "id": "weak-service-permissions",
    "category": "local",
    "name": "Weak Service Permissions",
    "shortName": "WeakServiceACL",
    "tagline": "Puedes modificar un servicio privilegiado.",
    "oneLiner": "ACL débiles en el servicio permiten cambiar binPath o reiniciarlo.",
    "whyItMatters": "Cambio de binPath → SYSTEM.",
    "signature": [
      "accesschk/sc sdshow: WRITE_DAC/CHANGE_CONFIG a Users"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "Procmon"
    ],
    "source": "ocd",
    "id": "dll-hijacking",
    "category": "local",
    "name": "DLL Hijacking",
    "shortName": "DllHijack",
    "tagline": "Un proceso privilegiado carga tu DLL.",
    "oneLiner": "Si un servicio busca DLLs en rutas escribibles, colocas una maliciosa en lab.",
    "whyItMatters": "Código en proceso SYSTEM/Admin.",
    "signature": [
      "Procmon: NAME NOT FOUND en ruta escribible"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "schtasks /query /fo LIST /v"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "schtasks"
    ],
    "source": "ocd",
    "id": "scheduled-task-abuse",
    "category": "local",
    "name": "Scheduled Task Abuse",
    "shortName": "SchTask",
    "tagline": "Tareas programadas modificables o hijackables.",
    "oneLiner": "Tareas SYSTEM con acciones/ACL débiles permiten ejecutar código privilegiado.",
    "whyItMatters": "Persistencia y escalada local frecuentes en labs.",
    "signature": [
      "schtasks /query /fo LIST /v",
      "ACL de escritura en acción o carpeta"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "impacket-GetNPUsers domain/ -dc-ip <DC> -usersfile users.txt -format hashcat"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-GetNPUsers",
      "hashcat"
    ],
    "source": "ocd",
    "id": "asrep-roast",
    "category": "kerberos",
    "name": "AS-REP Roasting",
    "shortName": "AS-REP",
    "tagline": "Usuarios sin preauth → blob crackeable.",
    "oneLiner": "DONT_REQ_PREAUTH permite pedir AS-REP y atacar offline.",
    "whyItMatters": "Credenciales de dominio sin password del objetivo.",
    "signature": [
      "LDAP/BH: DONT_REQ_PREAUTH",
      "GetNPUsers encuentra usuarios"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "impacket-GetUserSPNs domain/user:pass -dc-ip <DC> -request"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-GetUserSPNs",
      "Rubeus",
      "hashcat"
    ],
    "source": "ocd",
    "id": "kerberoasting",
    "category": "kerberos",
    "name": "Kerberoasting",
    "shortName": "Kerberoast",
    "tagline": "TGS de SPN → crack offline.",
    "oneLiner": "Cualquier usuario autenticado puede pedir TGS de cuentas con SPN.",
    "whyItMatters": "Service accounts débiles → movimiento lateral/DA.",
    "signature": [
      "Cuentas con servicePrincipalName",
      "GetUserSPNs -request"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "impacket-getTGT domain/user -hashes :<NThash>"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-getTGT",
      "Rubeus"
    ],
    "source": "ocd",
    "id": "overpass-the-hash",
    "category": "kerberos",
    "name": "Overpass-the-Hash",
    "shortName": "OPTH",
    "tagline": "NT hash → TGT Kerberos.",
    "oneLiner": "Con NT hash pides TGT (sin usar NTLM hacia el destino).",
    "whyItMatters": "Puente hash → tickets para el resto del ataque.",
    "signature": [
      "Tienes NT hash",
      "getTGT / Rubeus asktgt"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "Rubeus",
      "mimikatz",
      "impacket"
    ],
    "source": "ocd",
    "id": "pass-the-ticket",
    "category": "kerberos",
    "name": "Pass-the-Ticket",
    "shortName": "PTT",
    "tagline": "Reutilizar un TGT/TGS robado.",
    "oneLiner": "Importas un ticket Kerberos en tu sesión y actúas como esa identidad.",
    "whyItMatters": "Movimiento lateral sin password en claro.",
    "signature": [
      ".kirbi / ccache en memoria",
      "Rubeus ptt / export"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Hash krbtgt (p.ej. tras DCSync)",
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-ticketer",
      "mimikatz",
      "Rubeus"
    ],
    "source": "ocd",
    "id": "golden-ticket",
    "category": "kerberos",
    "name": "Golden Ticket",
    "shortName": "GoldenTicket",
    "tagline": "TGT falso firmado con krbtgt.",
    "oneLiner": "Con hash krbtgt fabricas TGTs para cualquier usuario.",
    "whyItMatters": "Persistencia DA clásica post-compromiso.",
    "signature": [
      "Posees krbtgt NT/AES",
      "ticketer / mimikatz golden"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-ticketer",
      "mimikatz"
    ],
    "source": "ocd",
    "id": "silver-ticket",
    "category": "kerberos",
    "name": "Silver Ticket",
    "shortName": "SilverTicket",
    "tagline": "TGS falso para un servicio concreto.",
    "oneLiner": "Con hash de la cuenta de servicio fabricas TGS hacia ese SPN.",
    "whyItMatters": "Acceso a un servicio sin tocar tanto el DC.",
    "signature": [
      "Hash de machine/service account",
      "TGS forjado a CIFS/HTTP/..."
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "herramientas diamond de lab"
    ],
    "source": "ocd",
    "id": "diamond-ticket",
    "category": "kerberos",
    "name": "Diamond Ticket",
    "shortName": "DiamondTicket",
    "tagline": "Modificar un TGT legítimo (más sigiloso).",
    "oneLiner": "En vez de inventar un Golden, alteras un TGT real con clave krbtgt.",
    "whyItMatters": "Variante moderna más difícil de detectar.",
    "signature": [
      "Uso de krbtgt + TGT existente"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "Rubeus"
    ],
    "source": "ocd",
    "id": "unconstrained-delegation",
    "category": "delegation",
    "name": "Unconstrained Delegation",
    "shortName": "Unconstrained",
    "tagline": "El host guarda TGTs de quien se conecta.",
    "oneLiner": "TRUSTED_FOR_DELEGATION permite reutilizar TGTs (incl. DA si lo engañas).",
    "whyItMatters": "Combo clásico con coerce → DA.",
    "signature": [
      "BH: UnconstrainedDelegation",
      "TrustedForDelegation"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "impacket-getST",
      "Rubeus"
    ],
    "source": "ocd",
    "id": "constrained-delegation",
    "category": "delegation",
    "name": "Constrained Delegation",
    "shortName": "Constrained",
    "tagline": "Delegación limitada a SPNs (S4U).",
    "oneLiner": "msDS-AllowedToDelegateTo define a qué servicios puede impersonar.",
    "whyItMatters": "Control de esa cuenta → acceso a esos SPNs como otros usuarios.",
    "signature": [
      "AllowedToDelegate / msDS-AllowedToDelegateTo"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "impacket-rbcd -delegate-from ATTACKER$ -delegate-to TARGET$ -dc-ip <DC> domain/user:pass"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-rbcd",
      "Rubeus",
      "BloodHound"
    ],
    "source": "ocd",
    "id": "rbcd",
    "category": "delegation",
    "name": "Resource-Based Constrained Delegation",
    "shortName": "RBCD",
    "tagline": "El recurso decide quién delega hacia él.",
    "oneLiner": "Escribes msDS-AllowedToActOnBehalfOfOtherIdentity y te haces pasar por usuarios hacia ese host.",
    "whyItMatters": "Tras GenericWrite a computer → admin local del host.",
    "signature": [
      "BH: AddAllowedToAct / GenericWrite a Computer"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "net rpc password <user> -U domain/attacker%pass -S <DC>"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "bloodyAD",
      "net rpc"
    ],
    "source": "ocd",
    "id": "force-change-password",
    "category": "acl",
    "name": "ForceChangePassword",
    "shortName": "ForceChangePassword",
    "tagline": "Reseteas password de otro usuario.",
    "oneLiner": "Permiso AD para forzar cambio de contraseña sin conocer la actual.",
    "whyItMatters": "Tomas la identidad del objetivo en minutos.",
    "signature": [
      "BH: ForceChangePassword"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "dacledit",
      "bloodyAD"
    ],
    "source": "ocd",
    "id": "generic-all",
    "category": "acl",
    "name": "GenericAll",
    "shortName": "GenericAll",
    "tagline": "Full Control sobre el objeto AD.",
    "oneLiner": "Control total: atributos, membresías, resets, etc.",
    "whyItMatters": "Sobre grupo/user/computer = escalada directa según tipo.",
    "signature": [
      "BH: GenericAll"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "bloodyAD"
    ],
    "source": "ocd",
    "id": "generic-write",
    "category": "acl",
    "name": "GenericWrite",
    "shortName": "GenericWrite",
    "tagline": "Escritura amplia de atributos.",
    "oneLiner": "Puedes escribir la mayoría de propiedades del objeto.",
    "whyItMatters": "Camino a Shadow Creds, SPN, scriptPath, RBCD…",
    "signature": [
      "BH: GenericWrite"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "dacledit"
    ],
    "source": "ocd",
    "id": "write-dacl",
    "category": "acl",
    "name": "WriteDACL",
    "shortName": "WriteDACL",
    "tagline": "Reescribes la DACL y te das más permisos.",
    "oneLiner": "WriteDACL → te concedes GenericAll → acción final.",
    "whyItMatters": "Permiso para conseguir más permisos.",
    "signature": [
      "BH: WriteDacl"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "owneredit"
    ],
    "source": "ocd",
    "id": "write-owner",
    "category": "acl",
    "name": "WriteOwner",
    "shortName": "WriteOwner",
    "tagline": "Cambias el owner del objeto.",
    "oneLiner": "Owner puede reescribir DACL → luego GenericAll.",
    "whyItMatters": "Cadena owner → DACL → abuso.",
    "signature": [
      "BH: WriteOwner"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "net group",
      "bloodyAD"
    ],
    "source": "ocd",
    "id": "add-member",
    "category": "acl",
    "name": "AddMember",
    "shortName": "AddMember",
    "tagline": "Te añades (o añades a alguien) a un grupo.",
    "oneLiner": "Permiso de escritura de miembros sobre un grupo.",
    "whyItMatters": "Grupo privilegiado = escalada inmediata.",
    "signature": [
      "BH: AddMember / GenericAll on Group"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound"
    ],
    "source": "ocd",
    "id": "owns",
    "category": "acl",
    "name": "Owns",
    "shortName": "Owns",
    "tagline": "Eres owner del objeto AD.",
    "oneLiner": "Como owner puedes tomar control vía DACL.",
    "whyItMatters": "Misma cadena que WriteOwner si ya eres owner.",
    "signature": [
      "BH: Owns"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "impacket-secretsdump domain/user:pass@<DC>"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-secretsdump",
      "mimikatz"
    ],
    "source": "ocd",
    "id": "dcsync",
    "category": "acl",
    "name": "DCSync",
    "shortName": "DCSync",
    "tagline": "Replicas secretos del DC.",
    "oneLiner": "GetChanges+GetChangesAll → hashes vía replicación (incl. krbtgt).",
    "whyItMatters": "Casi siempre = Domain Admin efectivo.",
    "signature": [
      "BH: DCSync / GetChanges+GetChangesAll"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "pywhisker",
      "Whisker",
      "certipy"
    ],
    "source": "ocd",
    "id": "shadow-credentials",
    "category": "acl",
    "name": "Shadow Credentials",
    "shortName": "ShadowCreds",
    "tagline": "KeyCredentials → auth con clave/cert.",
    "oneLiner": "Escribes msDS-KeyCredentialLink y obtienes TGT vía PKINIT.",
    "whyItMatters": "Alternativa moderna a reset password.",
    "signature": [
      "BH: AddKeyCredentialLink"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "PetitPotam",
      "ntlmrelayx"
    ],
    "source": "ocd",
    "id": "petitpotam-relay",
    "category": "coerce",
    "name": "PetitPotam + Relay",
    "shortName": "PetitPotam",
    "tagline": "Coerce MS-EFSRPC → relay NTLM.",
    "oneLiner": "Fuerzas al host a autenticarse hacia ti y reenvías el NTLM.",
    "whyItMatters": "Camino famoso a ADCS ESC8 / LDAP/SMB en labs.",
    "signature": [
      "PetitPotam OK",
      "ntlmrelayx escuchando"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "printerbug.py domain/user:pass@target <listener>"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "printerbug.py",
      "ntlmrelayx"
    ],
    "source": "ocd",
    "id": "printerbug-coerce",
    "category": "coerce",
    "name": "PrinterBug Coerce",
    "shortName": "PrinterBug",
    "tagline": "MS-RPRN fuerza auth del spooler.",
    "oneLiner": "printerbug hace que el target autentique a tu listener.",
    "whyItMatters": "Coerce clásico hacia unconstrained / relay.",
    "signature": [
      "Spooler activo",
      "printerbug.py éxito"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "PetitPotam",
      "PrinterBug",
      "ntlmrelayx"
    ],
    "source": "ocd",
    "id": "webdav-coerce",
    "category": "coerce",
    "name": "WebDAV Coerce",
    "shortName": "WebDAVCoerce",
    "tagline": "Auth HTTP vía WebClient.",
    "oneLiner": "Con WebClient puedes coerzar autenticación HTTP útil para relay a ADCS/HTTP.",
    "whyItMatters": "Cuando SMB firmado bloquea, HTTP sigue abierto a veces.",
    "signature": [
      "WebClient running",
      "coerce a http listener"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "Responder",
      "ntlm_theft"
    ],
    "source": "ocd",
    "id": "scf-lnk-coerce",
    "category": "coerce",
    "name": "SCF/LNK Coerce",
    "shortName": "SCF/LNK",
    "tagline": "Archivo en share engaña al Explorer.",
    "oneLiner": ".scf/.lnk/.url en un share hacen que el usuario autentique a tu IP.",
    "whyItMatters": "Hashes NetNTLM sin phishing complejo.",
    "signature": [
      "Responder captura hash al abrir el share"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "ntlmrelayx"
    ],
    "source": "ocd",
    "id": "ntlm-relay-ldap",
    "category": "coerce",
    "name": "NTLM Relay → LDAP",
    "shortName": "RelayLDAP",
    "tagline": "Relay a LDAP sin signing.",
    "oneLiner": "Si LDAP signing no está forzado, el relay puede crear/modificar objetos.",
    "whyItMatters": "RBCD, Shadow Creds, AddMember vía relay.",
    "signature": [
      "LDAP signing not required",
      "ntlmrelayx -t ldap://DC"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "ntlmrelayx"
    ],
    "source": "ocd",
    "id": "ntlm-relay-smb",
    "category": "coerce",
    "name": "NTLM Relay → SMB",
    "shortName": "RelaySMB",
    "tagline": "Relay a SMB sin firmas.",
    "oneLiner": "Reenvías NTLM a un host SMB y obtienes sesión autenticada.",
    "whyItMatters": "Ejecución en el target según privilegios del hash.",
    "signature": [
      "SMB signing disabled",
      "ntlmrelayx -t smb://"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-secretsdump",
      "mimikatz"
    ],
    "source": "ocd",
    "id": "sam-lsa-dump",
    "category": "creds",
    "name": "SAM / LSA Secrets",
    "shortName": "SAM/LSA",
    "tagline": "Hashes y secretos locales.",
    "oneLiner": "Con admin local vuelcas SAM/LSA y reutilizas hashes (PTH).",
    "whyItMatters": "Puente privilegio local → lateral movement.",
    "signature": [
      "Admin local/SYSTEM",
      "secretsdump local"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "procdump",
      "mimikatz",
      "nanodump"
    ],
    "source": "ocd",
    "id": "lsass-dump",
    "category": "creds",
    "name": "LSASS Dump",
    "shortName": "LSASS",
    "tagline": "Secretos en memoria de LSASS.",
    "oneLiner": "Dump de LSASS revela credenciales/tickets de sesiones.",
    "whyItMatters": "Tesoro post-explotación en labs.",
    "signature": [
      "SeDebug o SYSTEM",
      "procdump/mimikatz"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "mimikatz",
      "SharpDPAPI",
      "DonPAPI"
    ],
    "source": "ocd",
    "id": "dpapi-secrets",
    "category": "creds",
    "name": "DPAPI Secrets",
    "shortName": "DPAPI",
    "tagline": "Secretos protegidos por DPAPI del usuario.",
    "oneLiner": "Con contexto del usuario (o masterkeys) desencriptas credenciales guardadas.",
    "whyItMatters": "Browser, WiFi, creds de apps.",
    "signature": [
      "Carpeta Protect/Credentials",
      "mimikatz dpapi / sharpdpapi"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "findstr /s /i cpassword \\\\dc\\sysvol\\*.xml"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "Get-GPPPassword",
      "findstr"
    ],
    "source": "ocd",
    "id": "gpp-passwords",
    "category": "creds",
    "name": "GPP Passwords",
    "shortName": "GPP",
    "tagline": "cpassword en SYSVOL.",
    "oneLiner": "Group Policy Preferences antiguas guardaban passwords cifradas con clave pública conocida.",
    "whyItMatters": "A veces siguen en SYSVOL en labs/legacy.",
    "signature": [
      "Groups.xml / Services.xml en SYSVOL",
      "cpassword="
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "LAPSToolkit",
      "bloodyAD",
      "ldapsearch"
    ],
    "source": "ocd",
    "id": "laps-read",
    "category": "creds",
    "name": "LAPS Read",
    "shortName": "LAPS",
    "tagline": "Lees la password local admin gestionada.",
    "oneLiner": "Si tienes derecho de lectura sobre ms-Mcs-AdmPwd, lees LAPS.",
    "whyItMatters": "Admin local de muchos hosts de golpe.",
    "signature": [
      "BH/LDAP: Read LAPS password",
      "ms-Mcs-AdmPwd"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-secretsdump",
      "ntdsutil"
    ],
    "source": "ocd",
    "id": "ntds-dump",
    "category": "creds",
    "name": "NTDS.dit Dump",
    "shortName": "NTDS",
    "tagline": "Base de hashes del dominio.",
    "oneLiner": "Copia/VSS de NTDS.dit (+SYSTEM) permite extraer todos los hashes.",
    "whyItMatters": "Game over del dominio en lab.",
    "signature": [
      "Acceso DA/backup a DC",
      "secretsdump -ntds"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "mimikatz",
      "lookupsid"
    ],
    "source": "ocd",
    "id": "sid-history-abuse",
    "category": "trusts",
    "name": "SID History Abuse",
    "shortName": "SIDHistory",
    "tagline": "SIDs extra en el token cruzando trusts.",
    "oneLiner": "SID History puede colar privilegios de otro dominio.",
    "whyItMatters": "Escalada inter-dominio clásica.",
    "signature": [
      "Trust + SIDHistory en cuenta",
      "Extra SIDs en token"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-ticketer",
      "raiseChild"
    ],
    "source": "ocd",
    "id": "inter-realm-tgt",
    "category": "trusts",
    "name": "Inter-Realm TGT",
    "shortName": "TrustTicket",
    "tagline": "Ticket de confianza entre reinos.",
    "oneLiner": "Con secretos del trust fabricas tickets inter-realm.",
    "whyItMatters": "De dominio hijo/compromiso → padre u otro.",
    "signature": [
      "Trust key / trust password hash"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "ticketer"
    ],
    "source": "ocd",
    "id": "forest-trust-abuse",
    "category": "trusts",
    "name": "Forest Trust Abuse",
    "shortName": "ForestTrust",
    "tagline": "Abusar trust entre bosques.",
    "oneLiner": "Configuraciones de forest trust permiten caminos cross-forest.",
    "whyItMatters": "Nivel avanzado tras DA en un forest.",
    "signature": [
      "Forest trust enumerado",
      "BH foreign groups/ACLs"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "certipy-ad"
    ],
    "source": "both",
    "id": "adcs-bridge",
    "category": "adcs",
    "name": "ADCS ESC (lab hermano)",
    "shortName": "ADCS →",
    "tagline": "ESC1–16 viven en ADCS-ESC-Lab.",
    "oneLiner": "No duplicamos ESC aquí: si hay PKI vulnerable, cambias de lab.",
    "whyItMatters": "Misma metodología, contenido especializado en certificados.",
    "signature": [
      "certipy find reporta ESC",
      "Web Enrollment / plantillas"
    ],
    "relatedAdcsLab": true
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "certipy-ad find -u user@lab.local -p pass -dc-ip <DC> -stdout"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "certipy-ad",
      "Certify"
    ],
    "source": "both",
    "id": "adcs-enum-bridge",
    "category": "adcs",
    "name": "Enumerar ADCS → puente",
    "shortName": "ADCS Enum",
    "tagline": "Primero enumera; luego abre ADCS-ESC-Lab.",
    "oneLiner": "certipy find / certify find para ver si hay superficie ADCS.",
    "whyItMatters": "Decide si el camino es certificados u otro vector.",
    "signature": [
      "CA visible",
      "Plantillas listadas"
    ],
    "relatedAdcsLab": true
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "sccmhunter",
      "SharpSCCM",
      "cmloot"
    ],
    "source": "ocd",
    "id": "sccm-naa",
    "category": "sccm",
    "name": "SCCM Network Access Account",
    "shortName": "SCCM NAA",
    "tagline": "Credenciales NAA recuperables.",
    "oneLiner": "NAA mal protegida puede filtrar creds de dominio desde SCCM.",
    "whyItMatters": "Creds de alto valor en entornos con MECM.",
    "signature": [
      "SCCM presente",
      "NAA en policy/client"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "SharpSCCM",
      "Console SCCM"
    ],
    "source": "ocd",
    "id": "sccm-admin-site",
    "category": "sccm",
    "name": "SCCM Site Admin",
    "shortName": "SCCM Admin",
    "tagline": "Admin de sitio → ejecución masiva.",
    "oneLiner": "Control del site server permite desplegar apps/scripts como SYSTEM en clientes.",
    "whyItMatters": "Dominio práctico del parque SCCM.",
    "signature": [
      "Rol Full Administrator / Site System admin"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "sccmhunter",
      "ntlmrelayx"
    ],
    "source": "ocd",
    "id": "sccm-coerce",
    "category": "sccm",
    "name": "SCCM Coerce",
    "shortName": "SCCM Coerce",
    "tagline": "Coerce del site system / clients.",
    "oneLiner": "Componentes SCCM pueden ser forzados a autenticar hacia ti.",
    "whyItMatters": "Relay/creds en labs SCCM (GOAD-SCCM).",
    "signature": [
      "sccmhunter findings",
      "coerce a site server"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-mssqlclient",
      "SQLCMD"
    ],
    "source": "ocd",
    "id": "mssql-xp-cmdshell",
    "category": "mssql",
    "name": "MSSQL xp_cmdshell",
    "shortName": "xp_cmdshell",
    "tagline": "SQL → comandos OS.",
    "oneLiner": "Con sysadmin puedes habilitar xp_cmdshell y ejecutar comandos.",
    "whyItMatters": "De DBA a shell en el host SQL.",
    "signature": [
      "sysadmin",
      "xp_cmdshell"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-mssqlclient"
    ],
    "source": "ocd",
    "id": "mssql-linked-server",
    "category": "mssql",
    "name": "MSSQL Linked Servers",
    "shortName": "LinkedSQL",
    "tagline": "Saltar a otros SQL enlazados.",
    "oneLiner": "Linked servers permiten ejecutar consultas/comandos en remotos.",
    "whyItMatters": "Movimiento lateral entre bases.",
    "signature": [
      "sys.servers",
      "OPENQUERY"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "mssqlclient"
    ],
    "source": "ocd",
    "id": "mssql-impersonation",
    "category": "mssql",
    "name": "MSSQL Impersonation",
    "shortName": "SQL Impersonate",
    "tagline": "EXECUTE AS usuario privilegiado.",
    "oneLiner": "Permisos IMPERSONATE permiten actuar como sa/otros.",
    "whyItMatters": "Escalada dentro de SQL sin ser sysadmin aún.",
    "signature": [
      "IMPERSONATE GRANT",
      "EXECUTE AS LOGIN"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "lab PoC"
    ],
    "source": "ocd",
    "id": "hive-nightmare",
    "category": "misc",
    "name": "HiveNightmare / SeriousSAM",
    "shortName": "HiveNightmare",
    "tagline": "ACL incorrecta en SAM (CVE lab).",
    "oneLiner": "Builds vulnerables permitían leer SAM como usuario normal.",
    "whyItMatters": "Ejemplo perfecto de ACL mal puesta.",
    "signature": [
      "Build vulnerable + ACL SAM"
    ]
  },
  {
    "difficulty": "beginner",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir.",
        "command": "impacket-addcomputer domain/user:pass -computer-name ATTACKER$ -computer-pass 'Pass123!'"
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "impacket-addcomputer"
    ],
    "source": "ocd",
    "id": "machine-account-quota",
    "category": "misc",
    "name": "Machine Account Quota",
    "shortName": "MAQ",
    "tagline": "Crear machine accounts (ms-DS-MachineAccountQuota).",
    "oneLiner": "Por defecto cualquier usuario puede crear hasta 10 computers.",
    "whyItMatters": "Pieza clave para RBCD/ShadowCreds desde lowpriv.",
    "signature": [
      "MachineAccountQuota > 0",
      "addcomputer.py OK"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "noPac lab tools"
    ],
    "source": "ocd",
    "id": "nopac-concept",
    "category": "misc",
    "name": "noPAC (concepto lab)",
    "shortName": "noPAC",
    "tagline": "CVE de PAC validation (lab histórico).",
    "oneLiner": "Fallos de validación del PAC permitían impersonar DA en ciertos parches.",
    "whyItMatters": "Entender PAC/Kerberos; solo en labs patched-aware.",
    "signature": [
      "DC vulnerable documentado en el lab"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "lab PoC"
    ],
    "source": "ocd",
    "id": "printnightmare-lab",
    "category": "misc",
    "name": "PrintNightmare (lab)",
    "shortName": "PrintNightmare",
    "tagline": "Abuso del spooler (CVE lab).",
    "oneLiner": "Vulnerabilidades del Print Spooler permitían RCE/LPE en builds afectadas.",
    "whyItMatters": "Servicio muy expuesto; aprender a apagarlo/auditarlo.",
    "signature": [
      "Spooler expuesto",
      "build vulnerable"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "SharpGPOAbuse"
    ],
    "source": "ocd",
    "id": "gpo-abuse",
    "category": "misc",
    "name": "GPO Abuse",
    "shortName": "GPO Abuse",
    "tagline": "Editas una GPO y ejecutas en muchos hosts.",
    "oneLiner": "Write sobre GPO/OU permite desplegar scheduled tasks/scripts privilegiados.",
    "whyItMatters": "Escalada masiva en el alcance de la GPO.",
    "signature": [
      "BH: GenericWrite/Edit on GPO",
      "GPLink a OU interesante"
    ]
  },
  {
    "difficulty": "intermediate",
    "prerequisites": [
      "Authorized lab"
    ],
    "attackSteps": [
      {
        "title": "Confirm the signature",
        "why": "Valida que estás en este camino antes de seguir."
      },
      {
        "title": "Run the educational flow in the lab",
        "why": "Entiende causa → efecto; no memorices un exploit."
      },
      {
        "title": "Revisa mitigación",
        "why": "Cierra siempre con detección y hardening."
      }
    ],
    "detection": [
      "Señales anómalas asociadas a este abuso"
    ],
    "hardening": [
      "Eliminar la misconfiguración",
      "Monitorear el patrón"
    ],
    "tools": [
      "BloodHound",
      "dacledit"
    ],
    "source": "ocd",
    "id": "adminsdholder",
    "category": "acl",
    "name": "AdminSDHolder Abuse",
    "shortName": "AdminSDHolder",
    "tagline": "ACL plantilla de cuentas protegidas.",
    "oneLiner": "Si puedes escribir AdminSDHolder, propagas ACL peligrosas a cuentas admin.",
    "whyItMatters": "Persistencia privilegiada en AD.",
    "signature": [
      "Write sobre CN=AdminSDHolder",
      "AdminCount=1"
    ]
  }
];

export const patchContext: PatchContext = {
  title: "Hardening: privileges, ACLs and OCD signatures",
  paragraphs: [
    "Inventory Se* on service accounts and clean ACLs BloodHound paints red.",
    "Shut down roasting (preauth, gMSA), unconstrained delegation and coerce/relay (signing/EPA).",
    "If ADCS is in scope, harden in sibling ADCS-ESC-Lab. Taxonomy inspired by Orange Cyberdefense AD mindmap 2025.03.",
  ],
  rule: [
    "whoami /priv on every foothold",
    "BloodHound: Generic*, WriteDACL, DCSync, RBCD, AdminSDHolder",
    "Kerberos: SPN, preauth, anomalous tickets",
    "Coerce/relay: SMB/LDAP signing + EPA",
    "SCCM/MSSQL: protect NAA and disable xp_cmdshell",
  ],
  whySid:
    "Privileges and ACLs are rights over SIDs. Knowing who has what beats memorizing an exploit.",
};

export const decisionTable: DecisionTable = {
  title: "If you see this → open this vector",
  steps: [
    "1. Windows host → whoami /priv / services",
    "2. Domain → SPN, ACL, delegation, coerce",
    "3. ADCS → ADCS-ESC-Lab",
    "4. Always mitigate",
  ],
  rows: [
  {
    "vectorId": "se-impersonate",
    "action": "Puedes impersonar tras auth."
  },
  {
    "vectorId": "se-assign-primary-token",
    "action": "Asignar token primario a proceso nuevo."
  },
  {
    "vectorId": "se-backup",
    "action": "Leer ficheros saltando ACL (backup)."
  },
  {
    "vectorId": "se-restore",
    "action": "Escribir ficheros saltando ACL (restore)."
  },
  {
    "vectorId": "se-debug",
    "action": "Depurar procesos del sistema."
  },
  {
    "vectorId": "se-take-ownership",
    "action": "Tomar posesión de objetos."
  },
  {
    "vectorId": "se-load-driver",
    "action": "Cargar drivers del kernel."
  },
  {
    "vectorId": "se-manage-volume",
    "action": "Gestionar volúmenes a bajo nivel."
  },
  {
    "vectorId": "se-tcb",
    "action": "Actuar como parte del SO (TCB)."
  },
  {
    "vectorId": "se-create-token",
    "action": "Crear tokens arbitrarios."
  },
  {
    "vectorId": "se-security",
    "action": "Gestionar el Security log."
  },
  {
    "vectorId": "always-install-elevated",
    "action": "MSI se instalan como SYSTEM."
  },
  {
    "vectorId": "unquoted-service-path",
    "action": "Ruta de servicio sin comillas → hijack."
  },
  {
    "vectorId": "weak-service-permissions",
    "action": "Puedes modificar un servicio privilegiado."
  },
  {
    "vectorId": "dll-hijacking",
    "action": "Un proceso privilegiado carga tu DLL."
  },
  {
    "vectorId": "scheduled-task-abuse",
    "action": "Tareas programadas modificables o hijackables."
  },
  {
    "vectorId": "asrep-roast",
    "action": "Usuarios sin preauth → blob crackeable."
  },
  {
    "vectorId": "kerberoasting",
    "action": "TGS de SPN → crack offline."
  },
  {
    "vectorId": "overpass-the-hash",
    "action": "NT hash → TGT Kerberos."
  },
  {
    "vectorId": "pass-the-ticket",
    "action": "Reutilizar un TGT/TGS robado."
  },
  {
    "vectorId": "golden-ticket",
    "action": "TGT falso firmado con krbtgt."
  },
  {
    "vectorId": "silver-ticket",
    "action": "TGS falso para un servicio concreto."
  },
  {
    "vectorId": "diamond-ticket",
    "action": "Modificar un TGT legítimo (más sigiloso)."
  },
  {
    "vectorId": "unconstrained-delegation",
    "action": "El host guarda TGTs de quien se conecta."
  },
  {
    "vectorId": "constrained-delegation",
    "action": "Delegación limitada a SPNs (S4U)."
  },
  {
    "vectorId": "rbcd",
    "action": "El recurso decide quién delega hacia él."
  },
  {
    "vectorId": "force-change-password",
    "action": "Reseteas password de otro usuario."
  },
  {
    "vectorId": "generic-all",
    "action": "Full Control sobre el objeto AD."
  },
  {
    "vectorId": "generic-write",
    "action": "Escritura amplia de atributos."
  },
  {
    "vectorId": "write-dacl",
    "action": "Reescribes la DACL y te das más permisos."
  },
  {
    "vectorId": "write-owner",
    "action": "Cambias el owner del objeto."
  },
  {
    "vectorId": "add-member",
    "action": "Te añades (o añades a alguien) a un grupo."
  },
  {
    "vectorId": "owns",
    "action": "Eres owner del objeto AD."
  },
  {
    "vectorId": "dcsync",
    "action": "Replicas secretos del DC."
  },
  {
    "vectorId": "shadow-credentials",
    "action": "KeyCredentials → auth con clave/cert."
  },
  {
    "vectorId": "petitpotam-relay",
    "action": "Coerce MS-EFSRPC → relay NTLM."
  },
  {
    "vectorId": "printerbug-coerce",
    "action": "MS-RPRN fuerza auth del spooler."
  },
  {
    "vectorId": "webdav-coerce",
    "action": "Auth HTTP vía WebClient."
  },
  {
    "vectorId": "scf-lnk-coerce",
    "action": "Archivo en share engaña al Explorer."
  },
  {
    "vectorId": "ntlm-relay-ldap",
    "action": "Relay a LDAP sin signing."
  },
  {
    "vectorId": "ntlm-relay-smb",
    "action": "Relay a SMB sin firmas."
  },
  {
    "vectorId": "sam-lsa-dump",
    "action": "Hashes y secretos locales."
  },
  {
    "vectorId": "lsass-dump",
    "action": "Secretos en memoria de LSASS."
  },
  {
    "vectorId": "dpapi-secrets",
    "action": "Secretos protegidos por DPAPI del usuario."
  },
  {
    "vectorId": "gpp-passwords",
    "action": "cpassword en SYSVOL."
  },
  {
    "vectorId": "laps-read",
    "action": "Lees la password local admin gestionada."
  },
  {
    "vectorId": "ntds-dump",
    "action": "Base de hashes del dominio."
  },
  {
    "vectorId": "sid-history-abuse",
    "action": "SIDs extra en el token cruzando trusts."
  },
  {
    "vectorId": "inter-realm-tgt",
    "action": "Ticket de confianza entre reinos."
  },
  {
    "vectorId": "forest-trust-abuse",
    "action": "Abusar trust entre bosques."
  },
  {
    "vectorId": "adcs-bridge",
    "action": "ESC1–16 viven en ADCS-ESC-Lab."
  },
  {
    "vectorId": "adcs-enum-bridge",
    "action": "Primero enumera; luego abre ADCS-ESC-Lab."
  },
  {
    "vectorId": "sccm-naa",
    "action": "Credenciales NAA recuperables."
  },
  {
    "vectorId": "sccm-admin-site",
    "action": "Admin de sitio → ejecución masiva."
  },
  {
    "vectorId": "sccm-coerce",
    "action": "Coerce del site system / clients."
  },
  {
    "vectorId": "mssql-xp-cmdshell",
    "action": "SQL → comandos OS."
  },
  {
    "vectorId": "mssql-linked-server",
    "action": "Saltar a otros SQL enlazados."
  },
  {
    "vectorId": "mssql-impersonation",
    "action": "EXECUTE AS usuario privilegiado."
  },
  {
    "vectorId": "hive-nightmare",
    "action": "ACL incorrecta en SAM (CVE lab)."
  },
  {
    "vectorId": "machine-account-quota",
    "action": "Crear machine accounts (ms-DS-MachineAccountQuota)."
  },
  {
    "vectorId": "nopac-concept",
    "action": "CVE de PAC validation (lab histórico)."
  },
  {
    "vectorId": "printnightmare-lab",
    "action": "Abuso del spooler (CVE lab)."
  },
  {
    "vectorId": "gpo-abuse",
    "action": "Editas una GPO y ejecutas en muchos hosts."
  },
  {
    "vectorId": "adminsdholder",
    "action": "ACL plantilla de cuentas protegidas."
  }
],
};

export const blueTeam: BlueTeamRow[] = [
  {
    "category": "local",
    "detection": [
      "Typical inventory/alerts for Local / Se*",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce Local / Se* attack surface",
      "Continuously audit privilege changes"
    ]
  },
  {
    "category": "kerberos",
    "detection": [
      "Typical inventory/alerts for Kerberos",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce Kerberos attack surface",
      "Continuously audit privilege changes"
    ]
  },
  {
    "category": "acl",
    "detection": [
      "Typical inventory/alerts for ACL / ACE",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce ACL / ACE attack surface",
      "Continuously audit privilege changes"
    ]
  },
  {
    "category": "delegation",
    "detection": [
      "Typical inventory/alerts for Delegation",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce Delegation attack surface",
      "Continuously audit privilege changes"
    ]
  },
  {
    "category": "coerce",
    "detection": [
      "Typical inventory/alerts for Coerce / Relay",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce Coerce / Relay attack surface",
      "Continuously audit privilege changes"
    ]
  },
  {
    "category": "creds",
    "detection": [
      "Typical inventory/alerts for Credentials",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce Credentials attack surface",
      "Continuously audit privilege changes"
    ]
  },
  {
    "category": "trusts",
    "detection": [
      "Typical inventory/alerts for Trusts",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce Trusts attack surface",
      "Continuously audit privilege changes"
    ]
  },
  {
    "category": "adcs",
    "detection": [
      "Typical inventory/alerts for ADCS",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce ADCS attack surface",
      "Continuously audit privilege changes"
    ]
  },
  {
    "category": "sccm",
    "detection": [
      "Typical inventory/alerts for SCCM",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce SCCM attack surface",
      "Continuously audit privilege changes"
    ]
  },
  {
    "category": "mssql",
    "detection": [
      "Typical inventory/alerts for MSSQL",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce MSSQL attack surface",
      "Continuously audit privilege changes"
    ]
  },
  {
    "category": "misc",
    "detection": [
      "Typical inventory/alerts for Misc / Labs",
      "Correlate with BloodHound / security logs"
    ],
    "hardening": [
      "Reduce Misc / Labs attack surface",
      "Continuously audit privilege changes"
    ]
  }
];

export const cheatSheet: CheatSheet = {
  title: "Cheat sheet · quick signatures (course + OCD)",
  intro: [
    "Spot the signature and open the card. Authorized labs only.",
    "Taxonomy inspired by Orange Cyberdefense AD mindmap 2025.03.",
  ],
  blocks: [
  {
    "title": "Local / Se*",
    "lines": [
      "SeImpersonate: whoami /priv → SeImpersonate Enabled",
      "SeAssignPrimaryToken: whoami /priv → SeAssignPrimaryToken Enabled",
      "SeBackup: whoami /priv → SeBackup Enabled",
      "SeRestore: whoami /priv → SeRestore Enabled",
      "SeDebug: whoami /priv → SeDebug Enabled",
      "SeTakeOwnership: whoami /priv → SeTakeOwnership Enabled",
      "SeLoadDriver: whoami /priv → SeLoadDriver Enabled",
      "SeManageVolume: whoami /priv → SeManageVolume Enabled"
    ]
  },
  {
    "title": "Kerberos",
    "lines": [
      "AS-REP: LDAP/BH: DONT_REQ_PREAUTH",
      "Kerberoast: Cuentas con servicePrincipalName",
      "OPTH: Tienes NT hash",
      "PTT: .kirbi / ccache en memoria",
      "GoldenTicket: Posees krbtgt NT/AES",
      "SilverTicket: Hash de machine/service account",
      "DiamondTicket: Uso de krbtgt + TGT existente"
    ]
  },
  {
    "title": "ACL / ACE",
    "lines": [
      "ForceChangePassword: BH: ForceChangePassword",
      "GenericAll: BH: GenericAll",
      "GenericWrite: BH: GenericWrite",
      "WriteDACL: BH: WriteDacl",
      "WriteOwner: BH: WriteOwner",
      "AddMember: BH: AddMember / GenericAll on Group",
      "Owns: BH: Owns",
      "DCSync: BH: DCSync / GetChanges+GetChangesAll"
    ]
  },
  {
    "title": "Delegation",
    "lines": [
      "Unconstrained: BH: UnconstrainedDelegation",
      "Constrained: AllowedToDelegate / msDS-AllowedToDelegateTo",
      "RBCD: BH: AddAllowedToAct / GenericWrite a Computer"
    ]
  },
  {
    "title": "Coerce / Relay",
    "lines": [
      "PetitPotam: PetitPotam OK",
      "PrinterBug: Spooler activo",
      "WebDAVCoerce: WebClient running",
      "SCF/LNK: Responder captura hash al abrir el share",
      "RelayLDAP: LDAP signing not required",
      "RelaySMB: SMB signing disabled"
    ]
  },
  {
    "title": "Credentials",
    "lines": [
      "SAM/LSA: Admin local/SYSTEM",
      "LSASS: SeDebug o SYSTEM",
      "DPAPI: Carpeta Protect/Credentials",
      "GPP: Groups.xml / Services.xml en SYSVOL",
      "LAPS: BH/LDAP: Read LAPS password",
      "NTDS: Acceso DA/backup a DC"
    ]
  },
  {
    "title": "Trusts",
    "lines": [
      "SIDHistory: Trust + SIDHistory en cuenta",
      "TrustTicket: Trust key / trust password hash",
      "ForestTrust: Forest trust enumerado"
    ]
  },
  {
    "title": "ADCS",
    "lines": [
      "ADCS →: certipy find reporta ESC",
      "ADCS Enum: CA visible"
    ]
  },
  {
    "title": "SCCM",
    "lines": [
      "SCCM NAA: SCCM presente",
      "SCCM Admin: Rol Full Administrator / Site System admin",
      "SCCM Coerce: sccmhunter findings"
    ]
  },
  {
    "title": "MSSQL",
    "lines": [
      "xp_cmdshell: sysadmin",
      "LinkedSQL: sys.servers",
      "SQL Impersonate: IMPERSONATE GRANT"
    ]
  },
  {
    "title": "Misc / Labs",
    "lines": [
      "HiveNightmare: Build vulnerable + ACL SAM",
      "MAQ: MachineAccountQuota > 0",
      "noPAC: DC vulnerable documentado en el lab",
      "PrintNightmare: Spooler expuesto",
      "GPO Abuse: BH: GenericWrite/Edit on GPO"
    ]
  }
],
};
