import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const HF_SRC = "/hyperframes/hero/index.html?loop=1";
const STAGE = 1080;

/**
 * Hero “recuadro”: composición HyperFrames (GSAP) embebida y escalada.
 * Fuente: hyperframes/hero-motion → public/hyperframes/hero
 */
export function HeroMotion() {
  const reduce = useReducedMotion();
  const shellRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(w / STAGE);
    });
    ro.observe(el);
    setScale(el.clientWidth / STAGE);
    return () => ro.disconnect();
  }, []);

  return (
    <figure
      className="hero-video relative mx-auto aspect-square w-full max-w-[36rem] overflow-hidden rounded-[2rem]"
      aria-label="Animación HyperFrames: whoami /priv → firma → ruta pedagógica"
    >
      <div ref={shellRef} className="absolute inset-0 overflow-hidden bg-[#09101d]">
        {reduce ? (
          <HeroPoster />
        ) : (
          <iframe
            title="AD PrivEsc HyperFrames hero"
            src={HF_SRC}
            className="pointer-events-none absolute left-0 top-0 border-0"
            style={{
              width: STAGE,
              height: STAGE,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
            loading="eager"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
      <figcaption className="sr-only">
        Secuencia educativa PRIV → FIRMA → RUTA: privilegios Se*, reconocimiento de firma y método de mitigación.
      </figcaption>
    </figure>
  );
}

function HeroPoster() {
  return (
    <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_80%_10%,rgba(73,139,255,0.22),transparent_40%),radial-gradient(circle_at_15%_90%,rgba(49,212,139,0.22),transparent_45%),#09101d] p-6 sm:p-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
        <span>ad-privesc / lab.local</span>
        <span className="text-emerald-400">live</span>
      </div>
      <ol className="space-y-2 font-mono text-sm text-foreground/90">
        <li className="rounded-lg border border-emerald-400/35 bg-emerald-400/10 px-3 py-2 text-emerald-200">
          01 · whoami /priv
        </li>
        <li className="rounded-lg border border-white/10 bg-background/40 px-3 py-2">
          02 · reconocer firma Se* / Kerberos / ACL
        </li>
        <li className="rounded-lg border border-white/10 bg-background/40 px-3 py-2">
          03 · ficha → practicar → mitigar
        </li>
      </ol>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
        HyperFrames · reduced motion
      </p>
    </div>
  );
}
