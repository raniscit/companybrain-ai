CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"department" varchar(100),
	"designation" varchar(100),
	"access_group" varchar(50) NOT NULL,
	CONSTRAINT "employees_employee_id_unique" UNIQUE("employee_id"),
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "department" varchar(100);--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "access_group" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "uploaded_by" uuid;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_employees_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;