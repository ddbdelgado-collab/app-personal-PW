import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categorias {
    @PrimaryGeneratedColumn()
    id_categoria!: number

    @Column()
    nombre!: string

    @Column({ type: 'text', nullable: true })
    descripcion?: string
}
