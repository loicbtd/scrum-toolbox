import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpgradeToNewSchema4 implements MigrationInterface {
  name = 'UpgradeToNewSchema1656171347784';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "isActivated" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"))`
    );
    await queryRunner.query(
      `CREATE TABLE "project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "projectId" varchar NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL)`
    );
    await queryRunner.query(
      `CREATE TABLE "task_users_user_entity" ("taskId" varchar NOT NULL, "userEntityId" varchar NOT NULL, PRIMARY KEY ("taskId", "userEntityId"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_0501ed83ef863f19764f946f09" ON "task_users_user_entity" ("taskId") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_6393a6d1fa5fd2db6b8c9f1138" ON "task_users_user_entity" ("userEntityId") `
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_project_member"("id", "role", "userId", "projectId") SELECT "id", "role", "userId", "projectId" FROM "project_member"`
    );
    await queryRunner.query(`DROP TABLE "project_member"`);
    await queryRunner.query(`ALTER TABLE "temporary_project_member" RENAME TO "project_member"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL, CONSTRAINT "FK_9b4bed15eb9b5644091e222e42f" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_274fa3a943d2032b29dbc37155f" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_sprint_member"("id", "capacity", "userId", "sprintId") SELECT "id", "capacity", "userId", "sprintId" FROM "sprint_member"`
    );
    await queryRunner.query(`DROP TABLE "sprint_member"`);
    await queryRunner.query(`ALTER TABLE "temporary_sprint_member" RENAME TO "sprint_member"`);
    await queryRunner.query(`DROP INDEX "IDX_0501ed83ef863f19764f946f09"`);
    await queryRunner.query(`DROP INDEX "IDX_6393a6d1fa5fd2db6b8c9f1138"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_task_users_user_entity" ("taskId" varchar NOT NULL, "userEntityId" varchar NOT NULL, CONSTRAINT "FK_0501ed83ef863f19764f946f09a" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_6393a6d1fa5fd2db6b8c9f1138e" FOREIGN KEY ("userEntityId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("taskId", "userEntityId"))`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_task_users_user_entity"("taskId", "userEntityId") SELECT "taskId", "userEntityId" FROM "task_users_user_entity"`
    );
    await queryRunner.query(`DROP TABLE "task_users_user_entity"`);
    await queryRunner.query(`ALTER TABLE "temporary_task_users_user_entity" RENAME TO "task_users_user_entity"`);
    await queryRunner.query(`CREATE INDEX "IDX_0501ed83ef863f19764f946f09" ON "task_users_user_entity" ("taskId") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_6393a6d1fa5fd2db6b8c9f1138" ON "task_users_user_entity" ("userEntityId") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_6393a6d1fa5fd2db6b8c9f1138"`);
    await queryRunner.query(`DROP INDEX "IDX_0501ed83ef863f19764f946f09"`);
    await queryRunner.query(`ALTER TABLE "task_users_user_entity" RENAME TO "temporary_task_users_user_entity"`);
    await queryRunner.query(
      `CREATE TABLE "task_users_user_entity" ("taskId" varchar NOT NULL, "userEntityId" varchar NOT NULL, PRIMARY KEY ("taskId", "userEntityId"))`
    );
    await queryRunner.query(
      `INSERT INTO "task_users_user_entity"("taskId", "userEntityId") SELECT "taskId", "userEntityId" FROM "temporary_task_users_user_entity"`
    );
    await queryRunner.query(`DROP TABLE "temporary_task_users_user_entity"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_6393a6d1fa5fd2db6b8c9f1138" ON "task_users_user_entity" ("userEntityId") `
    );
    await queryRunner.query(`CREATE INDEX "IDX_0501ed83ef863f19764f946f09" ON "task_users_user_entity" ("taskId") `);
    await queryRunner.query(`ALTER TABLE "sprint_member" RENAME TO "temporary_sprint_member"`);
    await queryRunner.query(
      `CREATE TABLE "sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "sprint_member"("id", "capacity", "userId", "sprintId") SELECT "id", "capacity", "userId", "sprintId" FROM "temporary_sprint_member"`
    );
    await queryRunner.query(`DROP TABLE "temporary_sprint_member"`);
    await queryRunner.query(`ALTER TABLE "project_member" RENAME TO "temporary_project_member"`);
    await queryRunner.query(
      `CREATE TABLE "project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "projectId" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "project_member"("id", "role", "userId", "projectId") SELECT "id", "role", "userId", "projectId" FROM "temporary_project_member"`
    );
    await queryRunner.query(`DROP TABLE "temporary_project_member"`);
    await queryRunner.query(`DROP INDEX "IDX_6393a6d1fa5fd2db6b8c9f1138"`);
    await queryRunner.query(`DROP INDEX "IDX_0501ed83ef863f19764f946f09"`);
    await queryRunner.query(`DROP TABLE "task_users_user_entity"`);
    await queryRunner.query(`DROP TABLE "sprint_member"`);
    await queryRunner.query(`DROP TABLE "project_member"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
