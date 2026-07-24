"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitType, setSubmitType] = useState<"success" | "error" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitType(null);

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitType("success");
        setSubmitMessage("¡Gracias por tu mensaje! Nos pondremos en contacto pronto.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        setSubmitType("error");
        setSubmitMessage("Error al enviar el mensaje. Intenta nuevamente.");
      }
    } catch (e) {
      setSubmitType("error");
      setSubmitMessage("Error de conexión. Intenta más tarde.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitMessage("");
        setSubmitType(null);
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
            Nombre Completo
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Tu nombre"
            className="w-full px-4 py-3 rounded-xl border border-[#d1c5b4]/40 bg-white text-sm text-gray-800 focus:outline-none focus:border-[#775a19] focus:ring-2 focus:ring-[#775a19]/10 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="tu@email.com"
            className="w-full px-4 py-3 rounded-xl border border-[#d1c5b4]/40 bg-white text-sm text-gray-800 focus:outline-none focus:border-[#775a19] focus:ring-2 focus:ring-[#775a19]/10 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+56 9 1234 5678"
            className="w-full px-4 py-3 rounded-xl border border-[#d1c5b4]/40 bg-white text-sm text-gray-800 focus:outline-none focus:border-[#775a19] focus:ring-2 focus:ring-[#775a19]/10 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
            Asunto
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#d1c5b4]/40 bg-white text-sm text-gray-800 focus:outline-none focus:border-[#775a19] focus:ring-2 focus:ring-[#775a19]/10 transition-colors"
          >
            <option value="">Selecciona un asunto</option>
            <option value="consulta">Consulta General</option>
            <option value="cita">Agendar Cita</option>
            <option value="producto">Consulta sobre Productos</option>
            <option value="reclamo">Reclamo o Sugerencia</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">
          Mensaje
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Cuéntanos cómo podemos ayudarte..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-[#d1c5b4]/40 bg-white text-sm text-gray-800 focus:outline-none focus:border-[#775a19] focus:ring-2 focus:ring-[#775a19]/10 transition-colors resize-none"
        />
      </div>

      {submitMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold ${
            submitType === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {submitMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[#775a19] text-white rounded-xl hover:bg-[#5f4713] transition-colors font-semibold uppercase tracking-widest text-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
            Enviando...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">send</span>
            Enviar Mensaje
          </>
        )}
      </button>
    </form>
  );
}
