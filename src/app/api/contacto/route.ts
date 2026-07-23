import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, phone, subject, message } = body;

    // Validación básica
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Aquí se podría guardar en BD, enviar email, etc.
    // Por ahora, solo simulamos el envío
    console.log("📧 Nuevo mensaje de contacto:", {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mensaje enviado correctamente",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en contacto:", error);
    return NextResponse.json(
      { error: "Error procesando el formulario" },
      { status: 500 }
    );
  }
}
