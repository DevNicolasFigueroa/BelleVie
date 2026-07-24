import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
      redirect("/cliente/perfil");
    }
  } catch (error) {
    redirect("/cliente/login");
  }

  return (
    <div className="flex min-h-screen bg-[#fcf9f8]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
