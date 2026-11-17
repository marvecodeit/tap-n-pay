export interface Student {
  student_id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
  active_card_id?: string;
  balance?: number; // kobo
}

export interface StudentCreateRequest {
  name: string;
  student_id: string;
  email?: string;
  phone?: string;
  initial_balance_kobo?: number;
}

export interface Card {
  card_id: string; // 12-16 char alphanumeric
  student_id: string;
  student_name: string;
  balance: number; // kobo integer
  version: number;
  blocked: number; // 0 or 1
  issued_at: string;
}

export type TransactionStatus = "PENDING" | "APPROVED" | "VOID" | "SYNCED" | "FAILED";

export interface Transaction {
  txn_id: string;
  card_id: string;
  student_name?: string;
  amount: number; // kobo integer
  terminal_id: string;
  cashier_id: string;
  created_at: string;
  status: TransactionStatus;
  synced_at?: string | null;
  verification_code?: string;
}

export interface SyncUploadBatch {
  terminal_id: string;
  cashier_id: string;
  client_time: string;
  transactions: Transaction[];
  last_version?: number;
}

export interface SyncResponse {
  accepted_txn_ids: string[];
  rejected_txns: Array<{ txn_id: string; reason: string }>;
  balance_updates: Card[];
  server_time: string;
  server_version: number;
}

export interface TopUpRequest {
  card_id?: string;
  student_id?: string;
  amount_kobo: number;
  email: string;
}

export interface TopUpInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface RefundRequest {
  refund_id: string;
  txn_id: string;
  card_id: string;
  amount: number;
  reason: string;
  cashier_id?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
}

export interface ReconciliationReport {
  date: string;
  total_wallet_balance_kobo: number;
  total_paystack_balance_kobo: number;
  total_fees_kobo: number;
  total_payouts_kobo: number;
  difference_kobo: number;
  is_balanced: boolean;
  total_transactions_count: number;
  total_voids_count: number;
  total_refunds_count: number;
}
