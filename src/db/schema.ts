import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  vector,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";


export const employees = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey(),

  employeeId: varchar("employee_id", {
    length: 50,
  }).unique().notNull(),

  email: varchar("email", {
    length: 255,
  }).unique().notNull(),

  name: varchar("name", {
    length: 255,
  }),

  department: varchar("department", {
    length: 100,
  }),

  designation: varchar("designation", {
    length: 100,
  }),

  accessGroup: varchar("access_group", {
    length: 50,
  }).notNull(),
});


export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),

  filename: text("filename").notNull(),

  department: varchar("department", { length: 100 }),

  accessGroup: varchar("access_group", { length: 50 })
    .notNull(),

  uploadedBy: uuid("uploaded_by")
    .references(() => employees.id, {
      onDelete: "set null",
    }),

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