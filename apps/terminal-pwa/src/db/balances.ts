import { getDb } from "./indexeddb";
import type { Card } from "@tapnpay/api-client";

export class CardNotFoundError extends Error {
  constructor() {
    super("No registered student matches this matric ID. Please scan again.");
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
