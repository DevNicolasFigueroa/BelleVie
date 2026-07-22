import { xanoFetch } from "@/lib/xano";
import type { Appointment, Treatment } from "@/types";
import AdminCitasClient from "./AdminCitasClient";

import { cookies } from "next/headers";

export default async function AdminCitasPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bellevie_auth_token")?.value;

  const [appointments, treatments] = await Promise.all([
    xanoFetch<Appointment[]>("/appointment", { token }).catch(() => [] as Appointment[]),
    xanoFetch<Treatment[]>("/treatment").catch(() => [] as Treatment[]),
  ]);

  const XANO_AUTH_URL = process.env.NEXT_PUBLIC_XANO_AUTH_URL as string;
  let users: any[] = [];
  try {
    const usersRes = await fetch(`${XANO_AUTH_URL}/user`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (usersRes.ok) users = await usersRes.json();
  } catch {}

  const mappedAppointments = appointments.map((app: any) => {
    const treatment = treatments.find((t) => t.id === app.treatment_id);
    const user = users.find((u: any) => u.id === app.client_id);
    const clientName =
      app._user?.name || app._client?.name || user?.name || `Cliente #${app.client_id}`;

    return {
      id: app.id,
      clientName,
      treatmentName: treatment?.name ?? `Tratamiento #${app.treatment_id}`,
      date: app.date ?? "",
      time: app.time ?? "—",
      status: app.status ?? "pending",
      depositStatus: app.deposit_status ?? "pending",
      totalPrice: app.total_price ?? treatment?.base_price ?? 0,
      depositAmount: app.deposit_amount ?? 0,
    };
  });

  return <AdminCitasClient initialAppointments={mappedAppointments} />;
}
