import { xanoFetch } from "@/lib/xano";
import { Treatment, TreatmentOption } from "@/types";
import { Suspense } from "react";
import AgendaClient from "./AgendaClient";

export default async function AgendaPage() {
  // Fetch treatments server-side
  const treatments = await xanoFetch<Treatment[]>("/treatment").catch(() => []);

  // Fetch options if there are any laser treatments
  const laserTreatment = treatments.find(t => t.name.toLowerCase().includes("depilación láser") || t.name.toLowerCase().includes("depilacion laser"));
  
  let options: TreatmentOption[] = [];
  if (laserTreatment) {
    options = await xanoFetch<TreatmentOption[]>(`/treatment_option?treatment_id=${laserTreatment.id}`).catch(() => []);
  }

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AgendaClient treatments={treatments} initialOptions={options} />
    </Suspense>
  );
}
