import { xanoFetch } from "@/lib/xano";
import type { Treatment, TreatmentOption } from "@/types";
import Link from "next/link";

export default async function TratamientoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const treatment = await xanoFetch<Treatment>(`/treatment/${id}`);

    // Solo pedimos las opciones si el tratamiento las tiene (Depilación Láser).
    // Evita un fetch innecesario para los otros 3 tratamientos.
    const isLaserHairRemoval = treatment.name.toLowerCase().includes("depilación láser");

    const options = isLaserHairRemoval
        ? await xanoFetch<TreatmentOption[]>(`/treatment_option?treatment_id=${id}`)
        : [];

    return (
        <main>
            <Link href="/cliente/tratamientos">← Volver</Link>
            <h1>{treatment.name}</h1>
            <p>{treatment.description}</p>

            {!isLaserHairRemoval && (
                <p>${treatment.base_price} — {treatment.duration_min} min</p>
            )}

            {isLaserHairRemoval && (
                <>
                    <h2>Elige la zona</h2>
                    <ul>
                        {options.map((opt) => (
                            <li key={opt.id}>
                                {opt.zone_name} — ${opt.price} ({opt.duration_min} min)
                                {/* El botón de agendar va acá cuando construyamos el flujo de citas */}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </main>
    );
}