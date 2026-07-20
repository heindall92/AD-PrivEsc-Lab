import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeLangToggle } from "@/components/theme-lang-toggle";
import { useI18n } from "@/lib/i18n";

/**
 * Hero = banner oficial a full-bleed, pegado arriba (sin header de app en home).
 */
export function HeroStage() {
  const { t } = useI18n();

  return (
    <section className="hero-bleed" aria-label="AD-P PrivEsc Lab">
      <h1 className="sr-only">AD-P PrivEsc Lab</h1>

      <div className="hero-bleed__frame">
        <img
          src="/hero-banner.png"
          alt="AD-P PrivEsc Lab: tipografía metálica PRIVESC LAB y núcleo Active Directory"
          className="hero-bleed__img"
          width={1672}
          height={941}
          decoding="async"
          fetchPriority="high"
        />

        <div className="hero-bleed__nav">
          <SidebarTrigger className="hero-bleed__sidebar-btn glass-control h-10 w-10 rounded-full" />
        </div>

        <div className="hero-bleed__controls">
          <ThemeLangToggle size="md" className="hero-bleed__toggle" />
        </div>

        <Link to="/curso" className="hero-cta-theme hero-bleed__cta group">
          <span>{t("home.cta.startShort")}</span>
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
