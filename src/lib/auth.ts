// Cliente de autenticación — usa el API Group "Authentication" de Xano,
// que tiene una Base URL distinta al grupo "content".

const XANO_AUTH_URL = process.env.NEXT_PUBLIC_XANO_AUTH_URL as string;

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "client";
}

interface AuthResponse {
    authToken: string;
}

// Guardamos el token en localStorage — es del lado cliente, no expone nada
// que no esté ya en el navegador del propio usuario autenticado.
const TOKEN_KEY = "bellevie_auth_token";

export function saveToken(token: string, role?: string) {
    localStorage.setItem(TOKEN_KEY, token);
    if (role) {
        localStorage.setItem("bellevie_user_role", role);
    }
    document.cookie = `bellevie_auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null; // por si se llama en server component
    return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("bellevie_user_role");
    document.cookie = "bellevie_auth_token=; path=/; max-age=0";
}

export async function signup(
    name: string,
    email: string,
    password: string,
    phone: string
): Promise<User> {
    const res = await fetch(`${XANO_AUTH_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
    });

    if (!res.ok) throw new Error(`Error al registrar: ${await res.text()}`);

    const data: AuthResponse = await res.json();
    saveToken(data.authToken);
    const user = await getMe();
    saveToken(data.authToken, user.role);
    return user;
}

export async function login(email: string, password: string): Promise<User> {
    const res = await fetch(`${XANO_AUTH_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Email o contraseña incorrectos");

    const data: AuthResponse = await res.json();
    saveToken(data.authToken);
    const user = await getMe();
    saveToken(data.authToken, user.role);
    return user;
}

export async function getMe(): Promise<User> {
    const token = getToken();
    if (!token) throw new Error("No hay sesión activa");

    const res = await fetch(`${XANO_AUTH_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        clearToken();
        throw new Error("Sesión inválida o expirada");
    }

    return res.json();
}

export function logout() {
    clearToken();
}