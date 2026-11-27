export interface Usuario {
    readonly id_usuario: number;
    readonly cedula: string;
    readonly email1?: string;
    readonly password_hash: string;
    readonly nombre: string;
    readonly apellido: string;
    readonly telefono: string;
    readonly rol?: string;
    readonly fecha_registro: Date;
    readonly activo: boolean;
}