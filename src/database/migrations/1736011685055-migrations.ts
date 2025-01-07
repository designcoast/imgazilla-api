import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migrations1736011685055 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Account',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            generationStrategy: 'uuid',
            isPrimary: true,
          },
          { name: 'name', type: 'varchar', isNullable: true },
          { name: 'photoUrl', type: 'varchar', isNullable: true },
          { name: 'figmaUserID', type: 'varchar', isNullable: false },
          { name: 'credits', type: 'int', default: '300', isNullable: false },
          { name: 'has_bonus', type: 'boolean', default: false },
          { name: 'createAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          { name: 'updateAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Account');
  }
}
