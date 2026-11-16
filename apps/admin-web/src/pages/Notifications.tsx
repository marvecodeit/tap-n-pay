import { useState } from "react";
import { Check } from "lucide-react";
import { demoNotificationRecords } from "../data/adminDemoData";

export default function Notifications({
  read,
  setRead,
}: {
  read: boolean;
  setRead: (value: boolean) => void;
}) {
  const [filter, setFilter] = useState("All alerts");
  const rows = demoNotificationRecords.filter(
    (row) => filter === "All alerts" || row.category === filter,
  );
  return (
    <section className="panel list-panel">
      <div className="list-toolbar">
        <div>
          <h2>All notifications</h2>
          <p>
            {read
              ? "You're all caught up"
              : `${demoNotificationRecords.filter((row) => row.unread).length} unread alerts`}{" "}
            · sample notifications
          </p>
        </div>
        <div className="toolbar-actions">
          <select
            className="select"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            {["All alerts", "Payment", "Card", "Student", "System"].map(
              (item) => (
                <option key={item}>{item}</option>
              ),
            )}
          </select>
          <button className="btn btn-outline" onClick={() => setRead(true)}>
            <Check size={15} /> Mark all as read
          </button>
        </div>
      </div>
      <div className="notifications-list">
        {rows.map((row, index) => (
          <div
            className={`notification-item ${read ? "read" : ""}`}
            key={row.title}
          >
            <span className={`notification-item-icon ni-${index % 4}`}>
              <row.icon size={17} />
            </span>
            <div>
              <div className="notification-title-row">
                <b>{row.title}</b>
                <span className="category-tag">{row.category}</span>
              </div>
              <p>{row.copy}</p>
              <small>{row.time}</small>
            </div>
            {!read && <i className="unread-dot" />}
          </div>
        ))}
      </div>
    </section>
  );
}
