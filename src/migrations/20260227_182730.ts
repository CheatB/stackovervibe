import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_frameworks_stack" AS ENUM('claude', 'cursor', 'copilot', 'windsurf', 'other');
  CREATE TYPE "public"."enum_frameworks_level" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_frameworks_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_comments_content_type" ADD VALUE 'framework';
  ALTER TYPE "public"."enum_reactions_content_type" ADD VALUE 'framework';
  CREATE TABLE "frameworks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar NOT NULL,
  	"body" jsonb NOT NULL,
  	"author_id" integer NOT NULL,
  	"stack" "enum_frameworks_stack",
  	"level" "enum_frameworks_level",
  	"github_url" varchar,
  	"status" "enum_frameworks_status" DEFAULT 'draft',
  	"views" numeric DEFAULT 0,
  	"likes" numeric DEFAULT 0,
  	"dislikes" numeric DEFAULT 0,
  	"downloads" numeric DEFAULT 0,
  	"edited_at" timestamp(3) with time zone,
  	"published_at" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "frameworks_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "frameworks_id" integer;
  ALTER TABLE "frameworks" ADD CONSTRAINT "frameworks_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "frameworks_rels" ADD CONSTRAINT "frameworks_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."frameworks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "frameworks_rels" ADD CONSTRAINT "frameworks_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "frameworks_slug_idx" ON "frameworks" USING btree ("slug");
  CREATE INDEX "frameworks_author_idx" ON "frameworks" USING btree ("author_id");
  CREATE INDEX "frameworks_updated_at_idx" ON "frameworks" USING btree ("updated_at");
  CREATE INDEX "frameworks_created_at_idx" ON "frameworks" USING btree ("created_at");
  CREATE INDEX "frameworks_rels_order_idx" ON "frameworks_rels" USING btree ("order");
  CREATE INDEX "frameworks_rels_parent_idx" ON "frameworks_rels" USING btree ("parent_id");
  CREATE INDEX "frameworks_rels_path_idx" ON "frameworks_rels" USING btree ("path");
  CREATE INDEX "frameworks_rels_tags_id_idx" ON "frameworks_rels" USING btree ("tags_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_frameworks_fk" FOREIGN KEY ("frameworks_id") REFERENCES "public"."frameworks"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_frameworks_id_idx" ON "payload_locked_documents_rels" USING btree ("frameworks_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "frameworks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "frameworks_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "frameworks" CASCADE;
  DROP TABLE "frameworks_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_frameworks_fk";
  
  ALTER TABLE "comments" ALTER COLUMN "content_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_comments_content_type";
  CREATE TYPE "public"."enum_comments_content_type" AS ENUM('guide', 'tool', 'post', 'question');
  ALTER TABLE "comments" ALTER COLUMN "content_type" SET DATA TYPE "public"."enum_comments_content_type" USING "content_type"::"public"."enum_comments_content_type";
  ALTER TABLE "reactions" ALTER COLUMN "content_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_reactions_content_type";
  CREATE TYPE "public"."enum_reactions_content_type" AS ENUM('guide', 'tool', 'post', 'question', 'answer');
  ALTER TABLE "reactions" ALTER COLUMN "content_type" SET DATA TYPE "public"."enum_reactions_content_type" USING "content_type"::"public"."enum_reactions_content_type";
  DROP INDEX "payload_locked_documents_rels_frameworks_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "frameworks_id";
  DROP TYPE "public"."enum_frameworks_stack";
  DROP TYPE "public"."enum_frameworks_level";
  DROP TYPE "public"."enum_frameworks_status";`)
}
