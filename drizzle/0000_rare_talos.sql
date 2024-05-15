DO $$ BEGIN
 CREATE TYPE "public"."transaction_status" AS ENUM('PURCHASE', 'SALE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" varchar(31) PRIMARY KEY NOT NULL,
	"name" varchar(63) NOT NULL,
	"weight" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stock" (
	"id" varchar(31) PRIMARY KEY NOT NULL,
	"product_id" varchar(31) NOT NULL,
	"cost" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"transaction_id" varchar(31) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"id" varchar(31) PRIMARY KEY NOT NULL,
	"status" "transaction_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"total_price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_item" (
	"id" integer PRIMARY KEY NOT NULL,
	"transaction_id" varchar(31) NOT NULL,
	"product_id" varchar(31) NOT NULL,
	"stock_id" varchar(31) NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stock" ADD CONSTRAINT "stock_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_item" ADD CONSTRAINT "transaction_item_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_item" ADD CONSTRAINT "transaction_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_item" ADD CONSTRAINT "transaction_item_stock_id_stock_id_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stock"("id") ON DELETE no action ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_idx" ON "stock" ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "status_idx" ON "transaction" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_at_idx" ON "transaction" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transaction_idx" ON "transaction_item" ("transaction_id");