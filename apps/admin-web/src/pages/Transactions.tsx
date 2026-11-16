import { demoSummary, type DemoTransaction } from "../data/adminDemoData";
import { TransactionTable } from "./PageShared";

interface Props {
  rows: DemoTransaction[];
  query: string;
  setQuery: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  onSelect: (row: DemoTransaction) => void;
  onExport: () => void;
}

export default function Transactions({
  rows,
  query,
  setQuery,
  filter,
  setFilter,
  onSelect,
  onExport,
}: Props) {
  return (
    <>
      <div className="mini-stat-row">
        <div className="panel mini-stat">
          <span>Successful today</span>
          <b>{demoSummary.successfulToday}</b>
        </div>
        <div className="panel mini-stat">
          <span>Pending review</span>
          <b>{demoSummary.pendingReview}</b>
        </div>
        <div className="panel mini-stat">
          <span>Failed payments</span>
          <b>{demoSummary.failedPayments}</b>
        </div>
      </div>
      <section className="panel list-panel">
        <div className="list-toolbar">
          <div>
            <h2>Transaction history</h2>
            <p>Payment records from the demo environment</p>
          </div>
          <div className="toolbar-actions">
            <label className="table-search">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search reference or student..."
              />
            </label>
            <select
              className="select"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              {["All statuses", "Successful", "Pending", "Failed"].map(
                (item) => (
                  <option key={item}>{item}</option>
                ),
              )}
            </select>
            <button className="btn btn-outline" onClick={onExport}>
              Export CSV
            </button>
          </div>
        </div>
        <TransactionTable rows={rows} onSelect={onSelect} />
        <div className="table-bottom">Payment status is provider verified.</div>
      </section>
    </>
  );
}
