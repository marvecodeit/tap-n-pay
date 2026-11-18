ALTER TABLE "studentWallet"
  ALTER COLUMN "wallet_balance" TYPE numeric(7, 2);
--> statement-breakpoint
ALTER TABLE "studentWalletTransaction"
  ALTER COLUMN "wallet_balance" TYPE numeric(7, 2);
--> statement-breakpoint
ALTER TABLE "studentWalletTransaction"
  ALTER COLUMN "balance_after" TYPE numeric(7, 2);
--> statement-breakpoint
INSERT INTO "studentWallet" ("user_id")
SELECT s."id"
FROM "student" AS s
WHERE NOT EXISTS (
  SELECT 1
  FROM "studentWallet" AS w
  WHERE w."user_id" = s."id"
);
--> statement-breakpoint
ALTER TABLE "studentWallet"
  ADD CONSTRAINT "studentWallet_user_id_unique" UNIQUE ("user_id");