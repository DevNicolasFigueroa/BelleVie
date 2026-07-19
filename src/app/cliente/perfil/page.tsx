import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { xanoFetch } from "@/lib/xano";
import { Appointment, Treatment, User } from "@/types";
import ClientProfile from "./ClientProfile";

export default async function ClientProfilePage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("bellevie_auth_token")?.value;

    if (!token) {
        redirect("/cliente/login");
    }

    const XANO_AUTH_URL = process.env.NEXT_PUBLIC_XANO_AUTH_URL as string;
    let user: User | null = null;
    let appointments: any[] = [];
    let treatments: Treatment[] = [];

    try {
        // Fetch user profile
        const userRes = await fetch(`${XANO_AUTH_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });

        if (!userRes.ok) throw new Error("Unauthorized");
        user = await userRes.json();
    } catch (e) {
        redirect("/cliente/login");
    }

    try {
        // Obtenemos los tratamientos para cruzar
        treatments = await xanoFetch<Treatment[]>("/treatment").catch(() => []);
        
        // Obtenemos las citas del cliente. Asumimos que Xano devuelve todo si es admin 
        // o filtra por `client_id` si el token pertenece a un cliente, o lo filtraremos aquí
        const allAppointments = await xanoFetch<Appointment[]>("/appointment", {
            headers: { Authorization: `Bearer ${token}` }
        }).catch(() => []);

        // Filtramos para asegurar que solo sean las citas de este usuario
        const myAppointments = allAppointments.filter(app => app.client_id === user!.id);

        appointments = myAppointments.map(app => {
            const treatment = treatments.find(t => t.id === app.treatment_id);
            return {
                ...app,
                treatmentName: treatment ? treatment.name : `Tratamiento #${app.treatment_id}`,
            };
        });

    } catch (e) {
        console.error("Error cargando perfil del cliente", e);
    }

    return <ClientProfile user={user} appointments={appointments} />;
}
