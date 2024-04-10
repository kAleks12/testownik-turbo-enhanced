-- noinspection SqlCurrentSchemaInspectionForFile

-- noinspection SqlCurrentSchemaInspectionForFile

-- noinspection SqlCurrentSchemaInspectionForFile

CREATE SCHEMA IF NOT EXISTS "system";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "system"."testownik"
(
    "id"         uuid PRIMARY KEY,
    "name"       varchar   NOT NULL,
    "created_by" uuid,
    "changed_by" uuid,
    "changed_at" timestamp,
    "created_at" timestamp NOT NULL DEFAULT 'NOW()',
    "course_id"  uuid
);

CREATE TABLE "system"."course"
(
    "id"          uuid PRIMARY KEY,
    "teacher"     uuid    NOT NULL,
    "school_year" integer,
    "name"        varchar NOT NULL
);

CREATE TABLE "system"."teacher"
(
    "id"          uuid PRIMARY KEY,
    "name"        varchar NOT NULL,
    "second_name" varchar,
    "surname"     varchar NOT NULL
);

CREATE TABLE "system"."question"
(
    "id"           uuid PRIMARY KEY,
    "body"         varchar NOT NULL,
    "img_file"     varchar,
    "testownik_id" uuid
);

CREATE TABLE "system"."answer"
(
    "id"          uuid PRIMARY KEY,
    "question_id" uuid,
    "body"        varchar NOT NULL,
    "valid"       bool    NOT NULL
);

ALTER TABLE "system"."testownik"
    ADD FOREIGN KEY ("course_id") REFERENCES "system"."course" ("id");

ALTER TABLE "system"."course"
    ADD FOREIGN KEY ("teacher") REFERENCES "system"."teacher" ("id");

ALTER TABLE "system"."question"
    ADD FOREIGN KEY ("testownik_id") REFERENCES "system"."testownik" ("id");

ALTER TABLE "system"."answer"
    ADD FOREIGN KEY ("question_id") REFERENCES "system"."question" ("id");
