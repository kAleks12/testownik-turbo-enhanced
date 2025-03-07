-- noinspection SqlCurrentSchemaInspectionForFile

-- noinspection SqlCurrentSchemaInspectionForFile

-- noinspection SqlCurrentSchemaInspectionForFile
DROP SCHEMA IF EXISTS "system" CASCADE;
CREATE SCHEMA IF NOT EXISTS "system";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "system"."test"
(
    "id"          uuid PRIMARY KEY   DEFAULT uuid_generate_v4(),
    "name"        varchar   NOT NULL,
    "school_year" varchar   NOT NULL,
    "created_by"  varchar,
    "changed_by"  varchar,
    "changed_at"  timestamp,
    "created_at"  timestamp NOT NULL DEFAULT 'NOW()',
    "course_id"   uuid,
    UNIQUE (name, course_id)
);

CREATE TABLE IF NOT EXISTS "system"."course"
(
    "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "teacher_id"  uuid       NOT NULL,
    "name"        varchar    NOT NULL,
    "usos_id"     varchar    NOT NULL,
    "course_type" varchar(1) NOT NULL,
    UNIQUE (usos_id, course_type, teacher_id)
);

CREATE TABLE IF NOT EXISTS "system"."teacher"
(
    "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name"        varchar NOT NULL,
    "second_name" varchar NOT NULL,
    "surname"     varchar NOT NULL,
    UNIQUE (name, second_name, surname)
);

CREATE TABLE IF NOT EXISTS "system"."question"
(
    "id"       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "body"     varchar NOT NULL,
    "img_file" varchar,
    "test_id"  uuid
);

CREATE TABLE IF NOT EXISTS "system"."answer"
(
    "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "question_id" uuid,
    "body"        varchar NOT NULL,
    "img_file"    varchar,
    "valid"       bool    NOT NULL
);

CREATE TABLE IF NOT EXISTS "system"."user"
(
    "id"          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "username" varchar NOT NULL UNIQUE,
    "password" varchar NOT NULL,
    "first_name"varchar NOT NULL,
    "last_name" varchar NOT NULL
    );

ALTER TABLE "system"."test"
    ADD FOREIGN KEY ("course_id") REFERENCES "system"."course" ("id");

ALTER TABLE "system"."course"
    ADD FOREIGN KEY ("teacher_id") REFERENCES "system"."teacher" ("id");

ALTER TABLE "system"."question"
    ADD FOREIGN KEY ("test_id") REFERENCES "system"."test" ("id") ON DELETE CASCADE;

ALTER TABLE "system"."answer"
    ADD FOREIGN KEY ("question_id") REFERENCES "system"."question" ("id") ON DELETE CASCADE;
