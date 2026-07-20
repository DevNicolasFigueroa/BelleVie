import { NextResponse } from "next/server";
import { webpayTransaction } from "@/lib/webpay";
import { xanoFetch } from "@/lib/xano";

export async function GET(request: Request) {
    return handleCommit(request);
}

export async function POST(request: Request) {
    return handleCommit(request);
}

async function handleCommit(request: Request) {
    const origin = new URL(request.url).origin;
    const url = new URL(request.url);
    
    let token = url.searchParams.get("token_ws");
    const tbkToken = url.searchParams.get("TBK_TOKEN");

    if (!token && request.method === "POST") {
        try {
            const formData = await request.formData();
            token = formData.get("token_ws") as string;
        } catch (e) {
            // no form data
        }
    }

    // Si el usuario canceló la compra en la pantalla de Webpay
    if (tbkToken || !token) {
        return NextResponse.redirect(`${origin}/cliente/pago-confirmado?status=cancelled`);
    }

    try {
        // Confirmamos la transacción con Transbank
        const commitResponse = await webpayTransaction.commit(token);

        // response_code === 0 significa Autorizada con Éxito
        if (commitResponse.response_code === 0) {
            const buyOrder = commitResponse.buy_order || "";

            // Si el buyOrder corresponde a un agendamiento de cita
            if (buyOrder.startsWith("APPT-")) {
                const appointmentId = buyOrder.split("-")[1];
                if (appointmentId) {
                    try {
                        await xanoFetch(`/appointment/${appointmentId}`, {
                            method: "PATCH",
                            body: {
                                status: "confirmed",
                                deposit_status: "paid"
                            }
                        });
                    } catch (err) {
                        console.error("No se pudo actualizar la cita en Xano:", err);
                    }
                }
            }

            const params = new URLSearchParams({
                status: "success",
                buyOrder,
                amount: (commitResponse.amount || 0).toString(),
                cardLast4: commitResponse.card_detail?.card_number || "****",
                authorizationCode: commitResponse.authorization_code || "",
            });

            return NextResponse.redirect(`${origin}/cliente/pago-confirmado?${params.toString()}`);
        } else {
            return NextResponse.redirect(`${origin}/cliente/pago-confirmado?status=rejected`);
        }
    } catch (error: any) {
        console.error("Error al confirmar transacción Webpay:", error);
        return NextResponse.redirect(`${origin}/cliente/pago-confirmado?status=error`);
    }
}
