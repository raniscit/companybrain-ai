ALTER TABLE "chunks" ADD COLUMN "chunk_index" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "chunks" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;