import { xanoFetch } from "@/lib/xano";
import type { Product } from "@/types";
import AdminInventarioClient from "./AdminInventarioClient";

export default async function AdminInventarioPage() {
  const products = await xanoFetch<Product[]>("/product").catch(() => [] as Product[]);
  return <AdminInventarioClient initialProducts={products} />;
}
