import { getDb } from "./indexeddb";

export interface TerminalConfig {
  terminal_id: string;
  cashier_id: string;
  cashier_name: string;
  cafeteria_name: string;
  api_base_url: string;
  terminal_api_key: string;
}

export const DEFAULT_CONFIG: TerminalConfig = {
  terminal_id: "POS-001",
  cashier_id: "c-001",
  cashier_name: "Cashier A",
  cafeteria_name: "Central Cafeteria",
  api_base_url: "http://localhost:3000",
  terminal_api_key: "",
};

export const OFFLINE_LIMITS = {
  MAX_STUDENT_OFFLINE_KOBO: 500_000, // ₦5,000
  MAX_TERMINAL_OFFLINE_COUNT: 200,
  MAX_TERMINAL_OFFLINE_VALUE_KOBO: 10_000_000, // ₦100,000
  MAX_OFFLINE_DURATION_MS: 4 * 60 * 60 * 1000, // 4 hours
};

export async function getSyncState<T>(key: string, defaultValue: T): Promise<T> {
  const db = await getDb();
  const record = await db.get("sync_state", key);
  return record ? (record.value as T) : defaultValue;
}

export async function setSyncState<T>(key: string, value: T): Promise<void> {
  const db = await getDb();
  await db.put("sync_state", { key, value });
}

export async function getTerminalConfig(): Promise<TerminalConfig> {
  const config = await getSyncState<Partial<TerminalConfig>>(
    "terminal_config",
    DEFAULT_CONFIG,
  );
  return { ...DEFAULT_CONFIG, ...config };
}

export async function setTerminalConfig(config: TerminalConfig): Promise<void> {
  await setSyncState("terminal_config", config);
}

export async function getLastSyncTime(): Promise<Date | null> {
  const iso = await getSyncState<string | null>("last_sync_at", null);
  return iso ? new Date(iso) : null;
}

export async function setLastSyncTime(date: Date): Promise<void> {
  await setSyncState("last_sync_at", date.toISOString());
}

export async function checkOfflineSafetyLock(): Promise<{ isLocked: boolean; reason?: string }> {
  const lastSync = await getLastSyncTime();
  if (!lastSync) {
    // If never synced, terminal must do initial sync
    return { isLocked: true, reason: "Terminal must perform initial sync with server before accepting payments." };
  }

  const msSinceLastSync = Date.now() - lastSync.getTime();
  if (msSinceLastSync > OFFLINE_LIMITS.MAX_OFFLINE_DURATION_MS) {
    const hours = Math.floor(msSinceLastSync / (1000 * 60 * 60));
    return {
      isLocked: true,
      reason: `Terminal offline for ${hours} hours (limit is 4 hours). Sync with server to unlock.`,
    };
  }

  return { isLocked: false };
}
