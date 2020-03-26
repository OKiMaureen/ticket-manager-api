import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1585235679278 implements MigrationInterface {
    name = 'Initial1585235679278'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying(20) NOT NULL, "lastName" character varying(20) NOT NULL, "userName" character varying(20) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_da5934070b5f2726ebfd3122c80" UNIQUE ("userName"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "story" ("id" SERIAL NOT NULL, "summary" character varying NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL, "complexity" integer NOT NULL, "estimatedFinishTimeInMins" integer NOT NULL, "cost" integer NOT NULL, "ticketStatus" "story_ticketstatus_enum" NOT NULL DEFAULT 'pending', "assigneeId" integer, "userId" integer, CONSTRAINT "PK_28fce6873d61e2cace70a0f3361" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "story" ADD CONSTRAINT "FK_3bea49e71a91ace466090ade5a6" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "story" ADD CONSTRAINT "FK_2f8345c3a6d1057ccf612e65a09" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "story" DROP CONSTRAINT "FK_2f8345c3a6d1057ccf612e65a09"`, undefined);
        await queryRunner.query(`ALTER TABLE "story" DROP CONSTRAINT "FK_3bea49e71a91ace466090ade5a6"`, undefined);
        await queryRunner.query(`DROP TABLE "story"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
