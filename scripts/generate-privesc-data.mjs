import fs from "node:fs";

function v(p) {
  const {
    cmd,
    flow,
    attackSteps: customSteps,
    detection,
    hardening,
    tools,
    prerequisites,
    source,
    difficulty,
    ...rest
  } = p;
  const attackSteps = (
    customSteps || [
      { title: "Confirma la firma", command: cmd, why: "Valida que estás en este camino antes de seguir." },
      { title: "Ejecuta el flujo educativo en lab", why: flow || "Entiende causa → efecto; no memorices un exploit." },
      { title: "Revisa mitigación", why: "Cierra siempre con detección y hardening." },
    ]
  )
    .map((s) => {
      const out = { title: s.title, why: s.why };
      if (s.command) out.command = s.command;
      return out;
    })
    .filter((s) => s.title);

  return {
    difficulty: difficulty || "beginner",
    prerequisites: prerequisites || ["Lab autorizado"],
    attackSteps,
    detection: detection || ["Señales anómalas asociadas a este abuso"],
    hardening: hardening || ["Eliminar la misconfiguración", "Monitorear el patrón"],
    tools: tools || ["herramientas de lab"],
    source: source || "ocd",
    ...rest,
  };
}

const courseSe = [
  ["se-impersonate", "SeImpersonatePrivilege", "SeImpersonate", "Puedes impersonar tras auth.", "Permite adoptar la identidad de un cliente autenticado.", "Servicios IIS/SQL con Potato → SYSTEM en lab.", "whoami /priv → SeImpersonate Enabled", "whoami /priv", ["token"], "course"],
  ["se-assign-primary-token", "SeAssignPrimaryTokenPrivilege", "SeAssignPrimaryToken", "Asignar token primario a proceso nuevo.", "Crear procesos con token de otro como primario.", "Junto a SeImpersonate en servicios.", "whoami /priv → SeAssignPrimaryToken Enabled", "whoami /priv", ["token"], "course"],
  ["se-backup", "SeBackupPrivilege", "SeBackup", "Leer ficheros saltando ACL (backup).", "Bypass de lectura pensado para backups.", "Lectura de SAM/secretos en lab.", "whoami /priv → SeBackup Enabled", "whoami /priv", ["ACL", "SAM"], "course"],
  ["se-restore", "SeRestorePrivilege", "SeRestore", "Escribir ficheros saltando ACL (restore).", "Bypass de escritura para restauración.", "Sustitución de binarios/servicios en lab.", "whoami /priv → SeRestore Enabled", "whoami /priv", ["ACL"], "course"],
  ["se-debug", "SeDebugPrivilege", "SeDebug", "Depurar procesos del sistema.", "Abrir procesos privilegiados (p.ej. LSASS).", "Dump de credenciales en lab.", "whoami /priv → SeDebug Enabled", "whoami /priv", ["LSASS"], "course"],
  ["se-take-ownership", "SeTakeOwnershipPrivilege", "SeTakeOwnership", "Tomar posesión de objetos.", "Ownership → reescribir DACL.", "Acceso a lo bloqueado por ACL.", "whoami /priv → SeTakeOwnership Enabled", "takeown /f <ruta>", ["owner", "DACL"], "course"],
  ["se-load-driver", "SeLoadDriverPrivilege", "SeLoadDriver", "Cargar drivers del kernel.", "Código en kernel = control de la máquina.", "Privilegio casi-SYSTEM.", "whoami /priv → SeLoadDriver Enabled", "whoami /priv", ["kernel"], "course", "intermediate"],
  ["se-manage-volume", "SeManageVolumePrivilege", "SeManageVolume", "Gestionar volúmenes a bajo nivel.", "Operaciones de volumen más allá de ficheros.", "Lectura creativa saltando ACL.", "whoami /priv → SeManageVolume Enabled", "whoami /priv", ["volumen"], "course", "intermediate"],
  ["se-tcb", "SeTcbPrivilege", "SeTcb", "Actuar como parte del SO (TCB).", "Operaciones del Trusted Computing Base.", "Señal de compromiso casi total.", "whoami /priv → SeTcb Enabled", "whoami /priv", ["TCB"], "course", "intermediate"],
  ["se-create-token", "SeCreateTokenPrivilege", "SeCreateToken", "Crear tokens arbitrarios.", "Fabricar tokens con grupos elegidos.", "Escalada directa en lab.", "whoami /priv → SeCreateToken Enabled", "whoami /priv", ["token", "SID"], "course", "intermediate"],
  ["se-security", "SeSecurityPrivilege", "SeSecurity", "Gestionar el Security log.", "Ver/limpiar/configurar auditoría.", "Impacto blue team: borrar huellas.", "whoami /priv → SeSecurity Enabled", "whoami /priv", ["auditoría"], "course"],
].map(([id, name, short, tag, one, why, sig, cmd, gloss, source, diff]) =>
  v({
    id,
    category: "local",
    name,
    shortName: short,
    tagline: tag,
    oneLiner: one,
    whyItMatters: why,
    signature: [sig],
    cmd,
    glossaryTerms: gloss,
    source,
    difficulty: diff || "beginner",
    tools: ["whoami"],
    hardening: ["Quitar el privilegio si no hace falta", "Auditar User Rights Assignment"],
  }),
);

const more = [
  v({ id: "always-install-elevated", category: "local", name: "AlwaysInstallElevated", shortName: "AlwaysInstallElevated", tagline: "MSI se instalan como SYSTEM.", oneLiner: "Si AlwaysInstallElevated=1 en HKLM y HKCU, cualquier usuario puede instalar MSI como SYSTEM.", whyItMatters: "Escalada local clásica en labs mal hardenizados.", signature: ["reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated", "Ambas claves = 0x1"], cmd: "reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated", tools: ["reg", "msiexec"] }),
  v({ id: "unquoted-service-path", category: "local", name: "Unquoted Service Path", shortName: "UnquotedPath", tagline: "Ruta de servicio sin comillas → hijack.", oneLiner: "Si el binPath tiene espacios y no va entre comillas, Windows puede ejecutar otro .exe intermedio.", whyItMatters: "Escritura en rutas intermedias permite SYSTEM al reiniciar el servicio.", signature: ["wmic service get name,pathname", "Path con espacios sin comillas"], cmd: "wmic service get name,pathname", tools: ["wmic", "sc"] }),
  v({ id: "weak-service-permissions", category: "local", name: "Weak Service Permissions", shortName: "WeakServiceACL", tagline: "Puedes modificar un servicio privilegiado.", oneLiner: "ACL débiles en el servicio permiten cambiar binPath o reiniciarlo.", whyItMatters: "Cambio de binPath → SYSTEM.", signature: ["accesschk/sc sdshow: WRITE_DAC/CHANGE_CONFIG a Users"], cmd: "sc qc <servicio>", tools: ["accesschk", "sc"] }),
  v({ id: "dll-hijacking", category: "local", name: "DLL Hijacking", shortName: "DllHijack", tagline: "Un proceso privilegiado carga tu DLL.", oneLiner: "Si un servicio busca DLLs en rutas escribibles, colocas una maliciosa en lab.", whyItMatters: "Código en proceso SYSTEM/Admin.", signature: ["Procmon: NAME NOT FOUND en ruta escribible"], tools: ["Procmon"], difficulty: "intermediate" }),
  v({ id: "scheduled-task-abuse", category: "local", name: "Scheduled Task Abuse", shortName: "SchTask", tagline: "Tareas programadas modificables o hijackables.", oneLiner: "Tareas SYSTEM con acciones/ACL débiles permiten ejecutar código privilegiado.", whyItMatters: "Persistencia y escalada local frecuentes en labs.", signature: ["schtasks /query /fo LIST /v", "ACL de escritura en acción o carpeta"], cmd: "schtasks /query /fo LIST /v", tools: ["schtasks"] }),

  v({ id: "asrep-roast", category: "kerberos", name: "AS-REP Roasting", shortName: "AS-REP", tagline: "Usuarios sin preauth → blob crackeable.", oneLiner: "DONT_REQ_PREAUTH permite pedir AS-REP y atacar offline.", whyItMatters: "Credenciales de dominio sin password del objetivo.", signature: ["LDAP/BH: DONT_REQ_PREAUTH", "GetNPUsers encuentra usuarios"], cmd: "impacket-GetNPUsers domain/ -dc-ip <DC> -usersfile users.txt -format hashcat", tools: ["impacket-GetNPUsers", "hashcat"] }),
  v({ id: "kerberoasting", category: "kerberos", name: "Kerberoasting", shortName: "Kerberoast", tagline: "TGS de SPN → crack offline.", oneLiner: "Cualquier usuario autenticado puede pedir TGS de cuentas con SPN.", whyItMatters: "Service accounts débiles → movimiento lateral/DA.", signature: ["Cuentas con servicePrincipalName", "GetUserSPNs -request"], cmd: "impacket-GetUserSPNs domain/user:pass -dc-ip <DC> -request", tools: ["impacket-GetUserSPNs", "Rubeus", "hashcat"] }),
  v({ id: "overpass-the-hash", category: "kerberos", name: "Overpass-the-Hash", shortName: "OPTH", tagline: "NT hash → TGT Kerberos.", oneLiner: "Con NT hash pides TGT (sin usar NTLM hacia el destino).", whyItMatters: "Puente hash → tickets para el resto del ataque.", signature: ["Tienes NT hash", "getTGT / Rubeus asktgt"], cmd: "impacket-getTGT domain/user -hashes :<NThash>", tools: ["impacket-getTGT", "Rubeus"], difficulty: "intermediate" }),
  v({ id: "pass-the-ticket", category: "kerberos", name: "Pass-the-Ticket", shortName: "PTT", tagline: "Reutilizar un TGT/TGS robado.", oneLiner: "Importas un ticket Kerberos en tu sesión y actúas como esa identidad.", whyItMatters: "Movimiento lateral sin password en claro.", signature: [".kirbi / ccache en memoria", "Rubeus ptt / export"], tools: ["Rubeus", "mimikatz", "impacket"], difficulty: "intermediate" }),
  v({ id: "golden-ticket", category: "kerberos", name: "Golden Ticket", shortName: "GoldenTicket", tagline: "TGT falso firmado con krbtgt.", oneLiner: "Con hash krbtgt fabricas TGTs para cualquier usuario.", whyItMatters: "Persistencia DA clásica post-compromiso.", signature: ["Posees krbtgt NT/AES", "ticketer / mimikatz golden"], tools: ["impacket-ticketer", "mimikatz", "Rubeus"], difficulty: "intermediate", prerequisites: ["Hash krbtgt (p.ej. tras DCSync)", "Lab autorizado"] }),
  v({ id: "silver-ticket", category: "kerberos", name: "Silver Ticket", shortName: "SilverTicket", tagline: "TGS falso para un servicio concreto.", oneLiner: "Con hash de la cuenta de servicio fabricas TGS hacia ese SPN.", whyItMatters: "Acceso a un servicio sin tocar tanto el DC.", signature: ["Hash de machine/service account", "TGS forjado a CIFS/HTTP/..."], tools: ["impacket-ticketer", "mimikatz"], difficulty: "intermediate" }),
  v({ id: "diamond-ticket", category: "kerberos", name: "Diamond Ticket", shortName: "DiamondTicket", tagline: "Modificar un TGT legítimo (más sigiloso).", oneLiner: "En vez de inventar un Golden, alteras un TGT real con clave krbtgt.", whyItMatters: "Variante moderna más difícil de detectar.", signature: ["Uso de krbtgt + TGT existente"], tools: ["herramientas diamond de lab"], difficulty: "intermediate" }),

  v({ id: "unconstrained-delegation", category: "delegation", name: "Unconstrained Delegation", shortName: "Unconstrained", tagline: "El host guarda TGTs de quien se conecta.", oneLiner: "TRUSTED_FOR_DELEGATION permite reutilizar TGTs (incl. DA si lo engañas).", whyItMatters: "Combo clásico con coerce → DA.", signature: ["BH: UnconstrainedDelegation", "TrustedForDelegation"], tools: ["BloodHound", "Rubeus"], difficulty: "intermediate" }),
  v({ id: "constrained-delegation", category: "delegation", name: "Constrained Delegation", shortName: "Constrained", tagline: "Delegación limitada a SPNs (S4U).", oneLiner: "msDS-AllowedToDelegateTo define a qué servicios puede impersonar.", whyItMatters: "Control de esa cuenta → acceso a esos SPNs como otros usuarios.", signature: ["AllowedToDelegate / msDS-AllowedToDelegateTo"], tools: ["BloodHound", "impacket-getST", "Rubeus"], difficulty: "intermediate" }),
  v({ id: "rbcd", category: "delegation", name: "Resource-Based Constrained Delegation", shortName: "RBCD", tagline: "El recurso decide quién delega hacia él.", oneLiner: "Escribes msDS-AllowedToActOnBehalfOfOtherIdentity y te haces pasar por usuarios hacia ese host.", whyItMatters: "Tras GenericWrite a computer → admin local del host.", signature: ["BH: AddAllowedToAct / GenericWrite a Computer"], cmd: "impacket-rbcd -delegate-from ATTACKER$ -delegate-to TARGET$ -dc-ip <DC> domain/user:pass", tools: ["impacket-rbcd", "Rubeus", "BloodHound"], difficulty: "intermediate" }),

  v({ id: "force-change-password", category: "acl", name: "ForceChangePassword", shortName: "ForceChangePassword", tagline: "Reseteas password de otro usuario.", oneLiner: "Permiso AD para forzar cambio de contraseña sin conocer la actual.", whyItMatters: "Tomas la identidad del objetivo en minutos.", signature: ["BH: ForceChangePassword"], cmd: "net rpc password <user> -U domain/attacker%pass -S <DC>", tools: ["BloodHound", "bloodyAD", "net rpc"] }),
  v({ id: "generic-all", category: "acl", name: "GenericAll", shortName: "GenericAll", tagline: "Full Control sobre el objeto AD.", oneLiner: "Control total: atributos, membresías, resets, etc.", whyItMatters: "Sobre grupo/user/computer = escalada directa según tipo.", signature: ["BH: GenericAll"], tools: ["BloodHound", "dacledit", "bloodyAD"] }),
  v({ id: "generic-write", category: "acl", name: "GenericWrite", shortName: "GenericWrite", tagline: "Escritura amplia de atributos.", oneLiner: "Puedes escribir la mayoría de propiedades del objeto.", whyItMatters: "Camino a Shadow Creds, SPN, scriptPath, RBCD…", signature: ["BH: GenericWrite"], tools: ["BloodHound", "bloodyAD"] }),
  v({ id: "write-dacl", category: "acl", name: "WriteDACL", shortName: "WriteDACL", tagline: "Reescribes la DACL y te das más permisos.", oneLiner: "WriteDACL → te concedes GenericAll → acción final.", whyItMatters: "Permiso para conseguir más permisos.", signature: ["BH: WriteDacl"], tools: ["BloodHound", "dacledit"], difficulty: "intermediate" }),
  v({ id: "write-owner", category: "acl", name: "WriteOwner", shortName: "WriteOwner", tagline: "Cambias el owner del objeto.", oneLiner: "Owner puede reescribir DACL → luego GenericAll.", whyItMatters: "Cadena owner → DACL → abuso.", signature: ["BH: WriteOwner"], tools: ["BloodHound", "owneredit"], difficulty: "intermediate" }),
  v({ id: "add-member", category: "acl", name: "AddMember", shortName: "AddMember", tagline: "Te añades (o añades a alguien) a un grupo.", oneLiner: "Permiso de escritura de miembros sobre un grupo.", whyItMatters: "Grupo privilegiado = escalada inmediata.", signature: ["BH: AddMember / GenericAll on Group"], tools: ["BloodHound", "net group", "bloodyAD"] }),
  v({ id: "owns", category: "acl", name: "Owns", shortName: "Owns", tagline: "Eres owner del objeto AD.", oneLiner: "Como owner puedes tomar control vía DACL.", whyItMatters: "Misma cadena que WriteOwner si ya eres owner.", signature: ["BH: Owns"], tools: ["BloodHound"] }),
  v({ id: "dcsync", category: "acl", name: "DCSync", shortName: "DCSync", tagline: "Replicas secretos del DC.", oneLiner: "GetChanges+GetChangesAll → hashes vía replicación (incl. krbtgt).", whyItMatters: "Casi siempre = Domain Admin efectivo.", signature: ["BH: DCSync / GetChanges+GetChangesAll"], cmd: "impacket-secretsdump domain/user:pass@<DC>", tools: ["impacket-secretsdump", "mimikatz"], difficulty: "intermediate" }),
  v({ id: "shadow-credentials", category: "acl", name: "Shadow Credentials", shortName: "ShadowCreds", tagline: "KeyCredentials → auth con clave/cert.", oneLiner: "Escribes msDS-KeyCredentialLink y obtienes TGT vía PKINIT.", whyItMatters: "Alternativa moderna a reset password.", signature: ["BH: AddKeyCredentialLink"], tools: ["pywhisker", "Whisker", "certipy"], difficulty: "intermediate" }),

  v({ id: "petitpotam-relay", category: "coerce", name: "PetitPotam + Relay", shortName: "PetitPotam", tagline: "Coerce MS-EFSRPC → relay NTLM.", oneLiner: "Fuerzas al host a autenticarse hacia ti y reenvías el NTLM.", whyItMatters: "Camino famoso a ADCS ESC8 / LDAP/SMB en labs.", signature: ["PetitPotam OK", "ntlmrelayx escuchando"], tools: ["PetitPotam", "ntlmrelayx"], difficulty: "intermediate" }),
  v({ id: "printerbug-coerce", category: "coerce", name: "PrinterBug Coerce", shortName: "PrinterBug", tagline: "MS-RPRN fuerza auth del spooler.", oneLiner: "printerbug hace que el target autentique a tu listener.", whyItMatters: "Coerce clásico hacia unconstrained / relay.", signature: ["Spooler activo", "printerbug.py éxito"], cmd: "printerbug.py domain/user:pass@target <listener>", tools: ["printerbug.py", "ntlmrelayx"], difficulty: "intermediate" }),
  v({ id: "webdav-coerce", category: "coerce", name: "WebDAV Coerce", shortName: "WebDAVCoerce", tagline: "Auth HTTP vía WebClient.", oneLiner: "Con WebClient puedes coerzar autenticación HTTP útil para relay a ADCS/HTTP.", whyItMatters: "Cuando SMB firmado bloquea, HTTP sigue abierto a veces.", signature: ["WebClient running", "coerce a http listener"], tools: ["PetitPotam", "PrinterBug", "ntlmrelayx"], difficulty: "intermediate" }),
  v({ id: "scf-lnk-coerce", category: "coerce", name: "SCF/LNK Coerce", shortName: "SCF/LNK", tagline: "Archivo en share engaña al Explorer.", oneLiner: ".scf/.lnk/.url en un share hacen que el usuario autentique a tu IP.", whyItMatters: "Hashes NetNTLM sin phishing complejo.", signature: ["Responder captura hash al abrir el share"], tools: ["Responder", "ntlm_theft"] }),
  v({ id: "ntlm-relay-ldap", category: "coerce", name: "NTLM Relay → LDAP", shortName: "RelayLDAP", tagline: "Relay a LDAP sin signing.", oneLiner: "Si LDAP signing no está forzado, el relay puede crear/modificar objetos.", whyItMatters: "RBCD, Shadow Creds, AddMember vía relay.", signature: ["LDAP signing not required", "ntlmrelayx -t ldap://DC"], tools: ["ntlmrelayx"], difficulty: "intermediate" }),
  v({ id: "ntlm-relay-smb", category: "coerce", name: "NTLM Relay → SMB", shortName: "RelaySMB", tagline: "Relay a SMB sin firmas.", oneLiner: "Reenvías NTLM a un host SMB y obtienes sesión autenticada.", whyItMatters: "Ejecución en el target según privilegios del hash.", signature: ["SMB signing disabled", "ntlmrelayx -t smb://"], tools: ["ntlmrelayx"], difficulty: "intermediate" }),

  v({ id: "sam-lsa-dump", category: "creds", name: "SAM / LSA Secrets", shortName: "SAM/LSA", tagline: "Hashes y secretos locales.", oneLiner: "Con admin local vuelcas SAM/LSA y reutilizas hashes (PTH).", whyItMatters: "Puente privilegio local → lateral movement.", signature: ["Admin local/SYSTEM", "secretsdump local"], tools: ["impacket-secretsdump", "mimikatz"] }),
  v({ id: "lsass-dump", category: "creds", name: "LSASS Dump", shortName: "LSASS", tagline: "Secretos en memoria de LSASS.", oneLiner: "Dump de LSASS revela credenciales/tickets de sesiones.", whyItMatters: "Tesoro post-explotación en labs.", signature: ["SeDebug o SYSTEM", "procdump/mimikatz"], tools: ["procdump", "mimikatz", "nanodump"] }),
  v({ id: "dpapi-secrets", category: "creds", name: "DPAPI Secrets", shortName: "DPAPI", tagline: "Secretos protegidos por DPAPI del usuario.", oneLiner: "Con contexto del usuario (o masterkeys) desencriptas credenciales guardadas.", whyItMatters: "Browser, WiFi, creds de apps.", signature: ["Carpeta Protect/Credentials", "mimikatz dpapi / sharpdpapi"], tools: ["mimikatz", "SharpDPAPI", "DonPAPI"], difficulty: "intermediate" }),
  v({ id: "gpp-passwords", category: "creds", name: "GPP Passwords", shortName: "GPP", tagline: "cpassword en SYSVOL.", oneLiner: "Group Policy Preferences antiguas guardaban passwords cifradas con clave pública conocida.", whyItMatters: "A veces siguen en SYSVOL en labs/legacy.", signature: ["Groups.xml / Services.xml en SYSVOL", "cpassword="], cmd: "findstr /s /i cpassword \\\\dc\\sysvol\\*.xml", tools: ["Get-GPPPassword", "findstr"] }),
  v({ id: "laps-read", category: "creds", name: "LAPS Read", shortName: "LAPS", tagline: "Lees la password local admin gestionada.", oneLiner: "Si tienes derecho de lectura sobre ms-Mcs-AdmPwd, lees LAPS.", whyItMatters: "Admin local de muchos hosts de golpe.", signature: ["BH/LDAP: Read LAPS password", "ms-Mcs-AdmPwd"], tools: ["LAPSToolkit", "bloodyAD", "ldapsearch"] }),
  v({ id: "ntds-dump", category: "creds", name: "NTDS.dit Dump", shortName: "NTDS", tagline: "Base de hashes del dominio.", oneLiner: "Copia/VSS de NTDS.dit (+SYSTEM) permite extraer todos los hashes.", whyItMatters: "Game over del dominio en lab.", signature: ["Acceso DA/backup a DC", "secretsdump -ntds"], tools: ["impacket-secretsdump", "ntdsutil"], difficulty: "intermediate" }),

  v({ id: "sid-history-abuse", category: "trusts", name: "SID History Abuse", shortName: "SIDHistory", tagline: "SIDs extra en el token cruzando trusts.", oneLiner: "SID History puede colar privilegios de otro dominio.", whyItMatters: "Escalada inter-dominio clásica.", signature: ["Trust + SIDHistory en cuenta", "Extra SIDs en token"], tools: ["mimikatz", "lookupsid"], difficulty: "intermediate" }),
  v({ id: "inter-realm-tgt", category: "trusts", name: "Inter-Realm TGT", shortName: "TrustTicket", tagline: "Ticket de confianza entre reinos.", oneLiner: "Con secretos del trust fabricas tickets inter-realm.", whyItMatters: "De dominio hijo/compromiso → padre u otro.", signature: ["Trust key / trust password hash"], tools: ["impacket-ticketer", "raiseChild"], difficulty: "intermediate" }),
  v({ id: "forest-trust-abuse", category: "trusts", name: "Forest Trust Abuse", shortName: "ForestTrust", tagline: "Abusar trust entre bosques.", oneLiner: "Configuraciones de forest trust permiten caminos cross-forest.", whyItMatters: "Nivel avanzado tras DA en un forest.", signature: ["Forest trust enumerado", "BH foreign groups/ACLs"], tools: ["BloodHound", "ticketer"], difficulty: "intermediate" }),

  v({ id: "adcs-bridge", category: "adcs", name: "ADCS ESC (lab hermano)", shortName: "ADCS →", tagline: "ESC1–16 viven en ADCS-ESC-Lab.", oneLiner: "No duplicamos ESC aquí: si hay PKI vulnerable, cambias de lab.", whyItMatters: "Misma metodología, contenido especializado en certificados.", signature: ["certipy find reporta ESC", "Web Enrollment / plantillas"], relatedAdcsLab: true, source: "both", tools: ["certipy-ad"] }),
  v({ id: "adcs-enum-bridge", category: "adcs", name: "Enumerar ADCS → puente", shortName: "ADCS Enum", tagline: "Primero enumera; luego abre ADCS-ESC-Lab.", oneLiner: "certipy find / certify find para ver si hay superficie ADCS.", whyItMatters: "Decide si el camino es certificados u otro vector.", signature: ["CA visible", "Plantillas listadas"], cmd: "certipy-ad find -u user@lab.local -p pass -dc-ip <DC> -stdout", relatedAdcsLab: true, source: "both", tools: ["certipy-ad", "Certify"] }),

  v({ id: "sccm-naa", category: "sccm", name: "SCCM Network Access Account", shortName: "SCCM NAA", tagline: "Credenciales NAA recuperables.", oneLiner: "NAA mal protegida puede filtrar creds de dominio desde SCCM.", whyItMatters: "Creds de alto valor en entornos con MECM.", signature: ["SCCM presente", "NAA en policy/client"], tools: ["sccmhunter", "SharpSCCM", "cmloot"], difficulty: "intermediate" }),
  v({ id: "sccm-admin-site", category: "sccm", name: "SCCM Site Admin", shortName: "SCCM Admin", tagline: "Admin de sitio → ejecución masiva.", oneLiner: "Control del site server permite desplegar apps/scripts como SYSTEM en clientes.", whyItMatters: "Dominio práctico del parque SCCM.", signature: ["Rol Full Administrator / Site System admin"], tools: ["SharpSCCM", "Console SCCM"], difficulty: "intermediate" }),
  v({ id: "sccm-coerce", category: "sccm", name: "SCCM Coerce", shortName: "SCCM Coerce", tagline: "Coerce del site system / clients.", oneLiner: "Componentes SCCM pueden ser forzados a autenticar hacia ti.", whyItMatters: "Relay/creds en labs SCCM (GOAD-SCCM).", signature: ["sccmhunter findings", "coerce a site server"], tools: ["sccmhunter", "ntlmrelayx"], difficulty: "intermediate" }),

  v({ id: "mssql-xp-cmdshell", category: "mssql", name: "MSSQL xp_cmdshell", shortName: "xp_cmdshell", tagline: "SQL → comandos OS.", oneLiner: "Con sysadmin puedes habilitar xp_cmdshell y ejecutar comandos.", whyItMatters: "De DBA a shell en el host SQL.", signature: ["sysadmin", "xp_cmdshell"], tools: ["impacket-mssqlclient", "SQLCMD"] }),
  v({ id: "mssql-linked-server", category: "mssql", name: "MSSQL Linked Servers", shortName: "LinkedSQL", tagline: "Saltar a otros SQL enlazados.", oneLiner: "Linked servers permiten ejecutar consultas/comandos en remotos.", whyItMatters: "Movimiento lateral entre bases.", signature: ["sys.servers", "OPENQUERY"], tools: ["impacket-mssqlclient"], difficulty: "intermediate" }),
  v({ id: "mssql-impersonation", category: "mssql", name: "MSSQL Impersonation", shortName: "SQL Impersonate", tagline: "EXECUTE AS usuario privilegiado.", oneLiner: "Permisos IMPERSONATE permiten actuar como sa/otros.", whyItMatters: "Escalada dentro de SQL sin ser sysadmin aún.", signature: ["IMPERSONATE GRANT", "EXECUTE AS LOGIN"], tools: ["mssqlclient"], difficulty: "intermediate" }),

  v({ id: "hive-nightmare", category: "misc", name: "HiveNightmare / SeriousSAM", shortName: "HiveNightmare", tagline: "ACL incorrecta en SAM (CVE lab).", oneLiner: "Builds vulnerables permitían leer SAM como usuario normal.", whyItMatters: "Ejemplo perfecto de ACL mal puesta.", signature: ["Build vulnerable + ACL SAM"], tools: ["lab PoC"] }),
  v({ id: "machine-account-quota", category: "misc", name: "Machine Account Quota", shortName: "MAQ", tagline: "Crear machine accounts (ms-DS-MachineAccountQuota).", oneLiner: "Por defecto cualquier usuario puede crear hasta 10 computers.", whyItMatters: "Pieza clave para RBCD/ShadowCreds desde lowpriv.", signature: ["MachineAccountQuota > 0", "addcomputer.py OK"], cmd: "impacket-addcomputer domain/user:pass -computer-name ATTACKER$ -computer-pass 'Pass123!'", tools: ["impacket-addcomputer"] }),
  v({ id: "nopac-concept", category: "misc", name: "noPAC (concepto lab)", shortName: "noPAC", tagline: "CVE de PAC validation (lab histórico).", oneLiner: "Fallos de validación del PAC permitían impersonar DA en ciertos parches.", whyItMatters: "Entender PAC/Kerberos; solo en labs patched-aware.", signature: ["DC vulnerable documentado en el lab"], tools: ["noPac lab tools"], difficulty: "intermediate" }),
  v({ id: "printnightmare-lab", category: "misc", name: "PrintNightmare (lab)", shortName: "PrintNightmare", tagline: "Abuso del spooler (CVE lab).", oneLiner: "Vulnerabilidades del Print Spooler permitían RCE/LPE en builds afectadas.", whyItMatters: "Servicio muy expuesto; aprender a apagarlo/auditarlo.", signature: ["Spooler expuesto", "build vulnerable"], tools: ["lab PoC"], difficulty: "intermediate" }),
  v({ id: "gpo-abuse", category: "misc", name: "GPO Abuse", shortName: "GPO Abuse", tagline: "Editas una GPO y ejecutas en muchos hosts.", oneLiner: "Write sobre GPO/OU permite desplegar scheduled tasks/scripts privilegiados.", whyItMatters: "Escalada masiva en el alcance de la GPO.", signature: ["BH: GenericWrite/Edit on GPO", "GPLink a OU interesante"], tools: ["BloodHound", "SharpGPOAbuse"], difficulty: "intermediate" }),
  v({ id: "adminsdholder", category: "acl", name: "AdminSDHolder Abuse", shortName: "AdminSDHolder", tagline: "ACL plantilla de cuentas protegidas.", oneLiner: "Si puedes escribir AdminSDHolder, propagas ACL peligrosas a cuentas admin.", whyItMatters: "Persistencia privilegiada en AD.", signature: ["Write sobre CN=AdminSDHolder", "AdminCount=1"], tools: ["BloodHound", "dacledit"], difficulty: "intermediate" }),
];

const vectors = [...courseSe, ...more];
// dedupe by id
const seen = new Set();
const unique = [];
for (const x of vectors) {
  if (seen.has(x.id)) continue;
  seen.add(x.id);
  // strip helper fields
  delete x.cmd;
  delete x.flow;
  unique.push(x);
}

const byCat = {};
for (const x of unique) {
  (byCat[x.category] ||= []).push(x.id);
}

const groupsMeta = [
  ["local", "Local / Se*", "Empieza aquí: 11 privilegios del curso + misconfig locales.", "#38BDF8", true],
  ["kerberos", "Kerberos", "Tickets, roasting y forja. Después de entender tokens.", "#A78BFA", false],
  ["acl", "ACL / ACE", "Permisos peligrosos sobre objetos AD (BloodHound).", "#FB7185", false],
  ["delegation", "Delegation", "Unconstrained, Constrained y RBCD.", "#FBBF24", false],
  ["coerce", "Coerce / Relay", "Forzar auth y reenviarla (mindmap OCD).", "#34D399", false],
  ["creds", "Credentials", "SAM, LSASS, DPAPI, GPP, LAPS, NTDS.", "#F472B6", false],
  ["trusts", "Trusts", "Abuso de confianzas entre dominios/bosques.", "#60A5FA", false],
  ["adcs", "ADCS", "Puente a ADCS-ESC-Lab (no duplica ESC).", "#2DD4BF", false],
  ["sccm", "SCCM", "NAA, site admin y coerce SCCM.", "#94A3B8", false],
  ["mssql", "MSSQL", "xp_cmdshell, linked servers, impersonation.", "#94A3B8", false],
  ["misc", "Misc / Labs", "MAQ, GPO abuse, CVE de lab y otros.", "#94A3B8", false],
].map(([id, label, description, color, courseTrack]) => ({
  id,
  label,
  description,
  color,
  ...(courseTrack ? { courseTrack: true } : {}),
  vectorIds: byCat[id] || [],
}));

const decisionRows = unique.map((x) => ({ vectorId: x.id, action: x.tagline }));

const blueTeam = groupsMeta.map((g) => ({
  category: g.id,
  detection: [`Inventario y alertas típicas de ${g.label}`, "Correlacionar con BloodHound / logs de seguridad"],
  hardening: [`Reducir superficie de ${g.label}`, "Auditar cambios y privilegios de forma continua"],
}));

const cheatBlocks = groupsMeta.map((g) => ({
  title: g.label,
  lines: (byCat[g.id] || []).slice(0, 8).map((id) => {
    const vec = unique.find((x) => x.id === id);
    return `${vec?.shortName || id}: ${vec?.signature?.[0] || "ver ficha"}`;
  }),
}));

function dumpVector(x) {
  return `  ${JSON.stringify(x, null, 2).replace(/\n/g, "\n  ")}`;
}

const file = `import type {
  BlueTeamRow,
  CheatSheet,
  DecisionTable,
  PatchContext,
  PrivCategoryMeta,
  PrivVector,
} from "./types";

export const groups: PrivCategoryMeta[] = ${JSON.stringify(groupsMeta, null, 2)};

export const vectors: PrivVector[] = [
${unique.map(dumpVector).join(",\n")}
];

export const patchContext: PatchContext = {
  title: "Hardening: privilegios, ACL y firmas OCD",
  paragraphs: [
    "Inventaria Se* en cuentas de servicio y limpia ACL que BloodHound marca en rojo.",
    "Cierra roasting (preauth, gMSA), delegaciones unconstrained y coerce/relay (signing/EPA).",
    "Si hay ADCS, mitiga en el lab hermano ADCS-ESC-Lab. Taxonomía inspirada en Orange Cyberdefense AD mindmap 2025.03.",
  ],
  rule: [
    "whoami /priv en todo foothold",
    "BloodHound: Generic*, WriteDACL, DCSync, RBCD, AdminSDHolder",
    "Kerberos: SPN, preauth, tickets anómalos",
    "Coerce/relay: SMB/LDAP signing + EPA",
    "SCCM/MSSQL: NAA protegida y xp_cmdshell off",
  ],
  whySid:
    "Privilegios y ACL son derechos sobre SIDs. Entender quién tiene qué supera memorizar un exploit.",
};

export const decisionTable: DecisionTable = {
  title: "Si ves esto → mira este vector",
  steps: [
    "1. Host Windows → whoami /priv / servicios",
    "2. Dominio → SPN, ACL, delegación, coerce",
    "3. ADCS → ADCS-ESC-Lab",
    "4. Mitiga siempre",
  ],
  rows: ${JSON.stringify(decisionRows, null, 2)},
};

export const blueTeam: BlueTeamRow[] = ${JSON.stringify(blueTeam, null, 2)};

export const cheatSheet: CheatSheet = {
  title: "Cheat sheet · firmas rápidas (curso + OCD)",
  intro: [
    "Reconoce la firma y abre la ficha. Solo labs autorizados.",
    "Taxonomía inspirada en Orange Cyberdefense AD mindmap 2025.03.",
  ],
  blocks: ${JSON.stringify(cheatBlocks, null, 2)},
};
`;

fs.writeFileSync("src/lib/data/privesc.es.ts", file);

// English mirror: shallow translate key fields via map
const enMap = {
  "Local / Se*": "Local / Se*",
  "Empieza aquí: 11 privilegios del curso + misconfig locales.": "Start here: 11 course privileges + local misconfigs.",
  Kerberos: "Kerberos",
  "Tickets, roasting y forja. Después de entender tokens.": "Tickets, roasting and forgery. After you understand tokens.",
  "ACL / ACE": "ACL / ACE",
  "Permisos peligrosos sobre objetos AD (BloodHound).": "Dangerous permissions on AD objects (BloodHound).",
  Delegation: "Delegation",
  "Unconstrained, Constrained y RBCD.": "Unconstrained, Constrained and RBCD.",
  "Coerce / Relay": "Coerce / Relay",
  "Forzar auth y reenviarla (mindmap OCD).": "Force auth and relay it (OCD mindmap).",
  Credentials: "Credentials",
  "SAM, LSASS, DPAPI, GPP, LAPS, NTDS.": "SAM, LSASS, DPAPI, GPP, LAPS, NTDS.",
  Trusts: "Trusts",
  "Abuso de confianzas entre dominios/bosques.": "Abuse of trusts between domains/forests.",
  ADCS: "ADCS",
  "Puente a ADCS-ESC-Lab (no duplica ESC).": "Bridge to ADCS-ESC-Lab (does not duplicate ESCs).",
  SCCM: "SCCM",
  "NAA, site admin y coerce SCCM.": "NAA, site admin and SCCM coerce.",
  MSSQL: "MSSQL",
  "xp_cmdshell, linked servers, impersonation.": "xp_cmdshell, linked servers, impersonation.",
  "Misc / Labs": "Misc / Labs",
  "MAQ, GPO abuse, CVE de lab y otros.": "MAQ, GPO abuse, lab CVEs and more.",
};

function tr(s) {
  return enMap[s] || s;
}

const groupsEn = groupsMeta.map((g) => ({ ...g, label: tr(g.label), description: tr(g.description) }));
const vectorsEn = unique.map((x) => ({
  ...x,
  tagline: x.tagline,
  oneLiner: x.oneLiner,
  whyItMatters: x.whyItMatters,
  // Keep Spanish technical content readable; mark EN file as content-synced with ES for ops terms
}));

const fileEn = file
  .replace("Hardening: privilegios, ACL y firmas OCD", "Hardening: privileges, ACLs and OCD signatures")
  .replace("Inventaria Se* en cuentas de servicio y limpia ACL que BloodHound marca en rojo.", "Inventory Se* on service accounts and clean ACLs BloodHound paints red.")
  .replace("Cierra roasting (preauth, gMSA), delegaciones unconstrained y coerce/relay (signing/EPA).", "Shut down roasting (preauth, gMSA), unconstrained delegation and coerce/relay (signing/EPA).")
  .replace("Si hay ADCS, mitiga en el lab hermano ADCS-ESC-Lab. Taxonomía inspirada en Orange Cyberdefense AD mindmap 2025.03.", "If ADCS is in scope, harden in sibling ADCS-ESC-Lab. Taxonomy inspired by Orange Cyberdefense AD mindmap 2025.03.")
  .replace("whoami /priv en todo foothold", "whoami /priv on every foothold")
  .replace("Si ves esto → mira este vector", "If you see this → open this vector")
  .replace("1. Host Windows → whoami /priv / servicios", "1. Windows host → whoami /priv / services")
  .replace("2. Dominio → SPN, ACL, delegación, coerce", "2. Domain → SPN, ACL, delegation, coerce")
  .replace("3. ADCS → ADCS-ESC-Lab", "3. ADCS → ADCS-ESC-Lab")
  .replace("4. Mitiga siempre", "4. Always mitigate")
  .replace("Cheat sheet · firmas rápidas (curso + OCD)", "Cheat sheet · quick signatures (course + OCD)")
  .replace("Reconoce la firma y abre la ficha. Solo labs autorizados.", "Spot the signature and open the card. Authorized labs only.")
  .replace("Taxonomía inspirada en Orange Cyberdefense AD mindmap 2025.03.", "Taxonomy inspired by Orange Cyberdefense AD mindmap 2025.03.")
  .replace("Privilegios y ACL son derechos sobre SIDs. Entender quién tiene qué supera memorizar un exploit.", "Privileges and ACLs are rights over SIDs. Knowing who has what beats memorizing an exploit.")
  .replaceAll('"label": "Local / Se*"', '"label": "Local / Se*"');

// Better: regenerate EN from structures with English group labels
const fileEn2 = `import type {
  BlueTeamRow,
  CheatSheet,
  DecisionTable,
  PatchContext,
  PrivCategoryMeta,
  PrivVector,
} from "./types";

export const groups: PrivCategoryMeta[] = ${JSON.stringify(groupsEn, null, 2)};

export const vectors: PrivVector[] = [
${vectorsEn.map(dumpVector).join(",\n")}
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
  rows: ${JSON.stringify(decisionRows, null, 2)},
};

export const blueTeam: BlueTeamRow[] = ${JSON.stringify(
  groupsEn.map((g) => ({
    category: g.id,
    detection: [`Typical inventory/alerts for ${g.label}`, "Correlate with BloodHound / security logs"],
    hardening: [`Reduce ${g.label} attack surface`, "Continuously audit privilege changes"],
  })),
  null,
  2,
)};

export const cheatSheet: CheatSheet = {
  title: "Cheat sheet · quick signatures (course + OCD)",
  intro: [
    "Spot the signature and open the card. Authorized labs only.",
    "Taxonomy inspired by Orange Cyberdefense AD mindmap 2025.03.",
  ],
  blocks: ${JSON.stringify(
    groupsEn.map((g) => ({
      title: g.label,
      lines: (byCat[g.id] || []).slice(0, 8).map((id) => {
        const vec = unique.find((x) => x.id === id);
        return `${vec?.shortName || id}: ${vec?.signature?.[0] || "see card"}`;
      }),
    })),
    null,
    2,
  )},
};
`;

fs.writeFileSync("src/lib/data/privesc.en.ts", fileEn2);
console.log("OK vectors=", unique.length);
console.log(unique.map((x) => x.id).join("\n"));
