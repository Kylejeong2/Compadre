CREATE TABLE IF NOT EXISTS "compadres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"imageUrl" text,
	"user_id" text NOT NULL
);
