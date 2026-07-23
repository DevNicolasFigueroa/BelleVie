import Navbar from "@/components/shared/Navbar";
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-[#fcf9f8] min-h-screen text-gray-900 font-sans selection:bg-amber-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-16">
          <h1 className="text-5xl font-serif text-gray-900 tracking-tight mb-4">Contacto</h1>
          <p className="text-gray-600 text-lg font-light max-w-2xl">
            ¿Tienes preguntas o sugerencias? Nos encantaría escucharte. Completa el formulario a continuación y nos pondremos en contacto pronto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.1)]">
              <ContactForm />
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-6">
            {/* Teléfono */}
            <div className="bg-white rounded-3xl p-6 border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.1)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#c5a059]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#775a19] text-[20px]">phone</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-gray-900 mb-1">Teléfono</h3>
                  <p className="text-gray-600 text-sm">+56 9 1234 5678</p>
                  <p className="text-gray-500 text-xs mt-1">Lunes a Viernes, 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-3xl p-6 border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.1)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#c5a059]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#775a19] text-[20px]">mail</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600 text-sm">hola@bellevie.cl</p>
                  <p className="text-gray-500 text-xs mt-1">Respuesta en 24 horas</p>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white rounded-3xl p-6 border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.1)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#c5a059]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#775a19] text-[20px]">location_on</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-gray-900 mb-1">Ubicación</h3>
                  <p className="text-gray-600 text-sm">Santiago, Región Metropolitana</p>
                  <p className="text-gray-500 text-xs mt-1">Chile</p>
                </div>
              </div>
            </div>

            {/* Horario */}
            <div className="bg-white rounded-3xl p-6 border border-[#d1c5b4]/30 shadow-[0_10px_30px_-15px_rgba(197,160,89,0.1)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#c5a059]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#775a19] text-[20px]">schedule</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-gray-900 mb-1">Horario</h3>
                  <p className="text-gray-600 text-sm">Lunes a Viernes</p>
                  <p className="text-gray-500 text-xs">9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
