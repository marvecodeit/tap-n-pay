import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Download,
  FileClock,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  UserCog,
  Wallet,
  X,
} from "lucide-react";
import type { Card } from "@tapnpay/api-client";
import {
  demoCurrentAdmin,
  demoPopoverNotifications,
  demoPopoverTimes,
  demoStudents,
  demoTransactions,
  type DemoStudent,
  type DemoTransaction,
} from "../data/adminDemoData";
import AccountFundingPage from "./AccountFunding";
import AdminManagementPage from "./AdminManagement";
import AuditLogsPage from "./AuditLogs";
import DashboardPage from "./Dashboard";
import HelpSupportPage from "./HelpSupport";
import NotificationsPage from "./Notifications";
import ReportsAnalyticsPage from "./ReportsAnalytics";
import SettingsPage from "./Settings";
import StudentCardsPage from "./StudentCards";
import StudentManagementPage from "./StudentManagement";
import TransactionsPage from "./Transactions";
import { Cards as CardsPage } from "./Cards";
import { Refunds as RefundsPage } from "./Refunds";

type Section =
  | "Dashboard"
  | "Student Management"
  | "Transactions"
  | "Cards"
  | "Account Funding"
  | "Reports & Analytics"
  | "Refunds"
  | "Notifications"
  | "Admin Management"
  | "Audit Logs"
  | "Settings"
  | "Help & Support";

type RecordItem = DemoStudent | DemoTransaction;

const navigation: {
  label: Section | "Sign Out";
  icon: typeof LayoutDashboard;
  group?: string;
}[] = [
  { label: "Dashboard", icon: LayoutDashboard, group: "OVERVIEW" },
  { label: "Student Management", icon: GraduationCap },
  { label: "Transactions", icon: ArrowUpRight },
  { label: "Cards", icon: CreditCard },
  { label: "Account Funding", icon: Wallet },
  { label: "Reports & Analytics", icon: BarChart3, group: "MANAGE" },
  { label: "Refunds", icon: Shield },
  { label: "Notifications", icon: Bell },
  { label: "Admin Management", icon: UserCog },
  { label: "Audit Logs", icon: FileClock },
  { label: "Settings", icon: Settings, group: "SYSTEM" },
  { label: "Help & Support", icon: LifeBuoy },
  { label: "Sign Out", icon: LogOut },
];

export function App() {
  const [page, setPage] = useState<Section>("Dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState("Weekly");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [toast, setToast] = useState("");
  const [read, setRead] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [cards, setCards] = useState<Card[]>(() =>
    demoStudents.map((student, index) => ({
      card_id: `CARD-${student.matric.slice(-4)}-${String(index + 1).padStart(3, "0")}`,
      student_id: student.matric,
      student_name: student.name,
      balance: (student.balance ?? 0) * 100,
      version: 1,
      blocked: student.card === "Blocked" ? 1 : 0,
      issued_at: new Date().toISOString(),
    })),
  );
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const shownStudents = useMemo(
    () =>
      demoStudents
        .filter(
          (student) =>
            `${student.name} ${student.matric} ${student.department}`
              .toLowerCase()
              .includes(query.toLowerCase()) &&
            (statusFilter === "All statuses" ||
              student.status === statusFilter),
        )
        .sort((a, b) =>
          sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
        ),
    [query, statusFilter, sortAsc],
  );
  const shownTransactions = useMemo(
    () =>
      demoTransactions.filter(
        (transaction) =>
          `${transaction.name} ${transaction.ref} ${transaction.matric}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (statusFilter === "All statuses" ||
            transaction.status === statusFilter),
      ),
    [query, statusFilter],
  );
  const go = (label: string) => {
    if (label === "Sign Out") {
      setModal("signout");
      return;
    }
    setPage(label as Section);
    setQuery("");
    setStatusFilter("All statuses");
    setMobileNav(false);
  };
  const exportCsv = (rows: RecordItem[], name: string) => {
    const csv = rows.map((row) => Object.values(row).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `${name.toLowerCase().replaceAll(" ", "-")}-demo.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    notify("Demo CSV downloaded");
  };
  const title = page === "Dashboard" ? "Good morning, Admin" : page;

  return (
    <div className="app-shell">
      {mobileNav && (
        <button
          className="scrim"
          onClick={() => setMobileNav(false)}
          aria-label="Close menu"
        />
      )}
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <span />
          </span>
          <span>
            <b>TapNPay</b>
            <small>ADMIN PORTAL</small>
          </span>
          <button
            className="icon-button close-nav"
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>
        <div className="campus-switch">
          <span className="campus-icon">
            <Building2 size={17} />
          </span>
          <span>
            <b>University Campus</b>
            <small>Central Cafeteria</small>
          </span>
          <ChevronDown size={15} />
        </div>
        <nav className="side-nav">
          {navigation.map((item) => (
            <div key={item.label}>
              {item.group && <div className="nav-group">{item.group}</div>}
              <button
                onClick={() => go(item.label)}
                className={`nav-item ${page === item.label ? "active" : ""} ${item.label === "Sign Out" ? "signout-nav" : ""}`}
              >
                <item.icon size={17} />
                <span>{item.label}</span>
                {item.label === "Notifications" && <i className="nav-dot" />}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="online-dot" /> All systems operational{" "}
          <span>v1.8.2</span>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumbs">
            Workspace <ChevronRight size={14} /> <b>{page}</b>
          </div>
          <div className="top-actions">
            <label className="global-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search anything..."
              />
            </label>
            <div className="relative">
              <button
                className={`icon-button notification-button ${noticeOpen ? "selected" : ""}`}
                onClick={() => setNoticeOpen(!noticeOpen)}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <i />
              </button>
              {noticeOpen && (
                <div className="popover notification-pop">
                  <div className="popover-head">
                    <b>Notifications</b>
                    <button onClick={() => setRead(true)}>Mark all read</button>
                  </div>
                  {demoPopoverNotifications.map((notice, index) => (
                    <div
                      className={`notice-row ${read ? "read" : ""}`}
                      key={notice}
                    >
                      <span className={`notice-icon ni-${index}`}>
                        <Bell size={15} />
                      </span>
                      <span>
                        <b>{notice}</b>
                        <small>{demoPopoverTimes[index]}</small>
                      </span>
                    </div>
                  ))}
                  <button
                    className="popover-link"
                    onClick={() => {
                      go("Notifications");
                      setNoticeOpen(false);
                    }}
                  >
                    View all notifications <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
            <div className="top-divider" />
            <div className="relative">
              <button
                className="profile-trigger"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <span className="avatar avatar-admin">
                  {demoCurrentAdmin.initials}
                </span>
                <span className="profile-copy">
                  <b>{demoCurrentAdmin.name}</b>
                  <small>{demoCurrentAdmin.role}</small>
                </span>
                <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="popover profile-pop">
                  <div className="profile-pop-head">
                    <span className="avatar avatar-admin">
                      {demoCurrentAdmin.initials}
                    </span>
                    <span>
                      <b>{demoCurrentAdmin.name}</b>
                      <small>{demoCurrentAdmin.email}</small>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      go("Settings");
                      setProfileOpen(false);
                    }}
                  >
                    <Settings size={15} /> Profile settings
                  </button>
                  <button
                    className="danger-text"
                    onClick={() => {
                      setModal("signout");
                      setProfileOpen(false);
                    }}
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {page === "Dashboard"
                  ? "THURSDAY, 29 OCTOBER 2026"
                  : "TAPNPAY ADMINISTRATION"}
              </div>
              <h1>
                {title}
                {page === "Dashboard" && (
                  <span className="heading-wave">✦</span>
                )}
              </h1>
              <p>
                {page === "Dashboard"
                  ? "Here’s what’s happening across your campus today."
                  : pageDescription(page)}
              </p>
            </div>
            <div className="heading-actions">
              {page === "Cards" ||
              page === "Refunds" ? null : page === "Dashboard" ? (
                <button
                  className="btn btn-outline"
                  onClick={() => notify("Dashboard refreshed")}
                >
                  <RefreshCw size={15} /> Refresh
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    page === "Reports & Analytics" || page === "Transactions"
                      ? exportCsv(
                          page === "Transactions"
                            ? shownTransactions
                            : demoStudents,
                          page,
                        )
                      : setModal(`add-${page}`)
                  }
                >
                  <Download size={15} />
                  {page === "Reports & Analytics" || page === "Transactions"
                    ? "Export CSV"
                    : actionLabel(page)}
                </button>
              )}
            </div>
          </div>
          {page === "Dashboard" && (
            <DashboardPage
              period={period}
              setPeriod={setPeriod}
              go={go}
              openTransaction={(transaction) => {
                setSelected(transaction);
                setModal("transaction");
              }}
            />
          )}
          {page === "Student Management" && (
            <StudentManagementPage
              rows={shownStudents}
              query={query}
              setQuery={setQuery}
              filter={statusFilter}
              setFilter={setStatusFilter}
              sort={() => setSortAsc(!sortAsc)}
              onSelect={(student) => {
                setSelected(student);
                setModal("student");
              }}
              onAction={(student, action) => {
                setSelected(student);
                setModal(action);
              }}
              onExport={() => exportCsv(shownStudents, "students")}
            />
          )}
          {page === "Transactions" && (
            <TransactionsPage
              rows={shownTransactions}
              query={query}
              setQuery={setQuery}
              filter={statusFilter}
              setFilter={setStatusFilter}
              onSelect={(transaction) => {
                setSelected(transaction);
                setModal("transaction");
              }}
              onExport={() => exportCsv(shownTransactions, "transactions")}
            />
          )}
          {page === "Cards" && (
            <CardsPage
              cards={cards}
              onToggleBlock={(cardId) =>
                setCards((current) =>
                  current.map((card) =>
                    card.card_id === cardId
                      ? { ...card, blocked: card.blocked ? 0 : 1 }
                      : card,
                  ),
                )
              }
              onIssueCard={(newCard) =>
                setCards((current) => [...current, newCard])
              }
            />
          )}
          {page === "Refunds" && (
            <RefundsPage
              onApproveRefund={(refundId) =>
                notify(`Refund ${refundId} approved in demo`)
              }
            />
          )}
          {page === "Account Funding" && (
            <AccountFundingPage
              go={go}
              onSelect={(transaction) => {
                setSelected(transaction);
                setModal("transaction");
              }}
            />
          )}
          {page === "Reports & Analytics" && (
            <ReportsAnalyticsPage
              period={period}
              setPeriod={setPeriod}
              onExport={() => exportCsv(demoTransactions, "reports")}
            />
          )}
          {page === "Notifications" && (
            <NotificationsPage read={read} setRead={setRead} />
          )}
          {page === "Admin Management" && <AdminManagementPage />}
          {page === "Audit Logs" && (
            <AuditLogsPage query={query} setQuery={setQuery} />
          )}
          {page === "Settings" && <SettingsPage notify={notify} />}
          {page === "Help & Support" && <HelpSupportPage notify={notify} />}
          <footer className="page-footer">
            <span>© 2026 TapNPay · Demo environment</span>
            <span>
              <i className="online-dot" /> Data shown is sample data
            </span>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
      {modal && (
        <Modal
          name={modal}
          selected={selected}
          close={() => {
            setModal("");
            setSelected(null);
          }}
          onConfirm={() => {
            if (modal === "signout") {
              notify("Demo session signed out");
              setPage("Dashboard");
            } else notify("Action recorded in demo audit log");
            setModal("");
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

export default App;

function pageDescription(page: Section) {
  const descriptions: Record<Section, string> = {
    Dashboard: "",
    "Student Management":
      "Manage student profiles, accounts and campus access.",
    Transactions: "Review payment activity and transaction status.",
    Cards: "Register and manage student identity cards.",
    "Account Funding": "Review recorded funding activity and reconciliation.",
    "Reports & Analytics":
      "Understand campus activity using demo reporting data.",
    Refunds: "Review refund requests and cashier void activity.",
    Notifications: "Stay up to date with important campus activity.",
    "Admin Management": "Manage portal administrators and their access levels.",
    "Audit Logs": "A transparent record of administrative actions.",
    Settings: "Configure your campus portal preferences.",
    "Help & Support": "Guidance for using TapNPay Admin.",
  };
  return descriptions[page];
}

function actionLabel(page: Section) {
  if (page === "Student Management") return "Add student";
  if (page === "Cards") return "Issue card";
  if (page === "Account Funding") return "Record funding";
  if (page === "Notifications") return "Notification settings";
  if (page === "Admin Management") return "Add administrator";
  return "Save changes";
}

function Modal({
  name,
  selected,
  close,
  onConfirm,
}: {
  name: string;
  selected: RecordItem | null;
  close: () => void;
  onConfirm: () => void;
}) {
  const isSignout = name === "signout";
  const isTransaction = name === "transaction";
  const isStudent = name === "student";
  const student =
    selected && "matric" in selected ? (selected as DemoStudent) : null;
  const transaction =
    selected && "ref" in selected ? (selected as DemoTransaction) : null;
  const label = name.includes("block")
    ? "Block card"
    : name.includes("reactivate")
      ? "Reactivate card"
      : name.includes("register")
        ? "Register card"
        : name === "account"
          ? "Update account status"
          : name;
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="modal">
        <button
          className="icon-button modal-close"
          onClick={close}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>
        <span className={`modal-icon ${isSignout ? "danger-icon" : ""}`}>
          {isSignout ? (
            <LogOut size={20} />
          ) : isTransaction ? (
            <ArrowUpRight size={20} />
          ) : isStudent ? (
            <GraduationCap size={20} />
          ) : (
            <ShieldCheck size={20} />
          )}
        </span>
        <h2>
          {isSignout
            ? "Sign out of TapNPay?"
            : isTransaction
              ? "Transaction details"
              : isStudent
                ? "Student details"
                : label}
        </h2>
        <p>
          {isSignout
            ? "You’ll end your current administrator session. You can sign back in at any time."
            : isTransaction
              ? "Demo transaction record · status is provider verified."
              : isStudent
                ? "Student profile from the demo directory."
                : `Confirm this ${label.toLowerCase()} action for ${student?.name || "this record"}.`}
        </p>
        {transaction && (
          <div className="modal-record">
            <div>
              <small>Reference</small>
              <b>{transaction.ref}</b>
            </div>
            <div>
              <small>Student</small>
              <b>
                {transaction.name} · {transaction.matric}
              </b>
            </div>
            <div>
              <small>Amount</small>
              <b>{`${String.fromCharCode(8358)}${transaction.amount.toLocaleString("en-NG")}`}</b>
            </div>
            <div>
              <small>Status</small>
              <b>{transaction.status}</b>
            </div>
            <div>
              <small>Date &amp; time</small>
              <b>
                {transaction.date} · {transaction.time}
              </b>
            </div>
          </div>
        )}
        {student && (
          <div className="modal-record">
            <div>
              <small>Student</small>
              <b>{student.name}</b>
            </div>
            <div>
              <small>Matric number</small>
              <b>{student.matric}</b>
            </div>
            <div>
              <small>Department</small>
              <b>{student.department}</b>
            </div>
            <div>
              <small>Account status</small>
              <b>{student.status}</b>
            </div>
          </div>
        )}
        {isTransaction && (
          <div className="verified-note">
            <ShieldCheck size={16} /> Payment confirmation is controlled by the
            payment provider. This record cannot be manually marked successful.
          </div>
        )}
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={close}>
            {isTransaction || isStudent ? "Close" : "Cancel"}
          </button>
          {!isTransaction && !isStudent && (
            <button
              className={`btn ${isSignout ? "btn-danger" : "btn-primary"}`}
              onClick={onConfirm}
            >
              {isSignout ? "Sign out" : "Confirm action"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
