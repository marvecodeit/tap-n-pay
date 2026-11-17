import { getDb } from "./indexeddb";
import type { Card, Transaction } from "@tapnpay/api-client";
import { deriveVerificationCode } from "@tapnpay/ui";

export async function seedFailedDemoTransactions(
  cards: Card[],
  terminalId: string,
  cashierId: string,
): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("transactions", "readwrite");
  const demoTransactions = [
    { cardIndex: 0, amount: 25_000 },
    { cardIndex: 1, amount: 18_500 },
    { cardIndex: 2, amount: 32_000 },
  ];
  const demoIds = new Set(
    demoTransactions.map(
      (_, index) => `demo-failed-${String(index + 1).padStart(3, "0")}`,
    ),
  );
  const existingTransactions = await tx.store.getAll();

  for (const transaction of existingTransactions) {
    if (
      transaction.txn_id.startsWith("demo-failed-") &&
      !demoIds.has(transaction.txn_id)
    ) {
      await tx.store.delete(transaction.txn_id);
    }
  }

  for (const [index, demoTransaction] of demoTransactions.entries()) {
    const txn_id = `demo-failed-${String(index + 1).padStart(3, "0")}`;
    if (await tx.store.get(txn_id)) continue;

    await tx.store.put({
      txn_id,
      card_id: cards[demoTransaction.cardIndex].card_id.toUpperCase(),
      student_name: cards[demoTransaction.cardIndex].student_name,
      amount: demoTransaction.amount,
      terminal_id: terminalId,
      cashier_id: cashierId,
      created_at: new Date(Date.now() - (index + 1) * 5 * 60_000).toISOString(),
      status: "FAILED",
      synced_at: null,
      verification_code: deriveVerificationCode(txn_id),
    });
  }

  await tx.done;
}

export async function logTransaction(params: {
  card_id: string;
  student_name: string;
  amount: number;
  terminal_id: string;
  cashier_id: string;
}): Promise<Transaction> {
  const db = await getDb();
  const txn_id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const verification_code = deriveVerificationCode(txn_id);

  const txn: Transaction = {
    txn_id,
    card_id: params.card_id.toUpperCase(),
    student_name: params.student_name,
    amount: params.amount,
    terminal_id: params.terminal_id,
    cashier_id: params.cashier_id,
    created_at: new Date().toISOString(),
    status: "PENDING",
    synced_at: null,
    verification_code,
  };

  await db.put("transactions", txn);
  return txn;
}

export async function voidTransaction(
  txn_id: string,
): Promise<Transaction | undefined> {
  const db = await getDb();
  const tx = db.transaction("transactions", "readwrite");
  const txn = await tx.store.get(txn_id);

  if (!txn) {
    await tx.done;
    return undefined;
  }

  const updatedTxn: Transaction = {
    ...txn,
    status: "VOID",
  };

  await tx.store.put(updatedTxn);
  await tx.done;
  return updatedTxn;
}

export async function getPendingTransactions(): Promise<Transaction[]> {
  const db = await getDb();
  const allTxns = await db.getAll("transactions");
  return allTxns.filter((t) => t.status === "PENDING" || t.status === "VOID");
}

export async function markTransactionsSynced(txnIds: string[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("transactions", "readwrite");
  const synced_at = new Date().toISOString();

  for (const id of txnIds) {
    const txn = await tx.store.get(id);
    if (txn) {
      txn.synced_at = synced_at;
      if (txn.status === "PENDING") {
        txn.status = "SYNCED";
      }
      await tx.store.put(txn);
    }
  }
  await tx.done;
}

export async function getRecentTransactions(
  limit = 50,
): Promise<Transaction[]> {
  const db = await getDb();
  const all = await db.getAllFromIndex("transactions", "by-created-at");
  return all.reverse().slice(0, limit);
}

export async function getShiftVoidCount(cashierId: string): Promise<number> {
  const db = await getDb();
  const all = await db.getAll("transactions");
  const today = new Date().toISOString().slice(0, 10);
  return all.filter(
    (t) =>
      t.cashier_id === cashierId &&
      t.status === "VOID" &&
      t.created_at.startsWith(today),
  ).length;
}
