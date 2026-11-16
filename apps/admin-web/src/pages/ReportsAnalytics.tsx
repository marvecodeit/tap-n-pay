import { CalendarDays, FileText } from "lucide-react";
import {
  demoRegistrationTrend,
  demoReportMonths,
  demoSummary,
  demoTransactionBars,
} from "../data/adminDemoData";

export default function ReportsAnalytics({
  period,
  setPeriod,
  onExport,
}: {
  period: string;
  setPeriod: (period: string) => void;
  onExport: () => void;
}) {
  return (
    <>
      <div className="demo-banner">
        <span>
          <b>Reporting data is illustrative.</b> Choose a date range to preview
          report layout.
        </span>
        <div className="date-range">
          <CalendarDays size={15} />
          <input type="date" aria-label="Report start date" />
          <span>to</span>
          <input type="date" aria-label="Report end date" />
        </div>
      </div>
      <div className="mini-stat-row">
        {[
          ["Transaction volume", demoSummary.monthlyVolume],
          ["Successful value", demoSummary.successfulValue],
          ["Failed payments", demoSummary.reportFailedPayments],
          ["Cards registered", demoSummary.cardsRegistered],
        ].map(([label, value]) => (
          <div className="panel mini-stat" key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <small>Demo data</small>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h2>Transaction summary</h2>
              <p>Transaction volume by {period.toLowerCase()} · demo</p>
            </div>
            <select
              className="select"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            >
              {["Daily", "Weekly", "Monthly", "Yearly"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="bar-chart">
            {demoTransactionBars.map((height, index) => (
              <div className="bar-item" key={demoReportMonths[index]}>
                <i style={{ height: `${height}%` }} />
                <small>{demoReportMonths[index]}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="panel report-side">
          <h2>Student registrations</h2>
          <p>New registrations over the current demo period</p>
          <div className="registration-chart">
            {demoRegistrationTrend.map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="report-legend">
            <span>Last 12 months</span>
            <b>+18.6% demo trend</b>
          </div>
        </section>
      </div>
      <section className="panel report-download">
        <div className="report-icon">
          <FileText size={19} />
        </div>
        <div>
          <b>Download report data</b>
          <small>Export sample transaction records as a CSV file.</small>
        </div>
        <button className="btn btn-primary" onClick={onExport}>
          Download CSV
        </button>
      </section>
    </>
  );
}
