import {MigrationInterface, QueryRunner} from "typeorm";

export class InitializeDatabase1 implements MigrationInterface {
    name = 'UpdateDatabase1655826219431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "sprint_status" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "task_status" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "backgroundColor" varchar(7) NOT NULL, "textColor" varchar(7) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "task_type" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "backgroundColor" varchar(7) NOT NULL, "textColor" varchar(7) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "isActivated" boolean NOT NULL DEFAULT (1), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "typeId" varchar NOT NULL, "projectId" varchar NOT NULL, "sprintId" varchar)`);
        await queryRunner.query(`CREATE TABLE "sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "projectId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user_sprint" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user_user_type_project" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "userTypeId" varchar NOT NULL, "projectId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user_type" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "task_users_user" ("taskId" varchar NOT NULL, "userId" varchar NOT NULL, PRIMARY KEY ("taskId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb749a4b0103a3bc2235beafc9" ON "task_users_user" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a70c8dbe2f96b5ed1bc4df33a4" ON "task_users_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "typeId" varchar NOT NULL, "projectId" varchar NOT NULL, "sprintId" varchar, CONSTRAINT "FK_02068239bb8d5b2fc7f3ded618c" FOREIGN KEY ("statusId") REFERENCES "task_status" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_37835cf91476a114202962303c1" FOREIGN KEY ("typeId") REFERENCES "task_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5ad8a047b8f023bf36b2a232a42" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId") SELECT "id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE TABLE "temporary_sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_6fa728969a4af8bb5682a4477a5" FOREIGN KEY ("statusId") REFERENCES "sprint_status" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0b512ef3fa72b5afa40db28e4b7" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sprint"("id", "label", "start_date", "end_date", "createdAt", "updatedAt", "statusId", "projectId") SELECT "id", "label", "start_date", "end_date", "createdAt", "updatedAt", "statusId", "projectId" FROM "sprint"`);
        await queryRunner.query(`DROP TABLE "sprint"`);
        await queryRunner.query(`ALTER TABLE "temporary_sprint" RENAME TO "sprint"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_sprint" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL, CONSTRAINT "FK_5b7d16ab719766575f9ccb518c1" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_9471aa63d82a4aa852cfd9382b4" FOREIGN KEY ("sprintId") REFERENCES "sprint" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_sprint"("id", "capacity", "userId", "sprintId") SELECT "id", "capacity", "userId", "sprintId" FROM "user_sprint"`);
        await queryRunner.query(`DROP TABLE "user_sprint"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_sprint" RENAME TO "user_sprint"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_user_type_project" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "userTypeId" varchar NOT NULL, "projectId" varchar NOT NULL, CONSTRAINT "FK_d5b8a736d562a32ea3d889cdb21" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_03fac88244ff3bc4da523a998b6" FOREIGN KEY ("userTypeId") REFERENCES "user_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d153aae4d0022eae2ba0031288d" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_user_type_project"("id", "userId", "userTypeId", "projectId") SELECT "id", "userId", "userTypeId", "projectId" FROM "user_user_type_project"`);
        await queryRunner.query(`DROP TABLE "user_user_type_project"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_user_type_project" RENAME TO "user_user_type_project"`);
        await queryRunner.query(`DROP INDEX "IDX_cb749a4b0103a3bc2235beafc9"`);
        await queryRunner.query(`DROP INDEX "IDX_a70c8dbe2f96b5ed1bc4df33a4"`);
        await queryRunner.query(`CREATE TABLE "temporary_task_users_user" ("taskId" varchar NOT NULL, "userId" varchar NOT NULL, CONSTRAINT "FK_cb749a4b0103a3bc2235beafc94" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_a70c8dbe2f96b5ed1bc4df33a4f" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("taskId", "userId"))`);
        await queryRunner.query(`INSERT INTO "temporary_task_users_user"("taskId", "userId") SELECT "taskId", "userId" FROM "task_users_user"`);
        await queryRunner.query(`DROP TABLE "task_users_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_task_users_user" RENAME TO "task_users_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_cb749a4b0103a3bc2235beafc9" ON "task_users_user" ("taskId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a70c8dbe2f96b5ed1bc4df33a4" ON "task_users_user" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_a70c8dbe2f96b5ed1bc4df33a4"`);
        await queryRunner.query(`DROP INDEX "IDX_cb749a4b0103a3bc2235beafc9"`);
        await queryRunner.query(`ALTER TABLE "task_users_user" RENAME TO "temporary_task_users_user"`);
        await queryRunner.query(`CREATE TABLE "task_users_user" ("taskId" varchar NOT NULL, "userId" varchar NOT NULL, PRIMARY KEY ("taskId", "userId"))`);
        await queryRunner.query(`INSERT INTO "task_users_user"("taskId", "userId") SELECT "taskId", "userId" FROM "temporary_task_users_user"`);
        await queryRunner.query(`DROP TABLE "temporary_task_users_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_a70c8dbe2f96b5ed1bc4df33a4" ON "task_users_user" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cb749a4b0103a3bc2235beafc9" ON "task_users_user" ("taskId") `);
        await queryRunner.query(`ALTER TABLE "user_user_type_project" RENAME TO "temporary_user_user_type_project"`);
        await queryRunner.query(`CREATE TABLE "user_user_type_project" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "userTypeId" varchar NOT NULL, "projectId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "user_user_type_project"("id", "userId", "userTypeId", "projectId") SELECT "id", "userId", "userTypeId", "projectId" FROM "temporary_user_user_type_project"`);
        await queryRunner.query(`DROP TABLE "temporary_user_user_type_project"`);
        await queryRunner.query(`ALTER TABLE "user_sprint" RENAME TO "temporary_user_sprint"`);
        await queryRunner.query(`CREATE TABLE "user_sprint" ("id" varchar PRIMARY KEY NOT NULL, "capacity" integer NOT NULL, "userId" varchar NOT NULL, "sprintId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "user_sprint"("id", "capacity", "userId", "sprintId") SELECT "id", "capacity", "userId", "sprintId" FROM "temporary_user_sprint"`);
        await queryRunner.query(`DROP TABLE "temporary_user_sprint"`);
        await queryRunner.query(`ALTER TABLE "sprint" RENAME TO "temporary_sprint"`);
        await queryRunner.query(`CREATE TABLE "sprint" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "projectId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "sprint"("id", "label", "start_date", "end_date", "createdAt", "updatedAt", "statusId", "projectId") SELECT "id", "label", "start_date", "end_date", "createdAt", "updatedAt", "statusId", "projectId" FROM "temporary_sprint"`);
        await queryRunner.query(`DROP TABLE "temporary_sprint"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "statusId" varchar NOT NULL, "typeId" varchar NOT NULL, "projectId" varchar NOT NULL, "sprintId" varchar)`);
        await queryRunner.query(`INSERT INTO "task"("id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId") SELECT "id", "label", "description", "createdAt", "updatedAt", "statusId", "typeId", "projectId", "sprintId" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`DROP INDEX "IDX_a70c8dbe2f96b5ed1bc4df33a4"`);
        await queryRunner.query(`DROP INDEX "IDX_cb749a4b0103a3bc2235beafc9"`);
        await queryRunner.query(`DROP TABLE "task_users_user"`);
        await queryRunner.query(`DROP TABLE "user_type"`);
        await queryRunner.query(`DROP TABLE "user_user_type_project"`);
        await queryRunner.query(`DROP TABLE "user_sprint"`);
        await queryRunner.query(`DROP TABLE "sprint"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "task_type"`);
        await queryRunner.query(`DROP TABLE "task_status"`);
        await queryRunner.query(`DROP TABLE "sprint_status"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}