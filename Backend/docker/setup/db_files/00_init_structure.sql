-- noinspection SqlCurrentSchemaInspectionForFile

-- noinspection SqlCurrentSchemaInspectionForFile

-- noinspection SqlCurrentSchemaInspectionForFile
CREATE SCHEMA IF NOT EXISTS "system";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE  IF NOT EXISTS "system"."test"
(
    "id"         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name"       varchar   NOT NULL,
    "created_by" varchar,
    "changed_by" varchar,
    "changed_at" timestamp,
    "created_at" timestamp NOT NULL DEFAULT 'NOW()',
    "course_id"  uuid
);

CREATE TABLE IF NOT EXISTS "system"."course"
(
    "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "teacher_id"     uuid    NOT NULL,
    "school_year" integer,
    "name"        varchar NOT NULL
);

CREATE TABLE  IF NOT EXISTS  "system"."teacher"
(
    "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name"        varchar NOT NULL,
    "second_name" varchar,
    "surname"     varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS "system"."question"
(
    "id"           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "body"         varchar NOT NULL,
    "img_file"     varchar,
    "test_id" uuid,
    UNIQUE ("body", "test_id")
);

CREATE TABLE IF NOT EXISTS "system"."answer"
(
    "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "question_id" uuid,
    "body"        varchar NOT NULL,
    "valid"       bool    NOT NULL,
    UNIQUE ("body", "question_id")
);

ALTER TABLE "system"."test"
    ADD FOREIGN KEY  ("course_id") REFERENCES "system"."course" ("id");

ALTER TABLE "system"."course"
    ADD FOREIGN KEY ("teacher_id") REFERENCES "system"."teacher" ("id");

ALTER TABLE "system"."question"
    ADD FOREIGN KEY ("test_id") REFERENCES "system"."test" ("id");

ALTER TABLE "system"."answer"
    ADD FOREIGN KEY ("question_id") REFERENCES "system"."question" ("id");
