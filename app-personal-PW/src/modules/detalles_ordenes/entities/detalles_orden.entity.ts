import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Ordenes } from "../../ordenes/entities/orden.entity";
import { Productos } from "../../productos/entities/producto.entity";

@Entity()
export class DetallesOrden {
    @PrimaryGeneratedColumn()
    id_detalle!: number

    @Column({ type: 'int' })
    cantidad!: number

    // El precio fijo al que se compró el producto en esta orden
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio_unitario!: number

    @ManyToOne(() => Ordenes)
    @JoinColumn({ name: 'id_orden' })
    orden!: Ordenes

    @ManyToOne(() => Productos)
    @JoinColumn({ name: 'id_producto' })
    producto!: Productos
}
