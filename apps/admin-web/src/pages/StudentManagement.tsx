import { ChevronDown, Download, Ellipsis } from "lucide-react";
import {
  demoStudents,
  demoSummary,
  type DemoStudent,
} from "../data/adminDemoData";
import { PageTitle, StatusPill, formatNaira } from "./PageShared";

interface Props {
  rows: DemoStudent[];
  query: string;
  setQuery: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  sort: () => void;
  onSelect: (student: DemoStudent) => void;
  onAction: (student: DemoStudent, action: string) => void;
  onExport: () => void;
}

export default function StudentManagement({
  rows,
  query,
  setQuery,
  filter,
  setFilter,
  sort,
  onSelect,
  onAction,
  onExport,
}: Props) {
  return (
    <>
      <section className="panel student-summary">
        {[
          ["Total registered", demoSummary.registered],
          ["Active accounts", demoSummary.active],
          ["Awaiting activation", demoSummary.awaitingActivation],
          ["Suspended", demoSummary.suspended],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <small>Demo records</small>
          </div>
        ))}
      </section>
      <section className="panel list-panel">
        <div className="list-toolbar">
          <PageTitle
            title="Student directory"
            copy={`Showing ${rows.length} demo records`}
          />
          <div className="toolbar-actions">
            <label className="table-search">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search students..."
              />
            </label>
            <select
              className="select"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              {["All statuses", "Active", "Pending", "Suspended"].map(
                (item) => (
                  <option key={item}>{item}</option>
                ),
              )}
            </select>
            <button className="btn btn-outline" onClick={onExport}>
              <Download size={15} /> Export
            </button>
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <button className="th-sort" onClick={sort}>
                    Student <ChevronDown size={13} />
                  </button>
                </th>
                <th>Matric number</th>
                <th>Department</th>
                <th>Faculty</th>
                <th>Level</th>
                <th>Balance</th>
                <th>Account</th>
                <th>Card</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((student) => (
                <tr key={student.matric} onClick={() => onSelect(student)}>
                  <td>{student.name}</td>
                  <td className="mono-text">{student.matric}</td>
                  <td>{student.department}</td>
                  <td>{student.faculty}</td>
                  <td>{student.level}</td>
                  <td>
                    {student.balance === undefined
                      ? "Not available"
                      : formatNaira(student.balance)}
                  </td>
                  <td>
                    <StatusPill status={student.status} />
                  </td>
                  <td>
                    <StatusPill status={student.card} />
                  </td>
                  <td>
                    <button
                      className="icon-button small"
                      aria-label={`Actions for ${student.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onAction(student, "account");
                      }}
                    >
                      <Ellipsis size={16} />
                    </button>
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
