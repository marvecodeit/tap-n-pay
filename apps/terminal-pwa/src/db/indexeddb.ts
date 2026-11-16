import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Card, Transaction } from "@tapnpay/api-client";

export interface SyncStateRecord {
  key: string;
  value: any;
}

export interface TapNPayDB extends DBSchema {
  balances: {
    key: string; // card_id
    value: Card;
    indexes: { "by-student-id": string };
  };
  transactions: {
    key: string; // txn_id
    value: Transaction;
    indexes: {
      "by-status": string;
      "by-created-at": string;
      "by-card-id": string;
    };
  };
  sync_state: {
    key: string;
    value: SyncStateRecord;
  };
}

const DB_NAME = "tapnpay_pos_db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<TapNPayDB>> | null = null;

export async function getDb(): Promise<IDBPDatabase<TapNPayDB>> {
  if (!dbPromise) {
    dbPromise = openDB<TapNPayDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Balances store
        if (!db.objectStoreNames.contains("balances")) {
          const balanceStore = db.createObjectStore("balances", { keyPath: "card_id" });
          balanceStore.createIndex("by-student-id", "student_id");
        }

        // Transactions store
        if (!db.objectStoreNames.contains("transactions")) {
          const txnStore = db.createObjectStore("transactions", { keyPath: "txn_id" });
          txnStore.createIndex("by-status", "status");
          txnStore.createIndex("by-created-at", "created_at");
          txnStore.createIndex("by-card-id", "card_id");
        }

        // Sync state store
        if (!db.objectStoreNames.contains("sync_state")) {
          db.createObjectStore("sync_state", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}
