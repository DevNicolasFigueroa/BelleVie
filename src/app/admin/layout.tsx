import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("bellevie_auth_token")?.value;

  if (!token) {
    redirect("/cliente/login");
  }

  const XANO_AUTH_URL = process.env.NEXT_PUBLIC_XANO_AUTH_URL as string;

  try {
    const res = await fetch(`${XANO_AUTH_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      redirect("/cliente/login");
    }

    const user = await res.json();

    if (user.role !== "admin") {
      redirect("/cliente/perfil"); // Redirige a clientes a su propio perfil
    }
  } catch (error) {
    redirect("/cliente/login");
  }

  return <>{children}</>;
}
