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
    let orders: any[] = [];
    let treatments: Treatment[] = [];
    let products: any[] = [];

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
        // Obtenemos los tratamientos y productos para cruzar
        treatments = await xanoFetch<Treatment[]>("/treatment").catch(() => []);
        products = await xanoFetch<any[]>("/product").catch(() => []);

        // Obtenemos las citas del cliente
        const allAppointments = await xanoFetch<Appointment[]>("/appointment", {
            token,
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

        // Obtenemos los pedidos del cliente
        const allOrders = await xanoFetch<any[]>("/order", {
            token,
        }).catch(() => []);

        // Filtramos para asegurar que solo sean los pedidos de este usuario
        orders = allOrders.filter(order => order.client_id === user!.id)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map(order => {
                // Expandir items con nombres
                const expandedItems = order.items?.map((item: any) => {
                    if (item.item_type === 'product') {
                        const product = products.find(p => p.id === item.product_id);
                        return {
                            ...item,
                            name: product ? product.name : `Producto #${item.product_id}`,
                        };
                    } else if (item.item_type === 'appointment_deposit') {
                        const appointment = appointments.find(a => a.id === item.appointment_id);
                        return {
                            ...item,
                            name: appointment ? appointment.treatmentName : `Cita #${item.appointment_id}`,
                        };
                    }
                    return item;
                }) || [];

                return {
                    ...order,
                    items: expandedItems,
                };
            });

    } catch (e) {
        console.error("Error cargando perfil del cliente", e);
    }

    if (!user) redirect("/cliente/login");

    return <ClientProfile user={user} appointments={appointments} orders={orders} />;
}
