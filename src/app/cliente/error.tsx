// src/app/cliente/error.tsx
"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <main>
            <h2>Algo salió mal</h2>
            <p>{error.message}</p>
            <button onClick={reset}>Reintentar</button>
        </main>
    );
}