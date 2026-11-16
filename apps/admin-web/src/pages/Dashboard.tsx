import { ChevronRight, Clock3, Ellipsis, Sparkles } from "lucide-react";
import {
  demoDashboardActivity,
  demoDashboardMetrics,
  demoPeriodTotals,
  demoRecentRegistrations,
  demoSummary,
  demoTransactions,
  type DemoTransaction,
} from "../data/adminDemoData";

interface DashboardProps {
  period: string;
  setPeriod: (period: string) => void;
  go: (section: string) => void;
  openTransaction: (transaction: DemoTransaction) => void;
}

const initialsColor = (index: number) =>
  ["lavender", "peach", "mint", "blue", "rose"][index % 5];

const formatNaira = (amount: number) =>
  `${String.fromCharCode(8358)}${amount.toLocaleString("en-NG")}`;

export default function Dashboard({
  period,
  setPeriod,
  go,
  openTransaction,
}: DashboardProps) {
  return (
    <>
      <div className="demo-banner">
        <Sparkles size={16} />
        <span>
          <b>Demo dashboard</b> · Sample figures for interface preview only
        </span>
        <button onClick={() => go("Reports & Analytics")}>
          Explore reports <ChevronRight size={14} />
        </button>
      </div>
      <section className="metric-grid">
        {demoDashboardMetrics.map((metric) => (
          <div className="metric-card" key={metric.label}>
            <div className="metric-top">
              <span>{metric.label}</span>
              <i className={`metric-icon ${metric.color}`}>
                <metric.icon size={17} />
              </i>
            </div>
            <b className="metric-value">{metric.value}</b>
            <div className="metric-foot">
              <span
                className={
                  metric.color === "orange" || metric.color === "red"
                    ? "muted-change"
                    : "positive-change"
                }
              >
                {metric.change}
              </span>
              <span>{metric.hint}</span>
            </div>
          </div>
        ))}
      </section>
      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h2>Transaction activity</h2>
              <p>Successful transactions · demo data</p>
            </div>
            <select
              className="select period-select"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              {["Daily", "Weekly", "Monthly", "Yearly"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-dot" /> Transactions
            </span>
            <b>{demoPeriodTotals[period]}</b>
          </div>
          <div className="chart-area">
            <div className="chart-y">
              <span>400</span>
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>
            <div className="chart-canvas">
              <div className="chart-gridlines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg
                viewBox="0 0 700 190"
                preserveAspectRatio="none"
                role="img"
                aria-label={`${period} demo transaction chart`}
              >
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#c8984f" stopOpacity=".25" />
                    <stop offset="100%" stopColor="#c8984f" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={chartPath(period, true)} fill="url(#chartFill)" />
                <path
                  d={chartPath(period, false)}
                  fill="none"
                  stroke="#b77b28"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                />
              </svg>
              <div className="chart-x">
                {chartLabels(period).map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="panel activity-panel">
          <div className="panel-head">
            <div>
              <h2>System activity</h2>
              <p>Latest updates across your campus</p>
            </div>
            <button
              className="icon-button small"
              onClick={() => go("Audit Logs")}
              aria-label="Open audit logs"
            >
              <Ellipsis size={18} />
            </button>
          </div>
          <div className="activity-list">
            {demoDashboardActivity.map((activity) => (
              <div className="activity-item" key={activity.title}>
                <span className={`activity-icon ${activity.color}`}>
                  <activity.icon size={15} />
                </span>
                <span>
                  <b>{activity.title}</b>
                  <small>{activity.detail}</small>
                </span>
              </div>
            ))}
          </div>
          <button
            className="text-link activity-link"
            onClick={() => go("Audit Logs")}
          >
            View audit log <ChevronRight size={14} />
          </button>
        </section>
      </div>
      <div className="dashboard-grid lower-grid">
        <section className="panel table-panel">
          <div className="panel-head">
            <div>
              <h2>Recent transactions</h2>
              <p>Latest campus payment activity</p>
            </div>
            <button className="text-link" onClick={() => go("Transactions")}>
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Date &amp; time</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {demoTransactions.slice(0, 4).map((transaction, index) => (
                  <tr
                    key={transaction.ref}
                    onClick={() => openTransaction(transaction)}
                  >
                    <td>
                      <b className="ref-text">{transaction.ref}</b>
                      <small className="row-sub">{transaction.type}</small>
                    </td>
                    <td>
                      <div className="person-cell">
                        <span className={`avatar ${initialsColor(index)}`}>
                          {transaction.initials}
                        </span>
                        <span>{transaction.name}</span>
                      </div>
                    </td>
                    <td className="amount-text">
                      {formatNaira(transaction.amount)}
                    </td>
                    <td>
                      <span className="date-cell">{transaction.date}</span>
                      <small className="row-sub">{transaction.time}</small>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${transaction.status.toLowerCase()}`}
                      >
                        <i />
                        {transaction.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="icon-button small"
                        aria-label={`Open transaction ${transaction.ref}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          openTransaction(transaction);
                        }}
                      >
                        <Ellipsis size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <div className="right-stack">
          <section className="panel registration-panel">
            <div className="panel-head">
              <div>
                <h2>New registrations</h2>
                <p>Recently added students</p>
              </div>
              <button
                className="text-link"
                onClick={() => go("Student Management")}
              >
                View all
              </button>
            </div>
            <div className="new-student-list">
              {demoRecentRegistrations.map(({ student, dateLabel }, index) => (
                <div className="new-student" key={student.matric}>
                  <span className={`avatar ${initialsColor(index)}`}>
                    {student.initials}
                  </span>
                  <span>
                    <b>{student.name}</b>
                    <small>{student.matric}</small>
                  </span>
                  <small className="student-date">{dateLabel}</small>
                </div>
              ))}
            </div>
          </section>
          <section className="alert-card">
            <div className="alert-badge">
              <Clock3 size={16} />
            </div>
            <div>
              <b>{demoSummary.pendingReview} transactions need review</b>
              <p>Pending payments may need a closer look.</p>
              <button onClick={() => go("Transactions")}>
                Review transactions <ChevronRight size={14} />
              </button>
            </div>
            <ChevronRight className="alert-arrow" size={18} />
          </section>
        </div>
      </div>
    </>
  );
}

function chartPath(period: string, closeArea: boolean) {
  const line =
    period === "Daily"
      ? "M0 145 C55 130 65 106 110 119 S175 150 220 99 S285 85 330 103 S390 70 440 88 S500 115 550 55 S620 68 700 24"
      : "M0 143 C42 156 75 104 115 112 S170 139 220 90 S270 96 315 83 S380 114 420 70 S475 87 520 58 S585 92 625 48 S670 54 700 24";
  return closeArea ? `${line} L700 190 L0 190Z` : line;
}

function chartLabels(period: string) {
  if (period === "Daily")
    return ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"];
  if (period === "Weekly")
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (period === "Monthly") return ["Week 1", "Week 2", "Week 3", "Week 4"];
  return ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
}
