import { createFileRoute, notFound } from "@tanstack/react-router";

import { VectorDetail } from "@/components/vector-detail";
import { getVectorById, usePrivEscData } from "@/lib/privesc-data";

export const Route = createFileRoute("/vector/$vectorId")({
  loader: ({ params }) => {
    const vector = getVectorById(params.vectorId);
    if (!vector) {
      throw notFound();
    }
    return { vectorId: params.vectorId };
  },
  head: ({ loaderData }) => {
    const vector = loaderData ? getVectorById(loaderData.vectorId) : undefined;
    const title = vector ? `${vector.name} — AD PrivEsc Lab` : "Vector — AD PrivEsc Lab";
    const description = vector ? `${vector.shortName}: ${vector.tagline}` : "Privilege escalation vector.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: VectorPage,
});

function VectorPage() {
  const { vectorId } = Route.useLoaderData();
  const { getVectorById: getLocalized } = usePrivEscData();
  const vector = getLocalized(vectorId);
  if (!vector) return null;
  return <VectorDetail vector={vector} />;
}
