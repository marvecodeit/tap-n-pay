import type { Card, Transaction } from "@tapnpay/api-client";
import { deriveVerificationCode } from "@tapnpay/ui";
import { getTerminalConfig } from "../db/syncState";
import { getCard, saveCard } from "../db/balances";
import { saveTransaction } from "../db/transactions";

interface TerminalStudentProfile {
  student_id: string;
  name: string;
  department: string;
  faculty: string;
  level: string;
  balance_kobo: number;
  profile_image_url: string | null;
  is_profile_complete: boolean;
}

interface WalletDebitResponse {
  balanceKobo: number;
  transaction: {
    amountKobo: number;
    balanceAfterKobo: number;
    reference: string;
    createdAt: string;
  };
}

export interface ScannedStudentCard {
  card: Card;
}

export async function getScannedStudentCard(
  cardId: string,
): Promise<ScannedStudentCard | undefined> {
  const config = await getTerminalConfig();
  const apiKey = config.terminal_api_key.trim();

  const baseUrl = config.api_base_url.replace(/\/$/, "");
  const studentId = cardId.trim().toUpperCase();
  const url = `${baseUrl}/api/terminal/student-profile?student_id=${encodeURIComponent(studentId)}`;
  const headers: Record<string, string> = {};
  if (apiKey) headers["x-terminal-api-key"] = apiKey;
  let response: Response;
  try {
    response = await fetch(url, {
      headers,
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Could not reach the backend to verify this student's profile.",
    );
  }

  if (response.status === 401) {
    throw new Error(
      "Terminal authorization failed. Check the API key in Settings.",
    );
  }
  if (response.status === 404) {
    const body = (await response.json()) as { message?: unknown };
    throw new Error(
      typeof body.message === "string"
        ? body.message
        : "No registered student profile matches this card.",
    );
  }
  if (!response.ok) {
    throw new Error(
      `Student profile lookup failed (${response.status}). Try again.`,
    );
  }

  const profile = (await response.json()) as TerminalStudentProfile;
  const normalizeMatricId = (value: string) =>
    value.trim().replace(/\//g, "").toUpperCase();
  if (
    normalizeMatricId(profile.student_id) !== normalizeMatricId(studentId) ||
    typeof profile.is_profile_complete !== "boolean" ||
    (profile.is_profile_complete && !profile.profile_image_url) ||
    !Number.isSafeInteger(profile.balance_kobo) ||
    profile.balance_kobo < 0
  ) {
    throw new Error("The backend returned an incomplete student profile.");
  }

  const card = await getCard(profile.student_id);
  const updatedCard: Card = {
    ...card,
    card_id: profile.student_id,
    student_id: profile.student_id,
    student_name: profile.name.trim() || "Student",
    balance: profile.balance_kobo,
    version: card?.version ?? 1,
    blocked: 0,
    issued_at: card?.issued_at ?? new Date().toISOString(),
    department: profile.department || undefined,
    faculty: profile.faculty || undefined,
    level: profile.level || undefined,
    profile_image_url: profile.profile_image_url,
    is_profile_complete: profile.is_profile_complete,
  };
  await saveCard(updatedCard);

  return { card: updatedCard };
}

export async function debitScannedStudentWallet(
  card: Card,
  amountKobo: number,
  reference: string,
): Promise<{ card: Card; transaction: Transaction }> {
  const config = await getTerminalConfig();
  const apiKey = config.terminal_api_key.trim();

  const baseUrl = config.api_base_url.replace(/\/$/, "");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) headers["x-terminal-api-key"] = apiKey;
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api/terminal/wallet-debit`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        student_id: card.student_id,
        amount_kobo: amountKobo,
        reference,
        terminal_id: config.terminal_id,
        cashier_id: config.cashier_id,
      }),
    });
  } catch {
    throw new Error("Could not reach the wallet service. No payment was made.");
  }

  const result = (await response.json()) as
    | WalletDebitResponse
    | { message?: string | string[] };
  if (!response.ok) {
    const message = "message" in result ? result.message : undefined;
    throw new Error(
      Array.isArray(message)
        ? message.join(" ")
        : message || `Wallet payment failed (${response.status}).`,
    );
  }
  if (
    !("transaction" in result) ||
    !Number.isSafeInteger(result.balanceKobo) ||
    !Number.isSafeInteger(result.transaction.amountKobo) ||
    result.transaction.amountKobo !== amountKobo ||
    !Number.isSafeInteger(result.transaction.balanceAfterKobo)
  ) {
    throw new Error("The wallet service returned an invalid payment result.");
  }

  const updatedCard: Card = { ...card, balance: result.balanceKobo };
  const transaction: Transaction = {
    txn_id: result.transaction.reference,
    card_id: card.card_id,
    student_name: card.student_name,
    amount: result.transaction.amountKobo,
    terminal_id: config.terminal_id,
    cashier_id: config.cashier_id,
    created_at: result.transaction.createdAt,
    status: "APPROVED",
    synced_at: result.transaction.createdAt,
    verification_code: deriveVerificationCode(result.transaction.reference),
  };

  await saveCard(updatedCard);
  await saveTransaction(transaction);
  return { card: updatedCard, transaction };
}
