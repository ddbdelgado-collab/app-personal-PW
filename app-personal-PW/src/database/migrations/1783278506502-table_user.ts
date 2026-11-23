import { MigrationInterface, QueryRunner } from "typeorm";

export class TableUser1783278506502 implements MigrationInterface {
    name = 'TableUser1783278506502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "usuarios" ("id_usuario" SERIAL NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "nombre" character varying NOT NULL, "apellido" character varying NOT NULL, "telefono" character varying NOT NULL, "rol" character varying(20) NOT NULL DEFAULT 'cliente', "fecha_registro" TIMESTAMP NOT NULL DEFAULT now(), "activo" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_dfe59db369749f9042499fd8107" PRIMARY KEY ("id_usuario"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuarios"`);
    }

}
