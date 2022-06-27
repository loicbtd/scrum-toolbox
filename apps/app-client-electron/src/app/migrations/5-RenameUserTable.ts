import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameUserTable5 implements MigrationInterface {
    name = 'RenameUserTable1656179276014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_member"("id", "role", "userId", "projectId") SELECT "id", "role", "userId", "projectId" FROM "project_member"`);
        await queryRunner.query(`DROP TABLE "project_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_member" RENAME TO "project_member"`);
        await queryRunner.query(`CREATE TABLE "temporary_sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL, CONSTRAINT "FK_274fa3a943d2032b29dbc37155f" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sprint_member"("id", "capacity", "userId", "sprintId") SELECT "id", "capacity", "userId", "sprintId" FROM "sprint_member"`);
        await queryRunner.query(`DROP TABLE "sprint_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint_member" RENAME TO "sprint_member"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_member"("id", "role", "userId", "projectId") SELECT "id", "role", "userId", "projectId" FROM "project_member"`);
        await queryRunner.query(`DROP TABLE "project_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_member" RENAME TO "project_member"`);
        await queryRunner.query(`CREATE TABLE "temporary_sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL, CONSTRAINT "FK_274fa3a943d2032b29dbc37155f" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_9b4bed15eb9b5644091e222e42f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sprint_member"("id", "capacity", "userId", "sprintId") SELECT "id", "capacity", "userId", "sprintId" FROM "sprint_member"`);
        await queryRunner.query(`DROP TABLE "sprint_member"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint_member" RENAME TO "sprint_member"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sprint_member" RENAME TO "temporary_sprint_member"`);
        await queryRunner.query(`CREATE TABLE "sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL, CONSTRAINT "FK_274fa3a943d2032b29dbc37155f" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "sprint_member"("id", "capacity", "userId", "sprintId") SELECT "id", "capacity", "userId", "sprintId" FROM "temporary_sprint_member"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint_member"`);
        await queryRunner.query(`ALTER TABLE "project_member" RENAME TO "temporary_project_member"`);
        await queryRunner.query(`CREATE TABLE "project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "project_member"("id", "role", "userId", "projectId") SELECT "id", "role", "userId", "projectId" FROM "temporary_project_member"`);
        await queryRunner.query(`DROP TABLE "temporary_project_member"`);
        await queryRunner.query(`ALTER TABLE "sprint_member" RENAME TO "temporary_sprint_member"`);
        await queryRunner.query(`CREATE TABLE "sprint_member" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL, CONSTRAINT "FK_274fa3a943d2032b29dbc37155f" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_9b4bed15eb9b5644091e222e42f" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "sprint_member"("id", "capacity", "userId", "sprintId") SELECT "id", "capacity", "userId", "sprintId" FROM "temporary_sprint_member"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint_member"`);
        await queryRunner.query(`ALTER TABLE "project_member" RENAME TO "temporary_project_member"`);
        await queryRunner.query(`CREATE TABLE "project_member" ("id" varchar PRIMARY KEY NOT NULL, "role" varchar CHECK( "role" IN ('ProductOwner','Developer','ScrumMaster') ) NOT NULL, "userId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_7115f82a61e31ac95b2681d83e4" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e7520163dafa7c1104fd672caad" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "project_member"("id", "role", "userId", "projectId") SELECT "id", "role", "userId", "projectId" FROM "temporary_project_member"`);
        await queryRunner.query(`DROP TABLE "temporary_project_member"`);
    }

}
