import { Link, createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePrivEscData } from "@/lib/privesc-data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/tabla")({
  head: () => ({
    meta: [
      { title: "Tabla maestra — AD PrivEsc Lab" },
      {
        name: "description",
        content: "Resumen de vectores de privilege escalation con categoría y dificultad.",
      },
    ],
  }),
  component: TablaPage,
});

function TablaPage() {
  const { lang } = useI18n();
  const { vectors, getGroupById } = usePrivEscData();

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12 pt-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {lang === "en" ? "Master table" : "Tabla maestra"}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {lang === "en"
            ? "Quick view: recognize the signature, open the card. Course Se* privileges first."
            : "Vista rápida: reconoce la firma y abre la ficha. Primero los Se* del curso."}
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-40 text-foreground">
                  {lang === "en" ? "Vector" : "Vector"}
                </TableHead>
                <TableHead className="text-foreground">
                  {lang === "en" ? "In one line" : "En una línea"}
                </TableHead>
                <TableHead className="text-foreground">
                  {lang === "en" ? "Category" : "Categoría"}
                </TableHead>
                <TableHead className="w-36 text-foreground">
                  {lang === "en" ? "Level" : "Nivel"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vectors.map((v) => {
                const group = getGroupById(v.category);
                return (
                  <TableRow key={v.id} className="border-border">
                    <TableCell className="font-medium">
                      <Link
                        to="/vector/$vectorId"
                        params={{ vectorId: v.id }}
                        className="text-primary hover:underline"
                      >
                        {v.shortName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <Link
                        to="/vector/$vectorId"
                        params={{ vectorId: v.id }}
                        className="text-foreground transition-colors hover:text-primary"
                      >
                        {v.tagline}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {group && (
                        <Badge
                          variant="outline"
                          className="whitespace-nowrap"
                          style={{ borderColor: group.color, color: group.color }}
                        >
                          {group.label}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {v.difficulty === "beginner"
                          ? lang === "en"
                            ? "Beginner"
                            : "Principiante"
                          : lang === "en"
                            ? "Intermediate"
                            : "Intermedio"}
                      </Badge>
                      {v.stub && (
                        <span className="ml-2 text-[10px] text-muted-foreground">stub</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
