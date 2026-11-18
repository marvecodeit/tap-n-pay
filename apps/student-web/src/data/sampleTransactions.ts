import type { LucideIcon } from "lucide-react";
import { ArrowLeftRight, WalletCards } from "lucide-react";
import type { StudentWalletTransaction } from "@tapnpay/api-client";

export type TransactionStatus = "successful" | "pending";
export type TransactionDirection = "in" | "out";

export type SampleTransaction = {
  id: string;
  merchant: string;
  category: string;
  date: string;
  time: string;
  amountKobo: number;
  direction: TransactionDirection;
  status: TransactionStatus;
  icon: LucideIcon;
};

export const sampleTransactions: SampleTransaction[] = [];

export function mapWalletTransactions(
  transactions: StudentWalletTransaction[],
): SampleTransaction[] {
  return transactions.map((transaction) => {
    const date = new Date(transaction.createdAt);
    const isCredit = transaction.type === "credit";

    return {
      id: transaction.reference,
      merchant:
        transaction.description ||
        (isCredit ? "Wallet credit" : "Wallet debit"),
      category: isCredit ? "Money in" : "Money out",
      date: date.toISOString().slice(0, 10),
      time: date.toLocaleTimeString("en", {
        hour: "numeric",
        minute: "2-digit",
      }),
      amountKobo: transaction.amountKobo,
      direction: isCredit ? "in" : "out",
      status: "successful",
      icon: isCredit ? WalletCards : ArrowLeftRight,
    };
  });
}

/*
export const demoTransactions: SampleTransaction[] = [
  {
    id: "AUL-TXN-8405",
    merchant: "Cafeteria (Main Hall)",
    category: "Food & Beverages",
    date: "2025-10-21",
    time: "11:28 AM",
    amountKobo: 120_000,
    direction: "out",
    status: "successful",
    icon: Utensils,
  },
  {
    id: "AUL-TXN-8392",
    merchant: "Bookshop",
    category: "Stationery",
    date: "2025-10-20",
    time: "02:15 PM",
    amountKobo: 85_000,
    direction: "out",
    status: "successful",
    icon: BookOpen,
  },
  {
    id: "AUL-TXN-8371",
    merchant: "Laundry Service",
    category: "Campus Services",
    date: "2025-10-17",
    time: "10:05 AM",
    amountKobo: 60_000,
    direction: "out",
    status: "pending",
    icon: Shirt,
  },
  {
    id: "AUL-TXN-8340",
    merchant: "Cafeteria (Main Hall)",
    category: "Food & Beverages",
    date: "2025-10-15",
    time: "12:40 PM",
    amountKobo: 150_000,
    direction: "out",
    status: "successful",
    icon: Store,
  },
  {
    id: "AUL-WAL-TXN-8408",
    merchant: "Wallet top-up",
    category: "Money in",
    date: "2025-10-22",
    time: "09:15 AM",
    amountKobo: 5_000_000,
    direction: "in",
    status: "successful",
    icon: WalletCards,
  },
];
*/

export function formatTransactionDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}
