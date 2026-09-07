"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types";

function stockStatus(stock: number) {
  if (stock === 0) return { label: "Agotado", cls: "bg-red-100 text-red-700" };
  if (stock <= 5) return { label: "Stock Bajo", cls: "bg-amber-100 text-amber-700" };
  return { label: "En Stock", cls: "bg-green-100 text-green-700" };
}

export default function AdminInventarioClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [editId, setEditId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (product: Product) => {
    setEditId(product.id);
    setEditValue(String(product.stock));
  };

  const saveStock = async (productId: number) => {
    const newStock = parseInt(editValue, 10);
    if (isNaN(newStock) || newStock < 0) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/product/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
        );
      }
    } catch {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
      );
    } finally {
      setSaving(false);
      setEditId(null);
    }
  };

  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const productImage = (name: string) => {
    const n = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (n.includes("crema") || n.includes("noche") || n.includes("antiage")) return "/productos/crema.png";
    if (n.includes("serum") || n.includes("acido") || n.includes("hialuronico")) return "/productos/serum.png";
    if (n.includes("protector") || n.includes("solar") || n.includes("spf")) return "/productos/protector.png";
    return "/productos/serum.png";
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#c5a059] mb-1">Panel Admin</p>
        <h1 className="text-4xl font-serif text-gray-900">Inventario</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#d1c5b4]/30 p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[22px] text-[#775a19]">inventory_2</span>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Total Productos</p>
            <p className="text-xl font-serif text-gray-900">{products.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#d1c5b4]/30 p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[22px] text-amber-500">warning</span>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Stock Bajo / Agotado</p>
            <p className="text-xl font-serif text-amber-600">{lowStock + outOfStock}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#d1c5b4]/30 p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[22px] text-[#775a19]">payments</span>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">Valor Total Inventario</p>
            <p className="text-xl font-serif text-[#775a19]">${totalValue.toLocaleString("es-CL")}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 p-4 mb-6">
        <div className="relative max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
          <input
            type="text"
            placeholder="Buscar producto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#d1c5b4]/40 bg-[#fcf9f8] text-sm focus:outline-none focus:border-[#775a19] transition-colors"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-[#d1c5b4]/30 shadow-[0_4px_20px_-8px_rgba(197,160,89,0.15)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcf9f8] border-b border-[#d1c5b4]/20 text-[11px] uppercase tracking-widest text-gray-400">
                <th className="px-6 py-4 font-semibold">Producto</th>
                <th className="px-6 py-4 font-semibold text-right">Precio</th>
                <th className="px-6 py-4 font-semibold text-center">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Stock</th>
                <th className="px-6 py-4 font-semibold text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1c5b4]/15">
              {filtered.map((product) => {
                const status = stockStatus(product.stock);
                const isEditing = editId === product.id;
                return (
                  <tr key={product.id} className="hover:bg-[#fcf9f8]/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f6f3f2] shrink-0 relative">
                          <Image
                            src={productImage(product.name)}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-serif text-base text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-serif text-[#775a19]">${product.price.toLocaleString("es-CL")}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-16 text-center px-2 py-1 rounded-lg border border-[#775a19] text-sm text-gray-900 bg-white focus:outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveStock(product.id);
                              if (e.key === "Escape") setEditId(null);
                            }}
                          />
                          <button
                            onClick={() => saveStock(product.id)}
                            disabled={saving}
                            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">check</span>
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(product)}
                          className="flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg hover:bg-[#fcf9f8] border border-transparent hover:border-[#d1c5b4]/40 transition-colors group"
                          title="Editar stock"
                        >
                          <span className="font-semibold text-gray-800">{product.stock}</span>
                          <span className="material-symbols-outlined text-[14px] text-gray-300 group-hover:text-[#775a19] transition-colors">edit</span>
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-gray-500">${(product.price * product.stock).toLocaleString("es-CL")}</p>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-200 block mb-3">inventory_2</span>
                    <p className="text-gray-400 text-sm">No se encontraron productos.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[#d1c5b4]/20 text-xs text-gray-400">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
