import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateEntities6 implements MigrationInterface {
    name = 'UpdateEntities1656329938514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "projectId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_sprint"("id", "label", "start_date", "end_date", "createdAt", "updatedAt", "statusId", "projectId") SELECT "id", "label", "start_date", "end_date", "createdAt", "updatedAt", "statusId", "projectId" FROM "sprint"`);
        await queryRunner.query(`DROP TABLE "sprint"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint" RENAME TO "sprint"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "typeId" varchar NOT NULL, "projectId" varchar NOT NULL, "sprintId" varchar, "capacity" integer NOT NULL DEFAULT (5))`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId", "capacity") SELECT "id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId", "capacity" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE TABLE "temporary_sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_sprint_member"("id", "capacity", "userId", "sprintId") SELECT "id", "capacity", "userId", "sprintId" FROM "sprint_member"`);
        await queryRunner.query(`DROP TABLE "sprint_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint_member" RENAME TO "sprint_member"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_member"("id", "role", "userId", "projectId") SELECT "id", "role", "userId", "projectId" FROM "project_member"`);
        await queryRunner.query(`DROP TABLE "project_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_member" RENAME TO "project_member"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "project_id" varchar NOT NULL, CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_member"("id", "role", "userId", "project_id") SELECT "id", "role", "userId", "projectId" FROM "project_member"`);
        await queryRunner.query(`DROP TABLE "project_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_member" RENAME TO "project_member"`);
        await queryRunner.query(`CREATE TABLE "temporary_sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_sprint"("id", "label", "start_date", "end_date", "createdAt", "updatedAt") SELECT "id", "label", "start_date", "end_date", "createdAt", "updatedAt" FROM "sprint"`);
        await queryRunner.query(`DROP TABLE "sprint"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint" RENAME TO "sprint"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "capacity" integer NOT NULL DEFAULT (5))`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "label", "description", "createdAt", "updatedAt", "capacity") SELECT "id", "label", "description", "createdAt", "updatedAt", "capacity" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE TABLE "temporary_sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_sprint_member"("id", "capacity") SELECT "id", "capacity" FROM "sprint_member"`);
        await queryRunner.query(`DROP TABLE "sprint_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint_member" RENAME TO "sprint_member"`);
        await queryRunner.query(`CREATE TABLE "temporary_sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "status_id" varchar NOT NULL, "project_id" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_sprint"("id", "label", "start_date", "end_date", "createdAt", "updatedAt") SELECT "id", "label", "start_date", "end_date", "createdAt", "updatedAt" FROM "sprint"`);
        await queryRunner.query(`DROP TABLE "sprint"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint" RENAME TO "sprint"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "capacity" integer NOT NULL DEFAULT (5), "status_id" varchar, "type_id" varchar NOT NULL, "project_id" varchar NOT NULL, "sprint_id" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "label", "description", "createdAt", "updatedAt", "capacity") SELECT "id", "label", "description", "createdAt", "updatedAt", "capacity" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE TABLE "temporary_sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "user_id" varchar NOT NULL, "sprint_id" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_sprint_member"("id", "capacity") SELECT "id", "capacity" FROM "sprint_member"`);
        await queryRunner.query(`DROP TABLE "sprint_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint_member" RENAME TO "sprint_member"`);
        await queryRunner.query(`CREATE TABLE "temporary_sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "status_id" varchar NOT NULL, "project_id" varchar NOT NULL, CONSTRAINT "FK_424723b856615d12cff927feb48" FOREIGN KEY ("status_id") REFERENCES "sprint_status" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ce4f0a9ae20ecf7b679990b7606" FOREIGN KEY ("project_id") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sprint"("id", "label", "start_date", "end_date", "createdAt", "updatedAt", "status_id", "project_id") SELECT "id", "label", "start_date", "end_date", "createdAt", "updatedAt", "status_id", "project_id" FROM "sprint"`);
        await queryRunner.query(`DROP TABLE "sprint"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint" RENAME TO "sprint"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "capacity" integer NOT NULL DEFAULT (5), "status_id" varchar, "type_id" varchar NOT NULL, "project_id" varchar NOT NULL, "sprint_id" varchar, CONSTRAINT "FK_b8747cc6a41b6cef4639babf61d" FOREIGN KEY ("status_id") REFERENCES "task_status" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_a0669bd34078f33604ec209dab1" FOREIGN KEY ("type_id") REFERENCES "task_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1f53e7ffe94530f9e0221224d29" FOREIGN KEY ("project_id") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_422c15d3980fd646448d61f61d8" FOREIGN KEY ("sprint_id") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "label", "description", "createdAt", "updatedAt", "capacity", "status_id", "type_id", "project_id", "sprint_id") SELECT "id", "label", "description", "createdAt", "updatedAt", "capacity", "status_id", "type_id", "project_id", "sprint_id" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE TABLE "temporary_sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "user_id" varchar NOT NULL, "sprint_id" varchar NOT NULL, CONSTRAINT "FK_c754a5be1ba6f204df13eeb687b" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0160a683dcd70a9e952e1bad88f" FOREIGN KEY ("sprint_id") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sprint_member"("id", "capacity", "user_id", "sprint_id") SELECT "id", "capacity", "user_id", "sprint_id" FROM "sprint_member"`);
        await queryRunner.query(`DROP TABLE "sprint_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint_member" RENAME TO "sprint_member"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "project_id" varchar NOT NULL, CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_aaef76230abfcdf30adb15d0be8" FOREIGN KEY ("project_id") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_member"("id", "role", "userId", "project_id") SELECT "id", "role", "userId", "project_id" FROM "project_member"`);
        await queryRunner.query(`DROP TABLE "project_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_member" RENAME TO "project_member"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_member" RENAME TO "temporary_project_member"`);
        await queryRunner.query(`CREATE TABLE "project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "project_id" varchar NOT NULL, CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "project_member"("id", "role", "userId", "project_id") SELECT "id", "role", "userId", "project_id" FROM "temporary_project_member"`);
        await queryRunner.query(`DROP TABLE "temporary_project_member"`);
        await queryRunner.query(`ALTER TABLE "sprint_member" RENAME TO "temporary_sprint_member"`);
        await queryRunner.query(`CREATE TABLE "sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "user_id" varchar NOT NULL, "sprint_id" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "sprint_member"("id", "capacity", "user_id", "sprint_id") SELECT "id", "capacity", "user_id", "sprint_id" FROM "temporary_sprint_member"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint_member"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "capacity" integer NOT NULL DEFAULT (5), "status_id" varchar, "type_id" varchar NOT NULL, "project_id" varchar NOT NULL, "sprint_id" varchar)`);
        await queryRunner.query(`INSERT INTO "task"("id", "label", "description", "createdAt", "updatedAt", "capacity", "status_id", "type_id", "project_id", "sprint_id") SELECT "id", "label", "description", "createdAt", "updatedAt", "capacity", "status_id", "type_id", "project_id", "sprint_id" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "sprint" RENAME TO "temporary_sprint"`);
        await queryRunner.query(`CREATE TABLE "sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "status_id" varchar NOT NULL, "project_id" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "sprint"("id", "label", "start_date", "end_date", "createdAt", "updatedAt", "status_id", "project_id") SELECT "id", "label", "start_date", "end_date", "createdAt", "updatedAt", "status_id", "project_id" FROM "temporary_sprint"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint"`);
        await queryRunner.query(`ALTER TABLE "sprint_member" RENAME TO "temporary_sprint_member"`);
        await queryRunner.query(`CREATE TABLE "sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "sprint_member"("id", "capacity") SELECT "id", "capacity" FROM "temporary_sprint_member"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint_member"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "capacity" integer NOT NULL DEFAULT (5))`);
        await queryRunner.query(`INSERT INTO "task"("id", "label", "description", "createdAt", "updatedAt", "capacity") SELECT "id", "label", "description", "createdAt", "updatedAt", "capacity" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "sprint" RENAME TO "temporary_sprint"`);
        await queryRunner.query(`CREATE TABLE "sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "sprint"("id", "label", "start_date", "end_date", "createdAt", "updatedAt") SELECT "id", "label", "start_date", "end_date", "createdAt", "updatedAt" FROM "temporary_sprint"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint"`);
        await queryRunner.query(`ALTER TABLE "sprint_member" RENAME TO "temporary_sprint_member"`);
        await queryRunner.query(`CREATE TABLE "sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "sprint_member"("id", "capacity") SELECT "id", "capacity" FROM "temporary_sprint_member"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint_member"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "typeId" varchar NOT NULL, "projectId" varchar NOT NULL, "sprintId" varchar, "capacity" integer NOT NULL DEFAULT (5))`);
        await queryRunner.query(`INSERT INTO "task"("id", "label", "description", "createdAt", "updatedAt", "capacity") SELECT "id", "label", "description", "createdAt", "updatedAt", "capacity" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "sprint" RENAME TO "temporary_sprint"`);
        await queryRunner.query(`CREATE TABLE "sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "projectId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "sprint"("id", "label", "start_date", "end_date", "createdAt", "updatedAt") SELECT "id", "label", "start_date", "end_date", "createdAt", "updatedAt" FROM "temporary_sprint"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint"`);
        await queryRunner.query(`ALTER TABLE "project_member" RENAME TO "temporary_project_member"`);
        await queryRunner.query(`CREATE TABLE "project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "project_member"("id", "role", "userId", "projectId") SELECT "id", "role", "userId", "project_id" FROM "temporary_project_member"`);
        await queryRunner.query(`DROP TABLE "temporary_project_member"`);
        await queryRunner.query(`ALTER TABLE "project_member" RENAME TO "temporary_project_member"`);
        await queryRunner.query(`CREATE TABLE "project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "project_member"("id", "role", "userId", "projectId") SELECT "id", "role", "userId", "projectId" FROM "temporary_project_member"`);
        await queryRunner.query(`DROP TABLE "temporary_project_member"`);
        await queryRunner.query(`ALTER TABLE "sprint_member" RENAME TO "temporary_sprint_member"`);
        await queryRunner.query(`CREATE TABLE "sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL, CONSTRAINT "FK_9b4bed15eb9b5644091e222e42f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_274fa3a943d2032b29dbc37155f" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "sprint_member"("id", "capacity", "userId", "sprintId") SELECT "id", "capacity", "userId", "sprintId" FROM "temporary_sprint_member"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint_member"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "typeId" varchar NOT NULL, "projectId" varchar NOT NULL, "sprintId" varchar, "capacity" integer NOT NULL DEFAULT (5), CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c" FOREIGN KEY ("statusId") REFERENCES "task_status" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_37835cf91476a114202962303c1" FOREIGN KEY ("typeId") REFERENCES "task_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5ad8a047b8f023bf36b2a232a42" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "task"("id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId", "capacity") SELECT "id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId", "capacity" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "sprint" RENAME TO "temporary_sprint"`);
        await queryRunner.query(`CREATE TABLE "sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_0b512ef3fa72b5afa40db28e4b7" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6fa728969a4af8bb5682a4477a5" FOREIGN KEY ("statusId") REFERENCES "sprint_status" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "sprint"("id", "label", "start_date", "end_date", "createdAt", "updatedAt", "statusId", "projectId") SELECT "id", "label", "start_date", "end_date", "createdAt", "updatedAt", "statusId", "projectId" FROM "temporary_sprint"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint"`);
    }

}