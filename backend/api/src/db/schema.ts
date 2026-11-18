import { sql } from 'drizzle-orm';
import { pgTable, text, uuid, boolean, pgEnum, timestamp, bigint, numeric, check } from 'drizzle-orm/pg-core';

export const  userRoleEnum = pgEnum("user_role", ["student", "admin"]);

export const student = pgTable("student", {
    id:uuid("id").defaultRandom().primaryKey(),
    matric_id:text("matric_id").notNull().unique(),
    fullname:text("fullname").notNull(),
    profileImagePublicId:text("profile_image_public_id"),
    profileImageFormat:text("profile_image_format"),
    email:text("email").notNull().unique(),
    passwordHash:text("password_hash").notNull(),
    // walletBalanace:numeric("wallet_balance", {precision:6, scale:2}).default('0').notNull(), Wallet 
    department:text("department").notNull(),
    faculty:text("faculty").notNull(),
    phonenumber:text("phone-number").notNull(),
    level:text("level").notNull(),
    role:userRoleEnum("role").notNull().default("student"),

    isVerified:boolean("is_verified").notNull().default(false),
    verificationToken:text("verification_token"),
    verificationTokenExpiresAt:timestamp("verification_token_expires_at"),
    resetToken:text("reset_token"),
    resetTokenExpiresAt:timestamp("reset_token_expires_at"),
    refreshTokenHash:text("refresh_token_hash"),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull()
} )

export const admin = pgTable("admin", {
    id:uuid("id").defaultRandom().primaryKey(),
    email:text("email").notNull().unique(),
    passwordHash:text("password_hash").notNull(),
    
})

export const barCodes = pgTable("bar_code", {
    id:uuid('id').defaultRandom().primaryKey(),
    userId:uuid("user_id").notNull().references(() => student.id, {onDelete:"cascade"}),
    token:text("token").notNull().unique(),
    isActive:boolean("is_active").notNull().default(true),
    expiresAt:timestamp("expires_at"),
    lastScanned:timestamp("last_scanned"),
    createdAt:timestamp("created_at").defaultNow().notNull()
})

export  const walletEnum = pgEnum("wallets", ["studentWallet", "studentWalletTransaction", "adminWallet", "adminWalletHistory"]);

export const  studentWallet = pgTable("studentWallet", {
    id:uuid("id").defaultRandom().primaryKey(),
    userId:uuid("user_id").notNull().unique().references(() => student.id, {onDelete:"cascade"}),
    walletBalanace:numeric("wallet_balance", {precision:7, scale:2}).default('0').notNull(), 
    updatedAt:timestamp("updated_at").defaultNow().notNull(),
    role:userRoleEnum("role").notNull().default("student"),

}, (t) => [check("balance_not_negative", sql`${t.walletBalanace} >= 0`)])

export const  studentWalletTransaction = pgTable("studentWalletTransaction", {
    id:uuid("id").defaultRandom().primaryKey(),
    walletId:uuid("wallet_id").notNull().references(() => studentWallet.id),
    type:text("type", {enum: ["credit", "debit"]}).notNull(),
    balance:numeric("wallet_balance", {precision:7, scale:2}).default('0').notNull(), 
    balanceAfter:numeric("balance_after", {precision:7, scale:2}).notNull(),
    reference:text("reference").notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const  adminWallet = pgTable("adminWallet", {
    id:uuid("id").defaultRandom().primaryKey(),
    role:userRoleEnum("role").notNull().default("admin"),
    adminId:uuid("admin_id").notNull().references(() => admin.id, {onDelete:"cascade"}),
    walletBalanace:numeric("wallet_balance", {precision:6, scale:2}).default('0').notNull(), 
    updatedAt:timestamp("updated_at").defaultNow().notNull()
}, (t) => [check("balance_not_negative", sql`${t.walletBalanace} >= 0`)])

// export qrcode
// export const 

export const  adminWalletTransaction = pgTable("adminWalletHistory", {
    id:uuid("id").defaultRandom().primaryKey(),
    walletId:uuid("wallet_id").notNull().references(() => adminWallet.id),
    type:text("type", {enum: ["credit", "debit"]}).notNull(),
    balance:numeric("wallet_balance", {precision:9, scale:2}).default('0').notNull(), 
    balanceAfter:numeric("balance_after", {precision:6, scale:2}).notNull(),
     provider: text('provider'),                               // 'paystack',
     providerPaymentId: text('provider_payment_id').unique(),  // ID from the gateway
      status: text('status', { enum: ['pending', 'success', 'failed'] }).default('pending').notNull(),
    reference:text("reference").notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Student Acc
export type Student = typeof student.$inferSelect;
export type NewStudent = typeof student.$inferInsert;
export type StudentWallet = typeof studentWallet.$inferInsert;
export type StudentWalletTransaction = typeof studentWalletTransaction.$inferInsert;
// Admin Acc
export type Admin = typeof admin.$inferSelect;
export type NewAdmin = typeof admin.$inferInsert;
export type AdminWallet = typeof adminWallet.$inferInsert;
export type AdminWalletHistory = typeof adminWalletTransaction.$inferInsert;
