import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Usuarios{
    @PrimaryGeneratedColumn()
    id_usuario!: number

    @Column()
    email!: string

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
}
