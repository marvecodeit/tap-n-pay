import { ArrowUpRight, Shield, ShieldCheck } from "lucide-react";
import {
  demoSummary,
  demoTransactions,
  type DemoTransaction,
} from "../data/adminDemoData";
import { TransactionTable } from "./PageShared";

export default function AccountFunding({
  go,
  onSelect,
}: {
  go: (section: string) => void;
  onSelect: (transaction: DemoTransaction) => void;
}) {
  return (
    <>
      <div className="demo-banner">
        <Shield size={16} />
        <span>
          <b>Funding view is limited to recorded demo activity.</b> No live
          wallet balance or reconciliation source is connected.
        </span>
      </div>
      <div className="mini-stat-row">
        <div className="panel mini-stat">
          <span>Recorded wallet credits</span>
          <b>{demoSummary.recordedCredits}</b>
          <small>Sample entries only</small>
        </div>
        <div className="panel mini-stat">
          <span>Student spending</span>
          <b>{demoSummary.studentSpending}</b>
          <small>Sample entries only</small>
        </div>
        <div className="panel mini-stat">
          <span>Pending funding</span>
          <b>{demoSummary.pendingReview}</b>
          <small className="muted-change">Awaiting confirmation</small>
        </div>
      </div>
      <section className="panel list-panel">
        <div className="list-toolbar">
          <div>
            <h2>Funding history</h2>
            <p>Funding events from sample records</p>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => go("Transactions")}
          >
            <ArrowUpRight size={15} /> View transactions
          </button>
        </div>
        <TransactionTable
          rows={demoTransactions.filter(
            (row) => row.type === "Account funding",
          )}
          onSelect={onSelect}
        />
        <div className="funding-note">
          <ShieldCheck size={18} />
          <span>
            <b>Controlled adjustments are unavailable in this demo.</b> A
            connected funding provider and audit trail are required before a
            financial adjustment can be recorded.
          </span>
        </div>
      </section>
    </>
  );
}
