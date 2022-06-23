import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTaskCapacity implements MigrationInterface {
  name = 'AddTaskCapacity1655991512732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "typeId" varchar NOT NULL, "projectId" varchar NOT NULL, "sprintId" varchar, "capacity" integer NOT NULL DEFAULT (5), CONSTRAINT "FK_5ad8a047b8f023bf36b2a232a42" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_37835cf91476a114202962303c1" FOREIGN KEY ("typeId") REFERENCES "task_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c" FOREIGN KEY ("statusId") REFERENCES "task_status" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_task"("id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId") SELECT "id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId" FROM "task"`
    );
    await queryRunner.query(`DROP TABLE "task"`);
    await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
    await queryRunner.query(
      `CREATE TABLE "task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "typeId" varchar NOT NULL, "projectId" varchar NOT NULL, "sprintId" varchar, CONSTRAINT "FK_5ad8a047b8f023bf36b2a232a42" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_37835cf91476a114202962303c1" FOREIGN KEY ("typeId") REFERENCES "task_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c" FOREIGN KEY ("statusId") REFERENCES "task_status" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "task"("id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId") SELECT "id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId" FROM "temporary_task"`
    );
    await queryRunner.query(`DROP TABLE "temporary_task"`);
  }
}
