// import { MigrationInterface, QueryRunner } from 'typeorm';
//
// export class Migrations1733435258120 implements MigrationInterface {
//   name = 'Migrations1733435258120';
//
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `ALTER TABLE "Account" ADD "has_bonus" boolean NOT NULL DEFAULT false`,
//     );
//   }
//
//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`ALTER TABLE "Account" DROP COLUMN "has_bonus"`);
//   }
// }
