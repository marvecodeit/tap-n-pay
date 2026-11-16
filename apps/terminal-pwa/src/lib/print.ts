import type { Transaction } from "@tapnpay/api-client";
import { formatKobo } from "@tapnpay/ui";

export function printThermalReceipt(txn: Transaction, cafeteriaName = "CAMPUS CAFETERIA"): void {
  // Ensure we populate the receipt-print-area element and trigger window.print()
  let printArea = document.getElementById("receipt-print-area");
  if (!printArea) {
    printArea = document.createElement("div");
    printArea.id = "receipt-print-area";
    document.body.appendChild(printArea);
  }

  const dateStr = new Date(txn.created_at).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const maskedCard = txn.card_id.length > 4 ? `…${txn.card_id.slice(-4)}` : txn.card_id;

  printArea.innerHTML = `
    <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 10px;">
      <div style="font-size: 16px; font-weight: bold; text-transform: uppercase;">${cafeteriaName}</div>
      <div style="font-size: 11px;">Terminal: ${txn.terminal_id} | Cashier: ${txn.cashier_id}</div>
    </div>

    <div style="text-align: center; margin: 15px 0;">
      <div style="font-size: 26px; font-weight: 900; letter-spacing: -0.5px;">${formatKobo(txn.amount)}</div>
      <div style="font-size: 14px; font-weight: bold; margin-top: 4px; letter-spacing: 2px;">PAID</div>
    </div>

    <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 8px 0; margin: 12px 0; font-size: 12px;">
      <div style="display: flex; justify-content: space-between;">
        <span>Student:</span>
        <span style="font-weight: bold;">${txn.student_name || "Student"} (${maskedCard})</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Date:</span>
        <span>${dateStr}</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Txn ID:</span>
        <span style="font-family: monospace;">${txn.txn_id.slice(0, 8)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 13px;">
        <span>Verification Code:</span>
        <span style="font-weight: 900; font-size: 15px; letter-spacing: 1px;">${txn.verification_code || "N/A"}</span>
      </div>
    </div>

    <div style="text-align: center; font-size: 11px; margin-top: 10px;">
      <div>Keep this receipt.</div>
      <div>It is your meal voucher.</div>
    </div>
  `;

  window.print();
}
