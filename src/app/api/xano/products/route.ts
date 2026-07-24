import { NextRequest, NextResponse } from "next/server";

const XANO_BASE_URL = process.env.NEXT_PUBLIC_XANO_BASE_URL;

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { error: "Sin autorización" },
        { status: 401 }
      );
    }

    const response = await fetch(`${XANO_BASE_URL}/product`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Error fetching products from Xano");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Error obteniendo productos" },
      { status: 500 }
    );
  }
}
