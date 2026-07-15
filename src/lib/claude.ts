// Cliente base para el chatbot con Claude API.
// La llamada real a la API de Anthropic debe hacerse desde el backend (route handler),
// nunca desde el cliente, para no exponer la API key.

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export async function sendChatMessage(
    messages: ChatMessage[],
    context: "cliente" | "admin"
): Promise<string> {
    const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, context }),
    });

    if (!res.ok) {
        throw new Error("Error al comunicarse con el chatbot");
    }

    const data = await res.json();
    return data.reply as string;
}