DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');
    END IF;
END$$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"summary" text,
	"content" text NOT NULL,
	"author_id" serial NOT NULL,
	"featured_image_url" text,
	"category" varchar(100) NOT NULL,
	"tags" text,
	"read_time" serial NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "documents" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"tax_form_id" varchar(128),
	"name" varchar(255) NOT NULL,
	"type" varchar(100),
	"size" serial NOT NULL,
	"document_type" varchar(100),
	"url" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "otp_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(20) NOT NULL,
	"otp" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tax_forms" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"status" varchar(50) DEFAULT 'in_progress' NOT NULL,
	"form_type" varchar(20),
	"assessment_year" varchar(10),
	"personal_info" text,
	"income_data" text,
	"deductions_80c" text,
	"deductions_80d" text,
	"other_deductions" text,
	"tax_paid" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100),
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(20),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"google_id" text,
	"mfa_enabled" boolean DEFAULT false NOT NULL,
	"profile_image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'blog_posts_author_id_users_id_fk' AND conrelid = 'blog_posts'::regclass
    ) THEN
        ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    END IF;
END$$;--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'documents_tax_form_id_tax_forms_id_fk' AND conrelid = 'documents'::regclass
    ) THEN
        ALTER TABLE "documents" ADD CONSTRAINT "documents_tax_form_id_tax_forms_id_fk" FOREIGN KEY ("tax_form_id") REFERENCES "public"."tax_forms"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END$$;--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'tax_forms_user_id_users_id_fk' AND conrelid = 'tax_forms'::regclass
    ) THEN
        ALTER TABLE "tax_forms" ADD CONSTRAINT "tax_forms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
END$$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "google_id_idx" ON "users" USING btree ("google_id");
