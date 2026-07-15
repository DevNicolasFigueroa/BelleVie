// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

// Rutas que requieren estar autenticado
const PROTECTED_PREFIXES = ["/admin", "/cliente/agenda", "/cliente/carrito", "/cliente/chat"];

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_PREFIXES.some((prefix) =>
        pathname.startsWith(prefix)
    );

    if (!isProtected) return NextResponse.next();

    const token = request.cookies.get("bellevie_auth_token")?.value;

    if (!token) {
        const loginUrl = new URL("/cliente/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/cliente/agenda/:path*", "/cliente/carrito/:path*", "/cliente/chat/:path*"],
};