"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Treatment, TreatmentOption } from "@/types";
import { getToken, getMe } from "@/lib/auth";
import { addAppointmentToCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

interface AgendaClientProps {
  treatments: Treatment[];
  initialOptions: TreatmentOption[];
}

export default function AgendaClient({ treatments, initialOptions }: AgendaClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTreatmentId = searchParams.get("treatment_id");
  const queryOptionId = searchParams.get("option_id");

  const [selectedTreatmentId, setSelectedTreatmentId] = useState<number | null>(
    queryTreatmentId ? parseInt(queryTreatmentId, 10) : (treatments.length > 0 ? treatments[0].id : null)
  );
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(
    queryOptionId ? parseInt(queryOptionId, 10) : null
  );

  const selectedTreatment = treatments.find(t => t.id === selectedTreatmentId);

  // Opciones aplicables al tratamiento seleccionado
  const availableOptions = React.useMemo(() => selectedTreatment
    ? initialOptions.filter(o => o.treatment_id === selectedTreatment.id)
    : [], [selectedTreatment, initialOptions]);

  // Cuando cambie el tratamiento, si tiene opciones, seleccionamos la primera por defecto.
  // Si no tiene opciones, limpiamos el selectedOptionId
  useEffect(() => {
    if (availableOptions.length > 0) {
      if (!selectedOptionId || !availableOptions.find(o => o.id === selectedOptionId)) {
        setSelectedOptionId(availableOptions[0].id);
      }
    } else {
      setSelectedOptionId(null);
    }
  }, [selectedTreatmentId, availableOptions, selectedOptionId]);

  const selectedOption = availableOptions.find(o => o.id === selectedOptionId);

  // El precio final y la duración final dependen de si hay una opción seleccionada
  const finalPrice = selectedOption ? selectedOption.price : (selectedTreatment?.base_price || 0);
  const finalDuration = selectedOption ? selectedOption.duration_min : (selectedTreatment?.duration_min || 60);
  const deposit = finalPrice / 2;

  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookedHours, setBookedHours] = useState<Set<string>>(new Set());

  const getFormattedDate = (timestamp: number): string => {
    const d = new Date(timestamp);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchBookedHours = async () => {
      if (!selectedDate) {
        setBookedHours(new Set());
        return;
      }
      try {
        const token = getToken();
        if (!token) return;

        const dateStr = getFormattedDate(selectedDate);
        const res = await fetch(`${process.env.NEXT_PUBLIC_XANO_BASE_URL}/appointment?date=${dateStr}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;

        const appointments = await res.json();
        const booked = new Set<string>();
        appointments.forEach((apt: { date: string; status: string; deposit_status: string; time: string }) => {
          if (apt.date === dateStr && apt.status === "confirmed" && apt.deposit_status === "paid") {
            booked.add(apt.time);
          }
        });
        setBookedHours(booked);
      } catch (err) {
        console.error("Error fetching booked hours:", err);
      }
    };

    fetchBookedHours();
  }, [selectedDate]);

  async function handleAddToCart() {
    if (!selectedDate || !selectedTime || !selectedTreatmentId || (availableOptions.length > 0 && !selectedOptionId) || isProcessing) return;
    setIsProcessing(true);
    try {
      const token = getToken();
      if (!token) {
        alert("Debes iniciar sesión para agendar.");
        setIsProcessing(false);
        return;
      }

      const user = await getMe();
      const formattedDate = getFormattedDate(selectedDate);

      // 1. Crear la cita en estado pendiente.
      // total_price y deposit_amount los calcula Xano desde el tratamiento.
      const apptRes = await fetch(`${process.env.NEXT_PUBLIC_XANO_BASE_URL}/appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          client_id: user.id,
          treatment_id: selectedTreatmentId,
          option_id: selectedOptionId,
          date: formattedDate,
          time: selectedTime,
          status: "pending",
          deposit_status: "pending"
        })
      });

      if (!apptRes.ok) {
        alert("No se pudo reservar el horario. Puede que ya haya sido tomado — recarga e intenta de nuevo.");
        setIsProcessing(false);
        return;
      }

      const appointment = await apptRes.json();
      if (!appointment?.id) {
        alert("No se pudo reservar el horario. Intenta nuevamente.");
        setIsProcessing(false);
        return;
      }

      // 2. Agregar al carrito con el depósito calculado por Xano.
      await addAppointmentToCart(appointment.id, appointment.deposit_amount);
      router.push("/cliente/carrito");
    } catch (err: unknown) {
      const error = err as Error;
      alert("Error al agregar al carrito: " + (error.message || String(error)));
      setIsProcessing(false);
    }
  }

  const colors = {
    primary: "#775a19",
    primaryContainer: "#c5a059",
    surface: "#fcf9f8",
    surfaceLowest: "#ffffff",
    secondary: "#5f5e5b",
    secondaryContainer: "#e5e2dd",
    outlineVariant: "#d1c5b4",
    onPrimary: "#ffffff"
  };

  const timeSlots = [
    "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const isTimeAvailable = (time: string): boolean => {
    // Verificar si la hora ya está tomada
    if (bookedHours.has(time)) return false;

    if (!selectedDate) return true;
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Si no es hoy, el horario está disponible
    if (selectedDateObj.getTime() !== today.getTime()) return true;

    // Si es hoy, comparar con la hora actual
    const [hours, minutes] = time.split(":").map(Number);
    const slotTime = new Date();
    slotTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    // Si la hora del slot ya pasó o es la hora actual, no está disponible
    return slotTime.getTime() > now.getTime();
  };

  const getTimeTooltip = (time: string): string => {
    if (bookedHours.has(time)) return "La hora está tomada";
    return "";
  };

  const getIconForTreatment = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("limpieza")) return "spa";
    if (n.includes("peeling")) return "face_retouching_natural";
    if (n.includes("radio")) return "bolt";
    if (n.includes("láser") || n.includes("laser")) return "flash_on";
    return "spa";
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const currentDay = today.getDay();
  const isWeekendToday = currentDay === 0 || currentDay === 6;
  
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);
  
  if (isWeekendToday) {
    monday.setDate(monday.getDate() + 7);
  }

  return (
    <div style={{ backgroundColor: colors.surface, minHeight: "100vh", paddingBottom: "120px" }} className="text-gray-900 selection:bg-amber-100">


      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 py-4 border-b border-[#d1c5b4]/30">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="hover:bg-[#e5e2dd]/50 transition-colors p-2 rounded-full active:scale-95 duration-200">
              <span className="material-symbols-outlined" style={{ color: colors.primary }}>arrow_back</span>
            </button>
          </Link>
          <h1 className="text-2xl font-serif" style={{ color: colors.primary }}>BelleVie</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Selected Treatment Detail */}
        <section className="mb-12">
          {selectedTreatment ? (
            <div className="bg-white shadow-[0_10px_30px_-10px_rgba(197,160,89,0.12)] p-8 rounded-2xl border border-[#d1c5b4]/30 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-[#c5a059]/10 rounded-full flex-shrink-0 flex items-center justify-center border border-[#775a19]/20">
                <span className="material-symbols-outlined text-[48px]" style={{ color: colors.primary }}>
                  {getIconForTreatment(selectedTreatment.name)}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-serif mb-2 text-gray-900">{selectedTreatment.name}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">{selectedTreatment.description}</p>
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fcf9f8] border border-[#d1c5b4]/50 text-sm font-semibold text-gray-700">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    {selectedTreatment.duration_min} min
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fcf9f8] border border-[#d1c5b4]/50 text-sm font-semibold text-[#775a19]">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    {initialOptions.some(o => o.treatment_id === selectedTreatment.id) ? 'Desde ' : ''}
                    ${selectedTreatment.base_price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#d1c5b4]/30 shadow-[0_10px_30px_-10px_rgba(197,160,89,0.12)]">
              <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">spa</span>
              <p className="text-gray-500 mb-6 font-serif text-lg">No has seleccionado ningún tratamiento.</p>
              <Link href="/cliente/tratamientos">
                <button className="px-8 py-3 rounded-full bg-[#1a1a1a] text-white font-medium hover:opacity-90 transition-opacity shadow-lg">
                  Explorar Tratamientos
                </button>
              </Link>
            </div>
          )}

          {/* Opciones de tratamiento (Ej: Zonas para depilación) */}
          {availableOptions.length > 0 && (
            <div className="mt-8 p-6 bg-white shadow-[0_10px_30px_-10px_rgba(197,160,89,0.12)] rounded-xl border border-[#d1c5b4]/50 animate-fade-in">
              <h3 className="text-xl font-serif mb-4" style={{ color: colors.primary }}>Selecciona la zona</h3>
              <div className="flex flex-wrap gap-4">
                {availableOptions.map((opt) => (
                  <label key={opt.id} className="cursor-pointer">
                    <input 
                      type="radio" 
                      name="treatmentOption" 
                      className="hidden peer"
                      value={opt.id}
                      checked={selectedOptionId === opt.id}
                      onChange={() => setSelectedOptionId(opt.id)}
                    />
                    <div className="px-5 py-3 rounded-full border transition-all text-sm font-medium
                      peer-checked:bg-[#775a19] peer-checked:text-white peer-checked:border-[#775a19]
                      border-[#d1c5b4] text-gray-700 hover:border-[#775a19]">
                      {opt.zone_name} — ${opt.price.toLocaleString()}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Date and Time Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-12">
          
          {/* Calendar */}
          <div>
            <h2 className="text-2xl font-serif mb-6" style={{ color: colors.primary }}>Elige una fecha</h2>
            <div className="bg-white shadow-[0_10px_30px_-10px_rgba(197,160,89,0.12)] p-8 rounded-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif text-gray-800 capitalize">
                  {monday.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
                </h3>
              </div>
              
              <div className="grid grid-cols-5 mb-4 text-center text-sm font-medium" style={{ color: colors.secondary }}>
                <div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div>
              </div>
              
              <div className="grid grid-cols-5 gap-y-4 text-center">
                {Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(monday);
                  d.setDate(monday.getDate() + i);
                  
                  const dayNumber = d.getDate();
                  const dayOfWeek = d.getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                  
                  if (isWeekend) return null; // Hide weekends completely
                  
                  const isPast = d.getTime() < today.getTime();
                  const dateValue = d.getTime();

                  if (isPast) {
                    return (
                      <div key={i} className="flex items-center justify-center h-10 w-10 mx-auto text-gray-300 cursor-not-allowed">
                        {dayNumber}
                      </div>
                    );
                  }

                  return (
                    <button 
                      key={i}
                      onClick={() => setSelectedDate(dateValue)}
                      className={`flex items-center justify-center h-10 w-10 mx-auto rounded-full transition-colors font-medium
                        ${selectedDate === dateValue ? 'bg-[#c5a059] text-white shadow-md' : 'hover:bg-[#e5e2dd]/50 text-gray-700'}`}
                    >
                      {dayNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <h2 className="text-2xl font-serif mb-6" style={{ color: colors.primary }}>Horarios disponibles</h2>
            <div className="bg-white shadow-[0_10px_30px_-10px_rgba(197,160,89,0.12)] p-8 rounded-xl">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map(time => {
                  const available = isTimeAvailable(time);
                  const tooltip = getTimeTooltip(time);
                  return (
                    <div key={time} className="relative group">
                      <button
                        onClick={() => available && setSelectedTime(time)}
                        disabled={!available}
                        className={`w-full py-3 text-center rounded-lg border transition-all text-sm font-medium
                          ${!available
                            ? 'border-[#d1c5b4]/30 text-gray-300 cursor-not-allowed bg-gray-50'
                            : selectedTime === time
                            ? 'bg-[#775a19] text-white border-[#775a19]'
                            : 'border-[#d1c5b4] text-gray-700 hover:border-[#775a19]'}`}
                      >
                        {time}
                      </button>
                      {tooltip && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {tooltip}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-8 text-sm italic text-center" style={{ color: colors.secondary }}>
                Duración estimada: {finalDuration} minutos
              </p>
            </div>
          </div>

        </section>
      </main>

      {/* Bottom Summary Panel */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-[0_-10px_30px_-10px_rgba(197,160,89,0.12)] border-t border-[#d1c5b4]/30 py-4 px-6 md:px-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center w-full md:w-auto">
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: colors.secondary }}>Total del tratamiento</p>
              <p className="text-2xl font-serif" style={{ color: colors.primary }}>${finalPrice.toLocaleString()}</p>
            </div>
            <div className="hidden md:block w-px h-10 bg-[#d1c5b4]/50"></div>
            <div className="text-center md:text-left">
              <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: colors.secondary }}>Depósito en carrito (50%)</p>
              <p className="text-2xl font-serif" style={{ color: colors.primaryContainer }}>${deposit.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedDate || !selectedTime || !selectedTreatmentId || (availableOptions.length > 0 && !selectedOptionId) || isProcessing}
            className={`w-full md:w-auto text-white font-medium py-3 px-8 rounded-full flex items-center justify-center gap-3 transition-all
              ${(!selectedDate || !selectedTime || !selectedTreatmentId || (availableOptions.length > 0 && !selectedOptionId) || isProcessing) ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1a1a1a] hover:opacity-90 active:scale-[0.98] shadow-lg'}`}
          >
            {isProcessing ? "Agregando..." : "Agregar al Carrito"}
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
