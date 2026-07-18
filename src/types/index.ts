// Tipos compartidos entre frontend y respuestas de Xano.
// Se irán completando a medida que definamos cada tabla en Xano.

export interface Treatment {
    id: number;
    created_at: number;
    name: string;
    description: string;
    base_price: number;
    duration_min: number;
}

export interface TreatmentOption {
    id: number;
    created_at: number;
    treatment_id: number;
    zone_name: string;
    price: number;
    duration_min: number;
}

export interface Product {
    id: number;
    created_at: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
}

export interface Appointment {
    id: number;
    created_at: number;
    client_id: number;
    treatment_id: number;
    option_id?: number | null;
    date: string; // YYYY-MM-DD
    time: string; // enum 9-17, e.g. "09:00"
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    total_price: number;
    deposit_amount: number;
    deposit_status: 'pending' | 'paid';
}