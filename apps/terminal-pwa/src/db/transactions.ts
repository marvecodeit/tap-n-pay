import { getDb } from "./indexeddb";
import type { Transaction } from "@tapnpay/api-client";

export async function removeDemoTransactions(): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("transactions", "readwrite");
  const existingTransactions = await tx.store.getAll();

  for (const transaction of existingTransactions) {
    if (transaction.txn_id.startsWith("demo-failed-")) {
      await tx.store.delete(transaction.txn_id);
    }
  }

  await tx.done;
}

export async function saveTransaction(transaction: Transaction): Promise<void> {
  const db = await getDb();
  await db.put("transactions", transaction);
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
