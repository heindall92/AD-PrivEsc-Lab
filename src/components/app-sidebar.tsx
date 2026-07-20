import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import {
  BookOpen,
  Brain,
  ChevronRight,
  FileTerminal,
  GraduationCap,
  Grid3X3,
  Home,
  KeyRound,
  Shield,
  ShieldAlert,
  Siren,
  Table2,
  Target,
  Terminal,
} from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePrivEscData } from "@/lib/privesc-data";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const sections = [
  { key: "nav.home", url: "/", icon: Home },
  { key: "nav.course", url: "/curso", icon: GraduationCap },
  { key: "nav.map", url: "/mapa", icon: Brain },
  { key: "nav.masterTable", url: "/tabla", icon: Table2 },
  { key: "nav.practice", url: "/practica", icon: Target },
  { key: "nav.patch", url: "/parche", icon: ShieldAlert },
  { key: "nav.decision", url: "/decision", icon: Grid3X3 },
  { key: "nav.blueTeam", url: "/blue-team", icon: Shield },
  { key: "nav.cheatSheet", url: "/cheat-sheet", icon: FileTerminal },
  { key: "nav.adcs", url: "/adcs", icon: KeyRound },
];

function groupIcon(id: string) {
  switch (id) {
    case "local":
      return <Terminal className="h-4 w-4 shrink-0" />;
    case "kerberos":
      return <KeyRound className="h-4 w-4 shrink-0" />;
    case "acl":
      return <Siren className="h-4 w-4 shrink-0" />;
    case "delegation":
      return <ChevronRight className="h-4 w-4 shrink-0" />;
    case "adcs":
      return <Shield className="h-4 w-4 shrink-0" />;
    default:
      return <BookOpen className="h-4 w-4 shrink-0" />;
  }
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { t } = useI18n();
  const { vectors, groups } = usePrivEscData();
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isActive = (path: string) => currentPath === path;

  useEffect(() => {
    setOpenGroups((prev) => {
      const next = { ...prev };
      for (const group of groups) {
        const groupVectors = vectors.filter((v) => v.category === group.id);
        if (groupVectors.some((v) => isActive(`/vector/${v.id}`))) {
          next[group.id] = true;
        }
      }
      return next;
    });
  }, [currentPath, groups, vectors]);

  const setGroupOpen = (groupId: string, open: boolean) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: open }));
  };

  return (
    <Sidebar collapsible="icon" className="glass-sidebar border-r">
      <SidebarHeader className="sidebar-brand border-b border-white/10 px-4 pb-5 pt-7">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 text-foreground transition-colors hover:text-primary",
            collapsed && "justify-center",
          )}
        >
          <div className="glass-chip flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Terminal className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-base font-semibold tracking-tight">{t("app.name")}</div>
              <div className="text-xs text-muted-foreground">{t("app.tagline")}</div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2 pb-4">
        <SidebarGroup className="mt-5 px-1">
          <SidebarGroupLabel className="sidebar-section-label mb-2 h-auto px-2 py-1 text-[11px] uppercase tracking-[0.18em]">
            {t("nav.sections")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {sections.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={t(item.key)}
                    className="sidebar-nav-item h-10 rounded-xl text-sm"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{t(item.key)}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6 px-1">
          <SidebarGroupLabel className="sidebar-section-label mb-2 h-auto px-2 py-1 text-[11px] uppercase tracking-[0.18em]">
            {t("nav.vectors")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {groups.map((group) => {
                const groupVectors = vectors.filter((v) => v.category === group.id);
                const groupActive = groupVectors.some((v) => isActive(`/vector/${v.id}`));
                const isOpen = openGroups[group.id] ?? false;
                const firstId = groupVectors[0]?.id ?? "se-impersonate";

                if (collapsed) {
                  return (
                    <SidebarMenuItem key={group.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={groupActive}
                        tooltip={group.label}
                        className="sidebar-nav-item h-10 rounded-xl"
                      >
                        <Link to="/vector/$vectorId" params={{ vectorId: firstId }}>
                          {groupIcon(group.id)}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={group.id}>
                    <Collapsible open={isOpen} onOpenChange={(open) => setGroupOpen(group.id, open)}>
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          data-active={groupActive}
                          className={cn(
                            "sidebar-esc-trigger flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                            isOpen && "sidebar-esc-trigger-open",
                            groupActive && "sidebar-esc-trigger-active",
                          )}
                          style={{ "--esc-group-color": group.color } as CSSProperties}
                        >
                          <span className="text-muted-foreground">{groupIcon(group.id)}</span>
                          <span className="min-w-0 flex-1 truncate font-medium text-foreground/90">
                            {group.label}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {groupVectors.length}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                              isOpen && "rotate-180",
                            )}
                            aria-hidden="true"
                          />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="sidebar-esc-content overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                        <SidebarMenuSub className="mx-0 mt-1 border-l border-white/10 pl-3">
                          {groupVectors.map((v) => (
                            <SidebarMenuSubItem key={v.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(`/vector/${v.id}`)}
                                className="sidebar-nav-sub h-9 rounded-lg text-sm"
                              >
                                <Link to="/vector/$vectorId" params={{ vectorId: v.id }}>
                                  {v.shortName}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
