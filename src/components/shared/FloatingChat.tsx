"use client";

import React, { useState, useEffect, useRef } from "react";
import { getToken } from "@/lib/auth";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface CatalogData {
  treatments: any[];
  products: any[];
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [catalogData, setCatalogData] = useState<CatalogData | null>(null);
  const [hasLoadedCatalog, setHasLoadedCatalog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "¡Hola! Soy el asistente de BelleVie. Puedo ayudarte con consultas sobre nuestros tratamientos, productos y disponibilidad. ¿Qué te gustaría saber?",
          timestamp: new Date(),
        },
      ]);
    }

    if (isOpen && !hasLoadedCatalog) {
      loadCatalog();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const loadCatalog = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const [treatmentsRes, productsRes] = await Promise.all([
        fetch("/api/xano/treatments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/xano/products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (treatmentsRes.ok && productsRes.ok) {
        const treatments = await treatmentsRes.json();
        const products = await productsRes.json();
        setCatalogData({ treatments, products });
      }
      setHasLoadedCatalog(true);
    } catch (e) {
      console.error("Error cargando catálogo:", e);
      setHasLoadedCatalog(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversationHistory,
          catalogData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply, timestamp: new Date() },
        ]);
      } else {
        const error = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${error.error || "No pude procesar tu pregunta. Intenta más tarde."}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Disculpa, hubo un error. Intenta nuevamente.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Ventana del Chat */}
      {isOpen && (
        <div className="mb-4 w-[360px] h-[500px] bg-white rounded-3xl shadow-2xl border border-[#d1c5b4]/30 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#775a19] px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-white font-serif text-lg">Asistente BelleVie</h3>
              <p className="text-white/70 text-xs">Consultas sobre tratamientos y productos</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fcf9f8]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-[#775a19] text-white rounded-br-sm"
                      : "bg-white text-gray-900 border border-[#d1c5b4]/30 rounded-bl-sm"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#d1c5b4]/30 px-3.5 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#d1c5b4]/20 bg-white flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-4 py-2.5 rounded-full border border-[#d1c5b4]/40 bg-[#fcf9f8] text-sm text-gray-800 focus:outline-none focus:border-[#775a19] transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 flex-shrink-0 bg-[#775a19] text-white rounded-full hover:bg-[#5f4713] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      )}

      {/* Burbuja flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#775a19] rounded-full shadow-[0_8px_24px_-6px_rgba(119,90,25,0.5)] hover:bg-[#5f4713] transition-all duration-300 hover:scale-105 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-white text-[28px]">
          {isOpen ? "expand_more" : "chat"}
        </span>
      </button>
    </div>
  );
}
