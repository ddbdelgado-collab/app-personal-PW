import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Usuarios } from "../../usuarios/entities/usuario.entity";

@Entity()
export class Direcciones {
    @PrimaryGeneratedColumn()
    id_direccion!: number

    @Column()
    calle_principal!: string

    @Column()
    calle_secundaria!: string

    @Column()
    ciudad!: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    referencia?: string

    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuarios
}