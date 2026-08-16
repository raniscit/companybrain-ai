CREATE TABLE "chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"content" text NOT NULL,
	"page_number" integer,
	"embedding" vector(768)
);
--> statement-breakpoint
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;