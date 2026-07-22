import { cookies } from "next/headers";
import { xanoFetch } from "@/lib/xano";
import type { Appointment, Order, Treatment } from "@/types";
import ClientProfileClient from "./ClientProfileClient";

export default async function AdminClientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clientId = parseInt(id, 10);
  
  const cookieStore = await cookies();
  const token = cookieStore.get("bellevie_auth_token")?.value;

  const XANO_AUTH_URL = process.env.NEXT_PUBLIC_XANO_AUTH_URL;
  const XANO_BASE_URL = process.env.NEXT_PUBLIC_XANO_BASE_URL;

  // 1. Fetch user data (Since we only have GET /user, we fetch all and find the one we need. For scale, a GET /user/:id is better, but we work with what we have)
  let user: any = null;
  try {
    const usersRes = await fetch(`${XANO_AUTH_URL}/user`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (usersRes.ok) {
      const users = await usersRes.json();
      user = users.find((u: any) => u.id === clientId) || null;
    }
  } catch {}

  // 2. Fetch appointments for this user
  const appointments = await xanoFetch<Appointment[]>("/appointment", { token }).catch(() => [] as Appointment[]);
  const userAppointments = appointments.filter((a) => a.client_id === clientId);

  // 3. Fetch treatments for mapping names
  const treatments = await xanoFetch<Treatment[]>("/treatment").catch(() => [] as Treatment[]);

  // 4. Fetch orders for this user
  let userOrders: Order[] = [];
  try {
    const ordersRes = await fetch(`${XANO_BASE_URL}/order`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (ordersRes.ok) {
      const allOrders = await ordersRes.json();
      userOrders = allOrders.filter((o: any) => o.client_id === clientId);
    }
  } catch {}

  // 5. Fetch client_file
  let clientFile: any = null;
  try {
    const fileRes = await fetch(`${XANO_BASE_URL}/client_file`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (fileRes.ok) {
      const files = await fileRes.json();
      clientFile = files.find((f: any) => f.user_id === clientId) || null;
    }
  } catch {}

  // Map appointments to include treatment names
  const mappedAppointments = userAppointments.map((app) => {
    const treatment = treatments.find((t) => t.id === app.treatment_id);
    return {
      ...app,
      treatmentName: treatment?.name ?? `Tratamiento #${app.treatment_id}`,
    };
  });

  return (
    <ClientProfileClient 
      user={user} 
      appointments={mappedAppointments} 
      orders={userOrders} 
      initialClientFile={clientFile} 
    />
  );
}
