import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Contexto del sistema para el chatbot
const SYSTEM_CONTEXT = `Eres un asistente amable y profesional de BelleVie, una clínica de kinesiología estética en Santiago, Chile.

Tu rol es:
- Responder preguntas sobre tratamientos, productos y disponibilidad
- Ser informativo y cortés
- Sugerir tratamientos basados en necesidades del cliente
- Informar sobre horarios y disponibilidad
- Direccionar al usuario a agendar si lo desea

IMPORTANTE: Solo eres un consultor. No puedes completar compras o agendamientos, pero puedes guiar al cliente sobre cómo hacerlo.

Responde siempre en español, de forma clara y concisa.`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, catalogData } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Mensaje requerido" },
        { status: 400 }
      );
    }

    if (!GROQ_API_KEY) {
      console.error("GROQ_API_KEY no configurada");
      return NextResponse.json(
        { error: "GROQ_API_KEY no configurada" },
        { status: 500 }
      );
    }

    // Construir el contexto con datos del catálogo
    let systemPrompt = SYSTEM_CONTEXT;
    if (catalogData) {
      systemPrompt += `\n\nCatálogo disponible:\n${JSON.stringify(catalogData, null, 2)}`;
    }

    // Construir el historial de conversación en formato OpenAI-compatible
    const messages = [
      { role: "system", content: systemPrompt },
    ];

    // Agregar historial previo
    if (conversationHistory && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.parts?.[0]?.text || "",
        });
      }
    }

    // Agregar mensaje actual
    messages.push({
      role: "user",
      content: message,
    });

    console.log("Enviando a Groq:", JSON.stringify(messages).substring(0, 200));

    // Llamar a Groq API
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 1024,
        messages,
      }),
    });

    const responseText = await response.text();
    console.log("Respuesta Groq:", response.status, responseText.substring(0, 200));

    if (!response.ok) {
      console.error("Groq API error:", responseText);
      return NextResponse.json(
        { error: `Error Groq ${response.status}: ${responseText.substring(0, 300)}` },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);
    const reply = data.choices?.[0]?.message?.content ||
                  "Lo siento, no pude generar una respuesta.";

    return NextResponse.json({
      reply,
      success: true,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: `Error: ${error instanceof Error ? error.message : "Desconocido"}` },
      { status: 500 }
    );
  }
}
