import { xanoFetch } from "@/lib/xano";
import type { Product } from "@/types";
import Link from "next/link";

export default async function ProductoDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await xanoFetch<Product>(`/product/${id}`);

    return (
        <main>
            <Link href="/cliente/productos">← Volver</Link>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <p>{product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}</p>
            {/* Botón "Agregar al carrito" va acá cuando construyamos E4 */}
        </main>
    );
}