import { xanoFetch } from "@/lib/xano";
import { Appointment, Treatment } from "@/types";
import AdminCitasClient from "./AdminCitasClient";

export default async function AdminCitasPage() {
  try {
    // 1. Obtener citas de la BD (asumiendo que en modo dev devuelve todo sin token, 
    // o deberíamos pasar un token de admin real en el futuro)
    const appointments = await xanoFetch<Appointment[]>("/appointment").catch(() => []);
    
    // 2. Obtener tratamientos para poder cruzar los IDs con los nombres
    const treatments = await xanoFetch<Treatment[]>("/treatment").catch(() => []);
    
    // 3. Obtener usuarios para mapear el client_id al clientName
    // Los endpoints de usuarios en Xano típicamente viven en el grupo de Autenticación
    const XANO_AUTH_URL = process.env.NEXT_PUBLIC_XANO_AUTH_URL as string;
    const usersRes = await fetch(`${XANO_AUTH_URL}/user`, { cache: 'no-store' });
    const users = usersRes.ok ? await usersRes.json() : [];
    
    const mappedAppointments = appointments.map((app: any) => {
      const treatment = treatments.find(t => t.id === app.treatment_id);
      const user = users.find(u => u.id === app.client_id);
      
      // Intentamos obtener el nombre por Add-on (_user o _client) o cruzando con la tabla /user
      const resolvedClientName = app._user?.name || app._client?.name || (user ? user.name : `Cliente #${app.client_id}`);

      return {
        id: app.id,
        clientName: resolvedClientName,
        treatmentName: treatment ? treatment.name : `Tratamiento #${app.treatment_id}`,
        time: app.time || "Sin hora",
        status: app.status || "pending",
        price: app.total_price || (treatment ? treatment.base_price : 0)
      };
    });

    return <AdminCitasClient initialAppointments={mappedAppointments as any} />;
  } catch (error) {
    console.error("Error fetching admin appointments:", error);
    return <AdminCitasClient initialAppointments={[]} />;
  }
}
