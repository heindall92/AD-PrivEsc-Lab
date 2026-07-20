import { Link } from "@tanstack/react-router";

import { type PrivCategoryMeta, usePrivEscData } from "@/lib/privesc-data";
import { cn } from "@/lib/utils";

interface GroupCardProps {
  group: PrivCategoryMeta;
  compact?: boolean;
}

export function GroupCard({ group, compact = false }: GroupCardProps) {
  const { vectors } = usePrivEscData();
  const items = vectors.filter((v) => v.category === group.id);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-colors hover:bg-card/80",
        compact ? "" : "flex flex-col gap-3",
      )}
      style={{ borderLeftColor: group.color, borderLeftWidth: "4px" }}
    >
      <div>
        <h3 className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-base")}>
          {group.label}
        </h3>
        {!compact && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{group.description}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {items.map((v) => (
          <Link
            key={v.id}
            to="/vector/$vectorId"
            params={{ vectorId: v.id }}
            className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {v.shortName}
          </Link>
        ))}
      </div>
    </div>
  );
}
