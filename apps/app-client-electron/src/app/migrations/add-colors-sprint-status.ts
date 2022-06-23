import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColosToSprintStatus implements MigrationInterface {
  name = 'AddColosToSprintStatus1655991726068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_sprint_status" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "backgroundColor" varchar(7) NOT NULL, "textColor" varchar(7) NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_sprint_status"("id", "label") SELECT "id", "label" FROM "sprint_status"`
    );
    await queryRunner.query(`DROP TABLE "sprint_status"`);
    await queryRunner.query(`ALTER TABLE "temporary_sprint_status" RENAME TO "sprint_status"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sprint_status" RENAME TO "temporary_sprint_status"`);
    await queryRunner.query(
      `CREATE TABLE "sprint_status" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "sprint_status"("id", "label") SELECT "id", "label" FROM "temporary_sprint_status"`
    );
    await queryRunner.query(`DROP TABLE "temporary_sprint_status"`);
  }
}
