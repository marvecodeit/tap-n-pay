import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CircleHelp,
  CreditCard,
  FileClock,
  History,
  Home,
  LogOut,
  Menu,
  Receipt,
  Send,
  ShieldCheck,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import type { PortalContext } from "./PortalShared";

const navigation = [
  { to: "/dashboard", label: "Overview", icon: Home, end: true },
  { to: "/dashboard/card", label: "Student ID", icon: CreditCard },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { to: "/dashboard/transactions", label: "Transactions", icon: FileClock },
  { to: "/dashboard/transfer", label: "Transfer", icon: Send },
  { to: "/dashboard/receipts", label: "Receipts", icon: Receipt },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/settings", label: "Security", icon: Settings },
  { to: "/dashboard/help", label: "Help & support", icon: CircleHelp },
];

const sidebarPrimary = [
  { to: "/dashboard", label: "Overview", icon: Home, end: true },
  { to: "/dashboard/card", label: "Student ID", icon: CreditCard },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
  { to: "/dashboard/transactions", label: "Transactions", icon: History },
  { to: "/dashboard/transfer", label: "Transfer", icon: Send },
];

const sidebarSecondary = [
  { to: "/dashboard/settings", label: "Security", icon: ShieldCheck },
  { to: "/dashboard/help", label: "Help & support", icon: CircleHelp },
];

function studentInitials(name?: string) {
  return (name || "Student")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function StudentShell({ student, setStudent }: PortalContext) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const profileMenuRef = useRef<HTMLDetailsElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const studentName = student?.name || "Student account";
  const activeSection =
    navigation.find(({ to }) => to === location.pathname) ?? navigation[0];

  useEffect(() => {
    function closeProfileMenu(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !profileMenuRef.current?.contains(event.target)
      ) {
        profileMenuRef.current?.removeAttribute("open");
      }
    }

    document.addEventListener("pointerdown", closeProfileMenu);
    return () => document.removeEventListener("pointerdown", closeProfileMenu);
  }, []);

  function logout() {
    setStudent(null);
    navigate("/login");
  }

  function showUnavailable(label: string) {
    setNotice(`${label} is not available yet.`);
  }

  return (
    <div className="min-h-screen bg-[#F8F3EC] text-[#34271A] md:flex">
      <header className="sticky top-0 z-30 border-b border-[#EADCCB] bg-white md:hidden">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link
            className="flex items-center gap-3 no-underline"
            to="/dashboard"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#D7A34F] text-lg font-bold text-[#241B12]">
              T
            </span>
            <span>
              <span className="block text-base font-bold text-[#34271A]">
                TapNPay
              </span>
              <span className="block text-xs text-[#75685A]">Student</span>
            </span>
          </Link>
          <button
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="grid size-10 place-items-center rounded-lg text-[#6B5D4D] hover:bg-[#F8F0E5]"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-[#EADCCB] bg-white p-3"
          >
            {navigation.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium no-underline ${isActive ? "bg-[#F8F0E5] text-[#8A5A16]" : "text-[#6B5D4D]"}`
                }
                end={end}
                key={to}
                onClick={() => setMobileMenuOpen(false)}
                to={to}
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </NavLink>
            ))}
            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#6B5D4D]"
              onClick={logout}
              type="button"
            >
              <LogOut aria-hidden="true" className="size-4" />
              Log out
            </button>
          </nav>
        )}
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-[#241B12] px-6 py-7 text-white md:flex">
        <Link
          className="mb-8 flex items-center gap-3 px-2 no-underline"
          to="/dashboard"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-[#D7A34F] text-lg font-bold text-[#241B12]">
            T
          </span>
          <span>
            <span className="block text-lg font-bold text-white">TapNPay</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D7A34F]">
              Student
            </span>
          </span>
        </Link>

        <nav aria-label="Student navigation" className="space-y-1">
          {sidebarPrimary.map(({ to, label, icon: Icon, end }) =>
            to ? (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl border-l-[3px] px-3 py-3 text-sm font-semibold no-underline transition-colors ${isActive ? "border-[#D7A34F] bg-[#3A2D20] text-white" : "border-transparent text-[#D0C5B6] hover:bg-[#302419] hover:text-white"}`
                }
                end={end}
                key={label}
                to={to}
              >
                <Icon aria-hidden="true" className="size-[18px]" />
                {label}
              </NavLink>
            ) : (
              <button
                className="flex w-full items-center gap-4 rounded-xl border-l-[3px] border-transparent px-3 py-3 text-left text-sm font-semibold text-[#D0C5B6] hover:bg-[#302419] hover:text-white"
                key={label}
                onClick={() => showUnavailable(label)}
                type="button"
              >
                <Icon aria-hidden="true" className="size-[18px]" />
                {label}
              </button>
            ),
          )}
        </nav>

        <nav aria-label="Support and security" className="mt-auto space-y-1">
          {sidebarSecondary.map(({ to, label, icon: Icon }) => (
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl border-l-[3px] px-3 py-3 text-sm font-semibold no-underline transition-colors ${isActive ? "border-[#D7A34F] bg-[#3A2D20] text-white" : "border-transparent text-[#D0C5B6] hover:bg-[#302419] hover:text-white"}`
              }
              key={to}
              to={to}
            >
              <Icon aria-hidden="true" className="size-[18px]" />
              {label}
            </NavLink>
          ))}
          <div className="mt-5 border-t border-[#4A3B2A] pt-4">
            <div className="flex items-center gap-3 px-2">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#D7A34F] text-sm font-bold text-[#241B12]">
                {studentInitials(student?.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">
                  {studentName}
                </span>
                <span className="mt-1 block truncate text-xs text-[#B7A995]">
                  {student?.student_id || "Student"}
                </span>
              </span>
            </div>
            <button
              className="mt-3 flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-[#D0C5B6] hover:bg-[#302419] hover:text-white"
              onClick={logout}
              type="button"
            >
              <LogOut aria-hidden="true" className="size-4" />
              Log out
            </button>
          </div>
        </nav>
      </aside>

      <div className="min-w-0 md:ml-[260px] md:flex-1">
        <header className="sticky top-0 z-20 hidden h-20 items-center justify-between border-b border-[#EADCCB] bg-white px-6 lg:px-10 md:flex">
          <Link
            className="text-sm font-semibold text-[#34271A] no-underline"
            to={activeSection.to}
          >
            {activeSection.label}
          </Link>
          <div className="flex items-center gap-5">
            <Link
              aria-label="Notifications"
              className="grid size-10 place-items-center rounded-xl border border-[#EADCCB] text-[#34271A] hover:bg-[#FBF8F3]"
              to="/dashboard/notifications"
            >
              <Bell aria-hidden="true" className="size-5" />
            </Link>
            <details className="relative" ref={profileMenuRef}>
              <summary className="flex cursor-pointer list-none items-center gap-3 text-sm font-semibold text-[#34271A]">
                <span className="grid size-10 place-items-center rounded-full bg-[#B8F2D9] text-sm font-bold text-[#07583B]">
                  {studentInitials(student?.name)}
                </span>
                <span>
                  <span className="block">{studentName}</span>
                  <span className="mt-0.5 block text-xs font-normal text-[#9A8874]">
                    Student
                  </span>
                </span>
              </summary>
              <nav className="absolute right-0 top-12 z-40 min-w-52 rounded-xl border border-[#EADCCB] bg-white p-2 shadow-lg">
                {navigation.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#6B5D4D] no-underline hover:bg-[#FBF8F3]"
                    key={to}
                    to={to}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {label}
                  </NavLink>
                ))}
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#6B5D4D] hover:bg-[#FBF8F3]"
                  onClick={logout}
                  type="button"
                >
                  <LogOut aria-hidden="true" className="size-4" />
                  Log out
                </button>
              </nav>
            </details>
          </div>
        </header>

        <main className="min-h-screen min-w-0 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 md:pb-8">
          {notice && (
            <p className="mb-5 text-sm text-[#75685A]" role="status">
              {notice}
            </p>
          )}
          <Outlet context={{ student, setStudent } satisfies PortalContext} />
        </main>
      </div>

      <nav
        aria-label="Mobile bottom navigation"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-[#EADCCB] bg-white/95 p-2 backdrop-blur md:hidden"
      >
        {navigation.slice(0, 4).map(({ to, label, icon: Icon, end }) => (
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-medium no-underline ${isActive ? "text-[#8A5A16]" : "text-[#75685A]"}`
            }
            end={end}
            key={to}
            to={to}
          >
            <Icon aria-hidden="true" className="size-5" />
            {label === "Student ID" ? "ID" : label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
