import { useState } from "react";
import { AlertOctagon, CheckCircle2, XCircle } from "lucide-react";
import { formatKobo } from "@tapnpay/ui";
import type { RefundRequest } from "@tapnpay/api-client";
import { StatusPill } from "./PageShared";

interface RefundsProps {
  onApproveRefund: (refundId: string) => void;
}

export function Refunds({ onApproveRefund }: RefundsProps) {
  const [refunds, setRefunds] = useState<RefundRequest[]>([
    {
      refund_id: "REF-001",
      txn_id: "txn-9a2c-4f11",
      card_id: "CARD-A3F2-9K2",
      amount: 150000, // ₦1,500.00
      reason: "Item was out of stock after tap",
      cashier_id: "c-001",
      status: "PENDING",
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      refund_id: "REF-002",
      txn_id: "txn-1b8e-7k33",
      card_id: "CARD-7B4C-1L9",
      amount: 80000, // ₦800.00
      reason: "Student tapped twice by mistake before terminal lock",
      cashier_id: "c-002",
      status: "PENDING",
      created_at: new Date(Date.now() - 14400000).toISOString(),
    },
  ]);

  const handleAction = (id: string, action: "approve" | "reject") => {
    if (action === "approve") {
      onApproveRefund(id);
      setRefunds((prev) =>
        prev.map((r) => (r.refund_id === id ? { ...r, status: "APPROVED" } : r))
      );
    } else {
      setRefunds((prev) =>
        prev.map((r) => (r.refund_id === id ? { ...r, status: "REJECTED" } : r))
      );
    }
  };

  return (
    <>
      <div className="demo-banner">
        <AlertOctagon size={16} />
        <span>
          <b>Fraud mitigation policy:</b> Cashiers are restricted to a maximum
          of 3 immediate voids per shift. Additional voids trigger an
          administrative audit alert.
        </span>
      </div>

      <section className="panel list-panel">
        <div className="list-toolbar">
          <div>
            <h2>Pending wallet refund requests</h2>
            <p>Review and update refund request status.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Refund ID</th>
                <th>Card ID</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Cashier</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((ref) => (
                <tr key={ref.refund_id}>
                  <td>
                    <b className="ref-text">{ref.refund_id}</b>
                  </td>
                  <td className="mono-text">{ref.card_id}</td>
                  <td className="amount-text">{formatKobo(ref.amount)}</td>
                  <td>{ref.reason}</td>
                  <td className="mono-text">{ref.cashier_id}</td>
                  <td>
                    <StatusPill status={ref.status} />
                  </td>
                  <td>
                    {ref.status === "PENDING" && (
                      <div className="toolbar-actions">
                        <button
                          onClick={() => handleAction(ref.refund_id, "reject")}
                          className="btn btn-outline danger-text"
                        >
                          <XCircle size={15} /> Reject
                        </button>
                        <button
                          onClick={() => handleAction(ref.refund_id, "approve")}
                          className="btn btn-primary"
                        >
                          <CheckCircle2 size={15} /> Approve
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
