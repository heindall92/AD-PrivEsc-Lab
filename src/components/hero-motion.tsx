/** Visual hero panel — no ADCS/Certipy video assets. */
export function HeroMotion() {
  return (
    <figure
      className="hero-video relative mx-auto aspect-square w-full max-w-[36rem] overflow-hidden rounded-[2rem]"
      aria-label="Panel visual: whoami /priv → firma → vector → mitigar"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-background to-accent/20" />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_45%)]" />
      <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">AD PrivEsc Lab</p>
        <ol className="space-y-2 font-mono text-sm text-foreground/90">
          <li className="rounded-lg border border-white/10 bg-background/50 px-3 py-2 backdrop-blur">
            01 · whoami /priv
          </li>
          <li className="rounded-lg border border-white/10 bg-background/50 px-3 py-2 backdrop-blur">
            02 · reconocer firma Se* / Kerberos / ACL
          </li>
          <li className="rounded-lg border border-white/10 bg-background/50 px-3 py-2 backdrop-blur">
            03 · ficha → practicar → mitigar
          </li>
        </ol>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
      <figcaption className="sr-only">
        Recorrido pedagógico de privilege escalation: privilegios, firma, práctica y defensa.
      </figcaption>
    </figure>
  );
}
