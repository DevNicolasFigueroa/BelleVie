import { xanoFetch } from "@/lib/xano";
import type { Treatment } from "@/types";
import Link from "next/link";

export default async function TratamientosPage() {
    const treatments = await xanoFetch<Treatment[]>("/treatment");

    return (
        <main>
            <h1>Tratamientos</h1>
            <ul>
                {treatments.map((t) => (
                    <li key={t.id}>
                        <Link href={`/cliente/tratamientos/${t.id}`}>
                            <h2>{t.name}</h2>
                            <p>{t.description}</p>
                            <p>${t.base_price} — {t.duration_min} min</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}