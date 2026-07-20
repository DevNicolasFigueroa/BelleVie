import { NextResponse } from "next/server";
import { webpayTransaction } from "@/lib/webpay";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const amount = Math.round(body.amount || 0);

        if (!amount || amount <= 0) {
            return NextResponse.json({ ok: false, error: "Monto inválido" }, { status: 400 });
        }

        // Generamos identificadores únicos para la transacción o usamos el buyOrder proporcionado
        const buyOrder = body.buyOrder || `O-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const sessionId = `S-${Date.now()}`;

        // URL a la que Transbank redirige automáticamente tras completar el formulario de pago
        const origin = request.headers.get("origin") || "http://localhost:3000";
        const returnUrl = `${origin}/api/webpay/commit`;

        // Iniciar transacción en Webpay Plus
        const response = await webpayTransaction.create(
            buyOrder,
            sessionId,
            amount,
            returnUrl
        );

        return NextResponse.json({
            ok: true,
            token: response.token,
            url: response.url,
            buyOrder,
        });
    } catch (error: any) {
        console.error("Error al iniciar Webpay:", error);
        return NextResponse.json({ ok: false, error: error.message || "Error al iniciar pago" }, { status: 500 });
    }
}
