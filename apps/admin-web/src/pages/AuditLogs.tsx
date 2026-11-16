import { Search } from "lucide-react";
import { demoAuditRecords } from "../data/adminDemoData";

export default function AuditLogs({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (value: string) => void;
}) {
  const rows = demoAuditRecords.filter((row) =>
    row.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="panel list-panel">
      <div className="list-toolbar">
        <div>
          <h2>Activity history</h2>
          <p>Administrative actions captured in the demo audit trail</p>
        </div>
        <label className="table-search">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search audit logs..."
          />
        </label>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Administrator</th>
              <th>Action</th>
              <th>Affected record</th>
              <th>Timestamp</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row[0]}-${row[1]}-${row[3]}`}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="empty-state">
            <b>No audit events found</b>
            <p>Try adjusting your search.</p>
          </div>
        )}
      </div>
      <div className="table-bottom">
        <span>Audit events are read-only.</span>
        <span>{rows.length} events</span>
      </div>
    </section>
  );
}
