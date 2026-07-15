import { xanoFetch } from "@/lib/xano";
import type { Product } from "@/types";
import Link from "next/link";

export default async function ProductosPage() {
    const products = await xanoFetch<Product[]>("/product");

    return (
        <main>
            <h1>Productos</h1>
            <ul>
                {products.map((p) => (
                    <li key={p.id}>
                        <Link href={`/cliente/productos/${p.id}`}>
                            <h2>{p.name}</h2>
                            <p>{p.description}</p>
                            <p>${p.price} — Stock: {p.stock}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}