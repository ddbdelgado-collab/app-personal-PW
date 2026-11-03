import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Usuarios } from "../../usuarios/entities/usuario.entity";

@Entity()
export class Ordenes {
    @PrimaryGeneratedColumn()
    id_orden!: number

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total!: number

    @Column({
        type: 'varchar',
        length: 20,
        default: 'pendiente' // pendiente, pagada, enviada, cancelada
    })
    estado!: string

    @Column({ type: 'text' })
    direccion_envio_texto!: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_orden!: Date

    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuarios
}