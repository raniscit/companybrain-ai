CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
