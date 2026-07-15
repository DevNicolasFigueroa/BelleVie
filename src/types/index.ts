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