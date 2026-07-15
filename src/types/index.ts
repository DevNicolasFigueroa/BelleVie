// Tipos compartidos entre frontend y respuestas de Xano.
// Se irán completando a medida que definamos cada tabla en Xano.

export interface Tratamiento {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    duracion_min: number;
}

export interface TratamientoOpcion {
    id: number;
    tratamiento_id: number;
    nombre_zona: string;
    precio: number;
    duracion_min: number;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen_url: string;
}

export interface Cita {
    id: number;
    cliente_id: number;
    tratamiento_id: number;
    opcion_id: number | null;
    fecha: string;
    hora: string;
    estado: "pendiente" | "confirmada" | "cancelada" | "completada";
    precio_total: number;
    monto_abono: number;
    estado_abono: "pendiente" | "pagado";
}