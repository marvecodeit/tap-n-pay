import { useState } from "react";
import {
  ArrowLeftRight,
  ArrowUpRight,
  CreditCard,
  Eye,
  EyeOff,
  Plus,
  Send,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatKobo } from "@tapnpay/ui";
import { TransactionList } from "../components/TransactionList";
import { usePortal } from "../portal/PortalShared";

type DashboardAction = {
  label: string;
  description: string;
  icon: LucideIcon;
  path?: string;
  unavailableMessage?: string;
};

const actions: DashboardAction[] = [
  {
    label: "My ID Card",
    description: "View your student ID",
    icon: CreditCard,
    path: "/dashboard/card",
  },
  {
    label: "Transfer to Friends",
    description: "Send money to other students",
    icon: Send,
    path: "/dashboard/transfer",
  },
  {
    label: "Wallet",
    description: "Manage your funds",
    icon: WalletCards,
    path: "/dashboard/wallet",
  },
];

const weeklySpending = [38, 64, 48, 78, 52, 88, 66];
const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

export function DashboardPage() {
  const { student } = usePortal();
  const navigate = useNavigate();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const studentName = student?.name || "Daniel Okafor";
  const balanceKobo = student?.balance ?? 4_825_000;
  const firstName = studentName.split(" ")[0];
  function runAction(action: DashboardAction) {
    if (action.path) {
      navigate(action.path);
      return;
    }
    setActionMessage(
      action.unavailableMessage || "This action is unavailable.",
    );
  }

  return (
    <div className="w-full space-y-8">
      <header>
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-[#8A5A16]">
            Wednesday, 19 February
          </span>
          <h1 className="mt-2 text-3xl font-bold text-[#34271A]">
            Good morning, {firstName}.
          </h1>
          <p className="mt-1 text-sm text-[#75685A]">
            Here’s what’s happening with your campus wallet.
          </p>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative isolate overflow-hidden rounded-2xl bg-[#8A5A16] p-6 text-white sm:p-8">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-wide text-[#F3D7AA]">
              Available balance
            </span>
            <button
              aria-label={balanceVisible ? "Hide balance" : "Show balance"}
              className="grid size-9 place-items-center rounded-lg text-white hover:bg-white/10"
              onClick={() => setBalanceVisible((visible) => !visible)}
              type="button"
            >
              {balanceVisible ? (
                <Eye aria-hidden="true" className="size-5" />
              ) : (
                <EyeOff aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>
          <p className="relative z-10 mt-6 text-4xl font-bold sm:text-5xl">
            {balanceVisible ? formatKobo(balanceKobo) : "₦••,•••.••"}
          </p>
          <div className="relative z-10 mt-8 flex flex-wrap gap-3">
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#D7A34F] px-4 py-2 text-sm font-semibold text-[#34271A] hover:bg-[#E2B665]"
              onClick={() => runAction(actions[2])}
              type="button"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add money
            </button>
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/80 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              onClick={() => runAction(actions[1])}
              type="button"
            >
              <Send aria-hidden="true" className="size-4" />
              Send
            </button>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -right-12 size-64 rounded-full border-[36px] border-white/5"
          />
        </div>

        <div className="rounded-2xl border border-[#EADCCB] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-[#8A5A16]">
                This month
              </span>
              <h2 className="mt-1 text-lg font-bold text-[#34271A]">
                Spending overview
              </h2>
            </div>
            <strong className="text-lg text-[#34271A]">₦24,680</strong>
          </div>
          <div
            aria-label="Weekly spending overview"
            className="mt-7 grid h-32 grid-cols-7 items-end gap-3"
            role="img"
          >
            {weeklySpending.map((height, index) => (
              <div
                className="flex h-full flex-col items-center justify-end gap-2"
                key={index}
              >
                <i
                  className={`block w-full max-w-8 rounded-t-md ${index === 5 ? "bg-[#D7A34F]" : "bg-[#EED9BD]"}`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs font-medium text-[#75685A]">
                  {weekdays[index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wide text-[#8A5A16]">
            Get things done
          </span>
          <h2 className="mt-1 text-xl font-bold text-[#34271A]">
            Quick actions
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map(({ label, description, icon: Icon, ...action }) => (
            <button
              className="flex min-h-28 flex-col items-start rounded-xl border border-[#F0E2CF] bg-[#F5E9D9] p-4 text-left transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-1 hover:border-[#D9B982] hover:bg-[#F0E1CD] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A5A16] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              key={label}
              onClick={() =>
                runAction({ label, description, icon: Icon, ...action })
              }
              type="button"
            >
              <span className="mb-3 grid size-10 shrink-0 place-items-center rounded-lg bg-[#F8EEDC] text-[#8A5A16]">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0">
                <strong className="block text-base font-bold text-[#34271A]">
                  {label}
                </strong>
                <small className="mt-1 block text-xs text-[#75685A]">
                  {description}
                </small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#EADCCB] bg-white p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-[#8A5A16]">
              Activity
            </span>
            <h2 className="mt-1 text-xl font-bold text-[#34271A]">
              Recent transactions
            </h2>
          </div>
          <button
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#07583B] hover:text-[#004A31]"
            onClick={() => navigate("/dashboard/transactions")}
            type="button"
          >
            View all
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </button>
        </div>
        <TransactionList
          limit={3}
          onTransactionClick={() => navigate("/dashboard/transactions")}
        />
      </section>

      {actionMessage && (
        <p className="text-sm text-[#75685A]" role="status">
          {actionMessage}
        </p>
      )}
    </div>
  );
}
