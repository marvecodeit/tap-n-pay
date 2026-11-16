import { getDb } from "./indexeddb";
import type { Card } from "@tapnpay/api-client";

export class CardBlockedError extends Error {
  constructor(message = "Card is blocked. Direct student to cafeteria admin.") {
    super(message);
    this.name = "CardBlockedError";
  }
}

export class CardNotFoundError extends Error {
  constructor() {
    super("Card not recognized. Please scan again or enter ID manually.");
    this.name = "CardNotFoundError";
  }
}

export async function getCard(cardId: string): Promise<Card | undefined> {
  const db = await getDb();
  return db.get("balances", cardId.trim().toUpperCase());
}

export async function saveCard(card: Card): Promise<void> {
  const db = await getDb();
  await db.put("balances", {
    ...card,
    card_id: card.card_id.trim().toUpperCase(),
  });
}

export async function saveCardsBatch(cards: Card[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("balances", "readwrite");
  for (const card of cards) {
    await tx.store.put({
      ...card,
      card_id: card.card_id.trim().toUpperCase(),
    });
  }
  await tx.done;
}

export async function getAllCards(): Promise<Card[]> {
  const db = await getDb();
  return db.getAll("balances");
}

/**
 * Perform instant offline atomic balance deduction
 */
export async function debitCard(cardId: string, amountKobo: number): Promise<Card> {
  if (!Number.isSafeInteger(amountKobo) || amountKobo <= 0) {
    throw new Error("Purchase amount must be a positive amount in kobo.");
  }

  const db = await getDb();
  const formattedId = cardId.trim().toUpperCase();

  const tx = db.transaction("balances", "readwrite");
  const card = await tx.store.get(formattedId);

  if (!card) {
    await tx.done;
    throw new CardNotFoundError();
  }

  if (card.blocked === 1) {
    await tx.done;
    throw new CardBlockedError();
  }

  const updatedCard: Card = {
    ...card,
    balance: Math.max(card.balance - amountKobo, 0),
  };

  await tx.store.put(updatedCard);
  await tx.done;
  return updatedCard;
}

/**
 * Revert balance deduction immediately on cashier VOID
 */
export async function restoreCardBalance(cardId: string, amountKobo: number): Promise<Card> {
  const db = await getDb();
  const formattedId = cardId.trim().toUpperCase();

  const tx = db.transaction("balances", "readwrite");
  const card = await tx.store.get(formattedId);

  if (!card) {
    await tx.done;
    throw new CardNotFoundError();
  }

  const updatedCard: Card = {
    ...card,
    balance: card.balance + amountKobo,
  };

  await tx.store.put(updatedCard);
  await tx.done;
  return updatedCard;
}
