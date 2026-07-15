"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const user = await login(email, password);
            // Redirección según rol: admin va a su panel, cliente al home
            router.push(user.role === "admin" ? "/admin" : "/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>Iniciar sesión</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
            </form>
        </main>
    );
}