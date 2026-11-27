import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuarios{
    @PrimaryGeneratedColumn()
    id_usuario!: number

    // El valor de Cédula se almacena en la columna 'email' de la base de datos
    @Column({ name: 'email', type: 'varchar' })
    cedula!: string

    // El valor de Correo Electrónico real se almacena en la columna 'email1' de la base de datos
    @Column({ name: 'email1', type: 'varchar', nullable: true })
    email1!: string

    @Column()
    password_hash!: string

    @Column()
    nombre!: string

    @Column()
    apellido!: string

    @Column()
    telefono!: string

    @Column({
        type: 'varchar',
        length: 20,
        default: 'cliente'
    })
    rol?: string

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    fecha_registro!: Date

    @Column({ 
        default: true 
    })
    activo!: boolean

    @Column({ type: 'int', default: 0 })
    intentos_fallidos!: number;

    @Column({ type: 'timestamp', nullable: true })
    bloqueado_hasta!: Date | null;
}
