"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

function ReceiptContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const buyOrder = searchParams.get("buyOrder");
  const amount = searchParams.get("amount");
  const cardLast4 = searchParams.get("cardLast4");
  const authorizationCode = searchParams.get("authorizationCode");

  const isSuccess = status === "success";
  const isCancelled = status === "cancelled";

  return (
    <main className="max-w-xl mx-auto px-6 py-16 text-center">
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-[#d1c5b4]/30 shadow-[0_20px_40px_-15px_rgba(197,160,89,0.12)]">
        
        {isSuccess ? (
          <>
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[40px]">check_circle</span>
            </div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">¡Pago Confirmado!</h1>
            <p className="text-gray-500 font-light mb-8">
              Tu transacción ha sido autorizada exitosamente. Hemos registrado tu reserva / compra.
            </p>

            <div className="bg-[#fcf9f8] p-6 rounded-2xl border border-[#d1c5b4]/30 text-left space-y-3 mb-8 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Orden de Compra:</span>
                <span className="font-mono text-gray-800 font-medium">{buyOrder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Monto Pagado:</span>
                <span className="font-serif text-[#775a19] text-base font-bold">
                  ${parseInt(amount || "0", 10).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tarjeta:</span>
                <span className="text-gray-800 font-medium">**** {cardLast4}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Código Autorización:</span>
                <span className="font-mono text-gray-800 font-medium">{authorizationCode}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/cliente/perfil"
                className="w-full py-4 rounded-xl text-white font-semibold tracking-wide bg-[#775a19] hover:bg-[#5f4613] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
                Ir a Mi Perfil / Mis Citas
              </Link>
              <Link
                href="/"
                className="w-full py-3 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                Volver al Inicio
              </Link>
            </div>
          </>
        ) : isCancelled ? (
          <>
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[40px]">cancel</span>
            </div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">Pago Cancelado</h1>
            <p className="text-gray-500 font-light mb-8">
              Has cancelado el proceso de pago en la pasarela de Webpay.
            </p>
            <Link
              href="/"
              className="w-full block py-4 rounded-xl text-white font-semibold tracking-wide bg-[#1a1a1a] hover:opacity-90 transition-opacity"
            >
              Volver a la Tienda
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[40px]">error</span>
            </div>
            <h1 className="text-3xl font-serif text-gray-900 mb-2">Pago Rechazado</h1>
            <p className="text-gray-500 font-light mb-8">
              Lo sentimos, la transacción no pudo ser autorizada por el banco.
            </p>
            <Link
              href="/"
              className="w-full block py-4 rounded-xl text-white font-semibold tracking-wide bg-[#1a1a1a] hover:opacity-90 transition-opacity"
            >
              Reintentar
            </Link>
          </>
        )}

      </div>
    </main>
  );
}

export default function PagoConfirmadoPage() {
  return (
    <div className="min-h-screen bg-[#fcf9f8] text-gray-900 font-sans selection:bg-amber-100">
      <Navbar />
      <Suspense fallback={<p className="text-center py-20 text-gray-500">Cargando comprobante...</p>}>
        <ReceiptContent />
      </Suspense>
    </div>
  );
}
