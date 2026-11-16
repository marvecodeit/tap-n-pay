import type { DemoTransaction } from "../data/adminDemoData";

export const formatNaira = (amount: number) =>
  `${String.fromCharCode(8358)}${amount.toLocaleString("en-NG")}`;

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`status-pill ${status.toLowerCase().replace(" ", "-")}`}>
      <i />
      {status}
    </span>
  );
}

export function TransactionTable({
  rows,
  onSelect,
}: {
  rows: DemoTransaction[];
  onSelect: (transaction: DemoTransaction) => void;
}) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Student</th>
            <th>Matric number</th>
            <th>Amount</th>
            <th>Date &amp; time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.ref} onClick={() => onSelect(row)}>
              <td>
                <b className="ref-text">{row.ref}</b>
                <small className="row-sub">{row.type}</small>
              </td>
              <td>{row.name}</td>
              <td className="mono-text">{row.matric}</td>
              <td className="amount-text">{formatNaira(row.amount)}</td>
              <td>
                {row.date}
                <small className="row-sub">{row.time}</small>
              </td>
              <td>
                <StatusPill status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="empty-state">
          <b>No records found</b>
        </div>
      )}
    </div>
  );
}

export function PageTitle({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="panel-head">
      <div>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
    </div>
  );
}
