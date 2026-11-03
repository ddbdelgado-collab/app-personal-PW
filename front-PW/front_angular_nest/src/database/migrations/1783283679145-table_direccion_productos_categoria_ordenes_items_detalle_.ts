import { MigrationInterface, QueryRunner } from "typeorm";

export class TableDireccionProductosCategoriaOrdenesItemsDetalle_1783283679145 implements MigrationInterface {
    name = 'TableDireccionProductosCategoriaOrdenesItemsDetalle_1783283679145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categorias" ("id_categoria" SERIAL NOT NULL, "nombre" character varying NOT NULL, "descripcion" text, CONSTRAINT "PK_04bae980e284752e914bce1cbc7" PRIMARY KEY ("id_categoria"))`);
        await queryRunner.query(`CREATE TABLE "ordenes" ("id_orden" SERIAL NOT NULL, "total" numeric(10,2) NOT NULL, "estado" character varying(20) NOT NULL DEFAULT 'pendiente', "direccion_envio_texto" text NOT NULL, "fecha_orden" TIMESTAMP NOT NULL DEFAULT now(), "id_usuario" integer, CONSTRAINT "PK_62a027cf70aa8d9091cd330231e" PRIMARY KEY ("id_orden"))`);
        await queryRunner.query(`CREATE TABLE "productos" ("id_producto" SERIAL NOT NULL, "nombre" character varying NOT NULL, "descripcion" text NOT NULL, "precio" numeric(10,2) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "imagen_url" character varying, "id_categoria" integer, CONSTRAINT "PK_8c832a65b374c16cbd8135d6be5" PRIMARY KEY ("id_producto"))`);
        await queryRunner.query(`CREATE TABLE "detalles_orden" ("id_detalle" SERIAL NOT NULL, "cantidad" integer NOT NULL, "precio_unitario" numeric(10,2) NOT NULL, "id_orden" integer, "id_producto" integer, CONSTRAINT "PK_14c181297638561cef96a5c0437" PRIMARY KEY ("id_detalle"))`);
        await queryRunner.query(`CREATE TABLE "items_carrito" ("id_item_carrito" SERIAL NOT NULL, "cantidad" integer NOT NULL DEFAULT '1', "id_usuario" integer, "id_producto" integer, CONSTRAINT "PK_8ccccc933859e49ed9a1b9899d0" PRIMARY KEY ("id_item_carrito"))`);
        await queryRunner.query(`CREATE TABLE "direcciones" ("id_direccion" SERIAL NOT NULL, "calle_principal" character varying NOT NULL, "calle_secundaria" character varying NOT NULL, "ciudad" character varying NOT NULL, "referencia" character varying(255), "id_usuario" integer, CONSTRAINT "PK_8a94b15a42b38ad7944344e0629" PRIMARY KEY ("id_direccion"))`);
        await queryRunner.query(`ALTER TABLE "ordenes" ADD CONSTRAINT "FK_a0a6b02c855f42aeb0e86d75c07" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos" ADD CONSTRAINT "FK_67e14062fdfd39fba436bccaff3" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id_categoria") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalles_orden" ADD CONSTRAINT "FK_751008261fff5f28e1486cc6742" FOREIGN KEY ("id_orden") REFERENCES "ordenes"("id_orden") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalles_orden" ADD CONSTRAINT "FK_b04d12e154c08342426af5cd0c0" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items_carrito" ADD CONSTRAINT "FK_cc05dbc37e6e94ea168e8f154ee" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items_carrito" ADD CONSTRAINT "FK_608eae3333a5ca9d08ea174dccd" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "direcciones" ADD CONSTRAINT "FK_53fa0c11459c4a9b0fd920b811d" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "direcciones" DROP CONSTRAINT "FK_53fa0c11459c4a9b0fd920b811d"`);
        await queryRunner.query(`ALTER TABLE "items_carrito" DROP CONSTRAINT "FK_608eae3333a5ca9d08ea174dccd"`);
        await queryRunner.query(`ALTER TABLE "items_carrito" DROP CONSTRAINT "FK_cc05dbc37e6e94ea168e8f154ee"`);
        await queryRunner.query(`ALTER TABLE "detalles_orden" DROP CONSTRAINT "FK_b04d12e154c08342426af5cd0c0"`);
        await queryRunner.query(`ALTER TABLE "detalles_orden" DROP CONSTRAINT "FK_751008261fff5f28e1486cc6742"`);
        await queryRunner.query(`ALTER TABLE "productos" DROP CONSTRAINT "FK_67e14062fdfd39fba436bccaff3"`);
        await queryRunner.query(`ALTER TABLE "ordenes" DROP CONSTRAINT "FK_a0a6b02c855f42aeb0e86d75c07"`);
        await queryRunner.query(`DROP TABLE "direcciones"`);
        await queryRunner.query(`DROP TABLE "items_carrito"`);
        await queryRunner.query(`DROP TABLE "detalles_orden"`);
        await queryRunner.query(`DROP TABLE "productos"`);
        await queryRunner.query(`DROP TABLE "ordenes"`);
        await queryRunner.query(`DROP TABLE "categorias"`);
    }

}
