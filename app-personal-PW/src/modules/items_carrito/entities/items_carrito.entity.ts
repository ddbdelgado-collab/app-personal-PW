import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Usuarios } from "../../usuarios/entities/usuario.entity";
import { Productos } from "../../productos/entities/producto.entity";

@Entity()
export class ItemsCarrito {
    @PrimaryGeneratedColumn()
    id_item_carrito!: number

    @Column({ type: 'int', default: 1 })
    cantidad!: number

    @Column()
    id_usuario!: number;

    @Column()
    id_producto!: number;

    @ManyToOne(() => Usuarios)
    @JoinColumn({ name: 'id_usuario' })
    usuario!: Usuarios

    @ManyToOne(() => Productos)
    @JoinColumn({ name: 'id_producto' })
    producto!: Productos
}
