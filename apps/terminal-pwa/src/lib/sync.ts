import { getPendingTransactions, markTransactionsSynced } from "../db/transactions";
import { saveCardsBatch } from "../db/balances";
import { getTerminalConfig, setLastSyncTime } from "../db/syncState";
import type { SyncUploadBatch, SyncResponse } from "@tapnpay/api-client";

export interface SyncResult {
  success: boolean;
  syncedTxnCount: number;
  balanceUpdatesCount: number;
  error?: string;
  serverTime?: string;
}

export async function performSync(): Promise<SyncResult> {
  const config = await getTerminalConfig();
  const pendingTxns = await getPendingTransactions();

  const payload: SyncUploadBatch = {
    terminal_id: config.terminal_id,
    cashier_id: config.cashier_id,
    client_time: new Date().toISOString(),
    transactions: pendingTxns,
  };

  try {
    const res = await fetch(`${config.api_base_url}/api/v1/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      return {
        success: false,
        syncedTxnCount: 0,
        balanceUpdatesCount: 0,
        error: `Sync error (${res.status}): ${err}`,
      };
    }

    const data: SyncResponse = await res.json();

    // Mark accepted txns as synced
    if (data.accepted_txn_ids && data.accepted_txn_ids.length > 0) {
      await markTransactionsSynced(data.accepted_txn_ids);
    }

    // Update balances store
    if (data.balance_updates && data.balance_updates.length > 0) {
      await saveCardsBatch(data.balance_updates);
    }

    await setLastSyncTime(new Date());

    return {
      success: true,
      syncedTxnCount: data.accepted_txn_ids.length,
      balanceUpdatesCount: data.balance_updates.length,
      serverTime: data.server_time,
    };
  } catch (err: any) {
    return {
      success: false,
      syncedTxnCount: 0,
      balanceUpdatesCount: 0,
      error: err.message || "Failed to reach server (Terminal offline)",
    };
  }
}
