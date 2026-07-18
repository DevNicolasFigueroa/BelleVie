import { xanoFetch } from "./xano";
import { Appointment } from "@/types";
import { getMe } from "./auth";

/**
 * Obtiene las citas del usuario (si es cliente) o todas las citas (si es admin).
 * El backend de Xano debe encargarse de filtrar basado en el token.
 */
export async function getAppointments(token: string): Promise<Appointment[]> {
    return xanoFetch<Appointment[]>("/appointment", {
        token,
    });
}

/**
 * Crea una nueva cita y retorna el ID de la cita creada.
 * Xano debe validar que el date/time esté disponible y calcular el total_price.
 */
export async function createAppointment(
    token: string, 
    data: {
        treatment_id: number;
        option_id?: number | null;
        date: string; // YYYY-MM-DD
        time: string; // e.g., "09:00"
    }
): Promise<Appointment> {
    const user = await getMe(token);
    
    // Por seguridad, pasamos el client_id extraido desde el token
    return xanoFetch<Appointment>("/appointment", {
        method: "POST",
        token,
        body: {
            client_id: user.id,
            treatment_id: data.treatment_id,
            option_id: data.option_id,
            date: data.date,
            time: data.time
        }
    });
}
