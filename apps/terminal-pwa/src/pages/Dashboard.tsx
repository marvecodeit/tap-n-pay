import { useEffect, useState } from "react";
import {
  Clock3,
  CreditCard,
  History as HistoryIcon,
  Smartphone,
  ShieldCheck,
  Store,
  UserRound,
  WalletCards,
  Wifi,
} from "lucide-react";
import { Checkout } from "./Checkout";
import { BalanceCheck } from "./BalanceCheck";
import { History } from "./History";
import { getCard, saveCardsBatch } from "../db/balances";
import {
  getRecentTransactions,
  seedFailedDemoTransactions,
} from "../db/transactions";
import {
  getSyncState,
  getTerminalConfig,
  setSyncState,
  type TerminalConfig,
} from "../db/syncState";
import { demoCards } from "../data/demoCards";
import type { Transaction } from "@tapnpay/api-client";

type Tab = "checkout" | "balance" | "history";

const navigation: {
  id: Tab;
  label: string;
  icon: typeof CreditCard;
}[] = [
  { id: "checkout", label: "Checkout", icon: CreditCard },
  { id: "balance", label: "Balance check", icon: WalletCards },
  { id: "history", label: "Transactions", icon: HistoryIcon },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("checkout");
  const [config, setConfig] = useState<TerminalConfig | null>(null);
  const [clock, setClock] = useState(() => new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [storageError, setStorageError] = useState("");

  async function refreshTransactions() {
    setTransactions(await getRecentTransactions());
  }

  const renderNavigation = (compact = false) =>
    navigation.map(({ id, label, icon: Icon }) => {
      const isActive = activeTab === id;
      return (
        <button
          aria-current={isActive ? "page" : undefined}
          className={`flex min-h-11 items-center gap-3 rounded-xl text-[13px] font-semibold transition-colors ${
            compact
              ? "flex-1 justify-center whitespace-nowrap px-3"
              : "w-full px-4"
          } ${
            isActive
              ? compact
                ? "bg-[#D4A359] text-[#231B12] shadow-sm"
                : "bg-[#95601D] text-white shadow-sm"
              : compact
                ? "text-[#75685A] hover:bg-[#F0E7D8] hover:text-[#231B12]"
                : "text-[#C5B9A8] hover:bg-[#30261A] hover:text-white"
          }`}
          key={id}
          onClick={() => setActiveTab(id)}
          type="button"
        >
          <Icon aria-hidden="true" className="size-4 shrink-0" />
          {label}
          {id === "history" && transactions.length > 0 && (
            <span className="rounded-full bg-[#F3E9D9] px-2 py-0.5 text-xs text-[#76501D]">
              {transactions.length}
            </span>
          )}
        </button>
      );
    });

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const missingCards = [];
        const demoBalanceUpdated = await getSyncState(
          "demo_balance_500000_migrated",
          false,
        );
        for (const card of demoCards) {
          const savedCard = await getCard(card.card_id);
          // Demo balances are disposable test data; recover cards made negative
          // by earlier versions that allowed a checkout to overdraw them.
          if (
            !savedCard ||
            savedCard.balance < 0 ||
            (card.card_id === demoCards[0].card_id && !demoBalanceUpdated)
          ) {
            missingCards.push(card);
          } else if (
            savedCard.student_id !== card.student_id ||
            savedCard.student_name !== card.student_name
          ) {
            missingCards.push({
              ...savedCard,
              student_id: card.student_id,
              student_name: card.student_name,
            });
          }
        }
        if (missingCards.length > 0) await saveCardsBatch(missingCards);
        if (!demoBalanceUpdated) {
          await setSyncState("demo_balance_500000_migrated", true);
        }
        const terminalConfig = await getTerminalConfig();
        await seedFailedDemoTransactions(
          demoCards,
          terminalConfig.terminal_id,
          terminalConfig.cashier_id,
        );
        const recentTransactions = await getRecentTransactions();
        if (active) {
          setConfig(terminalConfig);
          setTransactions(recentTransactions);
        }
      } catch (error) {
        if (active) {
          setStorageError(
            error instanceof Error
              ? error.message
              : "Could not open this terminal's local demo data.",
          );
        }
      }
    }

    void initialize();
    const timer = window.setInterval(() => setClock(new Date()), 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#231B12]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-[#392D20] bg-[#241B10] px-4 py-5 text-white lg:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#95601D] text-white">
            <Smartphone aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="font-sora text-lg font-bold tracking-tight text-white">
              TapNPay
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#D8CCBA]">
              Cashier terminal
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="px-3 text-xs font-medium uppercase tracking-[0.16em] text-[#A9987F]">
            Terminal
          </p>
          <nav
            aria-label="Terminal sections"
            className="mt-3 flex flex-col gap-1.5"
          >
            {renderNavigation()}
          </nav>
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-3 rounded-xl border border-[#493B2C] bg-[#30261A] px-3 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#49371F] text-[#D4A359]">
              <Wifi aria-hidden="true" className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-white">
                Card scanner
              </span>
              <span className="mt-0.5 block text-xs text-[#B6A993]">
                Connected
              </span>
            </span>
            <span
              aria-label="Connected"
              className="size-2 rounded-full bg-[#20A36B] motion-safe:animate-pulse"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wide text-[#887A66]">
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            PCI DSS secure terminal
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-56">
        <header className="border-b border-[#E8DDCB] bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#75685A]">
                Campus {config?.cafeteria_name || "Central Cafeteria"}
              </p>
              <p className="mt-0.5 font-sora text-xl font-medium text-[#231B12]">
                {navigation.find(({ id }) => id === activeTab)?.label}
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-2 text-[#8C5E1E]">
                <Clock3 aria-hidden="true" className="size-4 shrink-0" />
                <time dateTime={clock.toISOString()}>
                  <span className="block text-right text-sm font-semibold leading-tight text-[#231B12]">
                    {clock.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hourCycle: "h23",
                    })}
                  </span>
                  <span className="block text-right text-xs leading-tight text-[#8B8072]">
                    {clock.toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </time>
              </div>
              <span aria-hidden="true" className="h-8 w-px bg-[#E8DDCB]" />
              <div className="flex items-center gap-2">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-[#E8D5B6] bg-[#8C5E1E] text-xs font-bold text-white">
                  {config?.cashier_name
                    .split(/\s+/)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "CA"}
                </span>
                <span className="hidden sm:block">
                  <span className="block text-sm font-semibold leading-tight text-[#231B12]">
                    {config?.cashier_name || "Cashier A"}
                  </span>
                  <span className="block text-xs leading-tight text-[#8B8072]">
                    Cashier · Terminal {config?.terminal_id || "POS-001"}
                  </span>
                </span>
                <span className="sr-only">
                  {config?.cashier_name || "Cashier A"}, terminal{" "}
                  {config?.terminal_id || "POS-001"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <nav
          aria-label="Terminal sections"
          className="flex gap-1 overflow-x-auto border-b border-[#E8DDCB] bg-[#F8F5EF] p-3 lg:hidden"
        >
          {renderNavigation(true)}
        </nav>

        <main className="mx-auto w-full max-w-[1400px] px-2 pb-5 pt-4 sm:px-2 sm:pt-10">
          {storageError && (
            <div
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              Local terminal data is unavailable: {storageError}
            </div>
          )}

          {activeTab === "checkout" && (
            <Checkout
              onTransactionComplete={refreshTransactions}
              onViewHistory={() => setActiveTab("history")}
            />
          )}
          {activeTab === "balance" && (
            <BalanceCheck onBack={() => setActiveTab("checkout")} />
          )}
          {activeTab === "history" && (
            <History
              transactions={transactions}
              onRefresh={refreshTransactions}
            />
          )}

          <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#E8DDCB] pt-3 text-xs text-[#8B8072]">
            <span>
              {config?.terminal_id || "POS-001"} · Local demo terminal
            </span>
            <span className="inline-flex items-center gap-2">
              <Store aria-hidden="true" className="size-4" />
              {config?.cafeteria_name || "Campus vendor"}
              <span className="mx-1">·</span>
              <UserRound aria-hidden="true" className="size-4" />
              {config?.cashier_name || "Cashier"}
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
