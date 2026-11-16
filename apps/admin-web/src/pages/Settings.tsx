import {
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock3,
  Shield,
  UserCog,
  Wallet,
} from "lucide-react";

export default function Settings({
  notify,
}: {
  notify: (message: string) => void;
}) {
  const sections = [
    "School branding",
    "Academic session",
    "Payment settings",
    "Notifications",
    "Security",
    "Admin profile",
    "Sessions",
  ];
  const icons = [
    Building2,
    CalendarDays,
    Wallet,
    Bell,
    Shield,
    UserCog,
    Clock3,
  ];
  return (
    <div className="settings-layout">
      <div className="settings-menu panel">
        {sections.map((section, index) => {
          const Icon = icons[index];
          return (
            <button
              className={index === 0 ? "settings-active" : ""}
              key={section}
            >
              <span>
                <Icon size={16} />
              </span>
              {section}
              <ChevronRight size={14} />
            </button>
          );
        })}
      </div>
      <div className="settings-content">
        <section className="panel settings-panel">
          <div className="settings-title">
            <div>
              <h2>School branding</h2>
              <p>Manage institution details displayed across your portal.</p>
            </div>
            <span className="setup-tag">DEMO CONFIGURATION</span>
          </div>
          <label className="form-label">
            Institution name
            <input defaultValue="University Campus" />
          </label>
          <label className="form-label">
            Portal display name
            <input defaultValue="TapNPay · Central Cafeteria" />
          </label>
          <label className="form-label">
            Support email
            <input defaultValue="support@tapnpay.edu.ng" />
          </label>
          <label className="form-label">
            Academic session
            <select defaultValue="2026/2027">
              <option>2026/2027</option>
              <option>2025/2026</option>
            </select>
          </label>
          <button
            className="btn btn-primary"
            onClick={() => notify("Demo settings saved")}
          >
            Save changes
          </button>
        </section>
        <section className="panel settings-panel">
          <h2>Security &amp; session</h2>
          <p>Keep administrator access protected.</p>
          <div className="setting-toggle-row">
            <div>
              <b>Two-factor authentication</b>
              <small>
                Require a second verification step for administrators.
              </small>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="setting-toggle-row">
            <div>
              <b>Session timeout</b>
              <small>
                Automatically sign out after 30 minutes of inactivity.
              </small>
            </div>
            <input type="checkbox" defaultChecked />
          </div>
        </section>
      </div>
    </div>
  );
}
