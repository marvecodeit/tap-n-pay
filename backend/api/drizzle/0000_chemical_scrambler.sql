CREATE TYPE "public"."user_role" AS ENUM('student', 'admin');--> statement-breakpoint
CREATE TYPE "public"."wallets" AS ENUM('studentWallet', 'studentWalletTransaction', 'adminWallet', 'adminWalletHistory');--> statement-breakpoint
CREATE TABLE "admin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "adminWallet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "user_role" DEFAULT 'admin' NOT NULL,
	"admin_id" uuid NOT NULL,
	"wallet_balance" numeric(6, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "balance_not_negative" CHECK ("adminWallet"."wallet_balance" >= 0)
);
--> statement-breakpoint
CREATE TABLE "adminWalletHistory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"type" text NOT NULL,
	"wallet_balance" numeric(9, 2) DEFAULT '0' NOT NULL,
	"balance_after" numeric(6, 2) NOT NULL,
	"provider" text,
	"provider_payment_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"reference" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "adminWalletHistory_provider_payment_id_unique" UNIQUE("provider_payment_id"),
	CONSTRAINT "adminWalletHistory_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "qr_code" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"last_scanned" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "qr_code_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matric_id" text NOT NULL,
	"fullname" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_token" text,
	"verification_token_expires_at" timestamp,
	"reset_token" text,
	"reset_token_expires_at" timestamp,
	"refresh_token_hash" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "student_matric_id_unique" UNIQUE("matric_id"),
	CONSTRAINT "student_fullname_unique" UNIQUE("fullname"),
	CONSTRAINT "student_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "studentWallet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"wallet_balance" numeric(6, 2) DEFAULT '0' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	CONSTRAINT "balance_not_negative" CHECK ("studentWallet"."wallet_balance" >= 0)
);
--> statement-breakpoint
CREATE TABLE "studentWalletTransaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"type" text NOT NULL,
	"wallet_balance" numeric(6, 2) DEFAULT '0' NOT NULL,
	"balance_after" numeric(6, 2) NOT NULL,
	"reference" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "studentWalletTransaction_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "adminWallet" ADD CONSTRAINT "adminWallet_admin_id_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "adminWalletHistory" ADD CONSTRAINT "adminWalletHistory_wallet_id_adminWallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."adminWallet"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qr_code" ADD CONSTRAINT "qr_code_user_id_student_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentWallet" ADD CONSTRAINT "studentWallet_user_id_student_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "studentWalletTransaction" ADD CONSTRAINT "studentWalletTransaction_wallet_id_studentWallet_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."studentWallet"("id") ON DELETE no action ON UPDATE no action;