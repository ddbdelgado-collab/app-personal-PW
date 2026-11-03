import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Categorias } from "../../categorias/entities/categoria.entity";

@Entity()
export class Productos {
    @PrimaryGeneratedColumn()
    id_producto!: number

    @Column()
    nombre!: string

    @Column({ type: 'text' })
    descripcion!: string

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio!: number

    @Column({ type: 'int', default: 0 })
    stock!: number

    @Column({ nullable: true })
    imagen_url?: string

    @Column()
    id_categoria!: number;
    
    @ManyToOne(() => Categorias)
    @JoinColumn({ name: 'id_categoria' })
    categoria!: Categorias
}
