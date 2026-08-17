import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  vector,
} from "drizzle-orm/pg-core";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),

  filename: text("filename").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});


export const chunks = pgTable("chunks", {
  id: serial("id").primaryKey(),

  documentId: integer("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),

  content: text("content").notNull(),

  pageNumber: integer("page_number"),

  embedding: vector("embedding", {
    dimensions: 3072,
  }),
  chunkIndex: integer("chunk_index").notNull(),
  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});