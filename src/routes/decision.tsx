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

export const Route = createFileRoute("/decision")({
  head: () => ({
    meta: [
      { title: "Tabla de decisión — AD PrivEsc Lab" },
      {
        name: "description",
        content: "Si ves esta firma, mira este vector. Guía pedagógica de reconocimiento.",
      },
    ],
  }),
  component: DecisionPage,
});

function DecisionPage() {
  const { lang } = useI18n();
  const { decisionTable, vectors, getGroupById } = usePrivEscData();

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-12 pt-6">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {decisionTable.title}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {lang === "en"
            ? "You do not need to memorize tools. Match what you see to a signature, then open the card."
            : "No hace falta memorizar herramientas. Empareja lo que ves con una firma y abre la ficha."}
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          {lang === "en" ? "Algorithm" : "Algoritmo"}
        </h2>
        <ol className="space-y-3">
          {decisionTable.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          {lang === "en" ? "Signature → action" : "Firma → acción"}
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-48 text-foreground">
                    {lang === "en" ? "Vector" : "Vector"}
                  </TableHead>
                  <TableHead className="text-foreground">
                    {lang === "en" ? "What to do" : "Qué hacer"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decisionTable.rows.map((row) => {
                  const vector = vectors.find((v) => v.id === row.vectorId);
                  const group = vector ? getGroupById(vector.category) : undefined;
                  return (
                    <TableRow key={row.vectorId} className="border-border">
                      <TableCell className="font-medium">
                        <Link
                          to="/vector/$vectorId"
                          params={{ vectorId: row.vectorId }}
                          className="text-primary hover:underline"
                        >
                          {vector?.shortName ?? row.vectorId}
                        </Link>
                        {group && (
                          <Badge
                            variant="outline"
                            className="ml-2 whitespace-nowrap"
                            style={{ borderColor: group.color, color: group.color }}
                          >
                            {group.label}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">{row.action}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
}
