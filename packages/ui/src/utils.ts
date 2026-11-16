import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format kobo integer to Nigerian Naira display string
 * e.g. 150000 kobo -> "₦1,500.00"
 */
export function formatKobo(kobo: number): string {
  const naira = kobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(naira);
}

/**
 * Derives a human-friendly 6-character receipt verification code from a transaction ID
 */
export function deriveVerificationCode(txnId: string): string {
  let hash = 0;
  for (let i = 0; i < txnId.length; i++) {
    hash = (hash << 5) - hash + txnId.charCodeAt(i);
    hash |= 0;
  }
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude easily confused chars (0, O, 1, I)
  let code = "";
  let num = Math.abs(hash);
  for (let i = 0; i < 6; i++) {
    code += chars[num % chars.length];
    num = Math.floor(num / chars.length) + (i * 7);
  }
  return code;
}
