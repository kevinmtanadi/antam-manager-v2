CREATE TABLE IF NOT EXISTS "logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"detail" text,
	"identifier" varchar(31),
	"action" varchar(31),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "transaction_item" ALTER COLUMN "id" SET DATA TYPE serial;