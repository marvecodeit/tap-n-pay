import { useState } from "react";
import { useEffect } from "react";
import { Home } from "./pages/Home";
import { TopUp } from "./pages/TopUp";
import { Receipts } from "./pages/Receipts";
import { ReportCard } from "./pages/ReportCard";
import { SignupModal } from "./components/SignupModal";
import { CardIssuedModal } from "./components/CardIssuedModal";
import type { Student, Transaction } from "@tapnpay/api-client";
import {
  Home as HomeIcon,
  PlusCircle,
  Receipt,
  ShieldCheck,
  LogOut,
  ArrowLeft,
} from "lucide-react";

type ViewMode = "landing" | "dashboard";
type DashboardTab = "home" | "topup" | "receipts" | "report";
const landingPagesUrl =
  import.meta.env.VITE_LANDING_PAGES_URL || "http://localhost:5176";
const landingPagesOrigin = new URL(landingPagesUrl).origin;

export function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");

  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isCardIssuedOpen, setIsCardIssuedOpen] = useState(false);

  useEffect(() => {
    function handleLandingAction(event: MessageEvent) {
      if (
        event.origin !== landingPagesOrigin ||
        event.data?.source !== "tapnpay-landing-pages"
      ) {
        return;
      }

      if (event.data.action === "signup") {
        setIsSignupOpen(true);
      }

      if (event.data.action === "login") {
        setViewMode("dashboard");
        setActiveTab("home");
      }
    }

    window.addEventListener("message", handleLandingAction);
    return () => window.removeEventListener("message", handleLandingAction);
  }, []);

  // Active student session
  const [student, setStudent] = useState<Student>({
    student_id: "STU-001",
    name: "John Okafor",
    email: "john.okafor@university.edu.ng",
    created_at: new Date().toISOString(),
    active_card_id: "CARD-A3F2-9K2",
    balance: 150000, // ₦1,500.00
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      txn_id: "txn-7f3a-9b2c",
      card_id: "CARD-A3F2-9K2",
      student_name: "John Okafor",
      amount: 150000,
      terminal_id: "POS-001",
      cashier_id: "c-001",
      created_at: new Date(Date.now() - 3600000).toISOString(),
      status: "SYNCED",
      verification_code: "K7M2PQ",
    },
  ]);

  const handleAccountCreated = (newStudent: Student) => {
    setStudent(newStudent);
    setIsSignupOpen(false);
    setIsCardIssuedOpen(true);
  };

  const handleProceedToDashboard = () => {
    setIsCardIssuedOpen(false);
    setViewMode("dashboard");
    setActiveTab("home");
  };

  const handleTopUpSuccess = (amountKobo: number) => {
    setStudent((prev) => ({
      ...prev,
      balance: (prev.balance || 0) + amountKobo,
    }));
    setActiveTab("home");
  };

  const handleBlockCard = async () => {
    setStudent((prev) => ({
      ...prev,
      active_card_id: `${prev.active_card_id} (BLOCKED)`,
    }));
  };

  // 1. Landing Page View
  if (viewMode === "landing") {
    return (
      <>
        <iframe
          title="TapNPay landing pages"
          src={landingPagesUrl}
          className="fixed inset-0 z-0 h-screen w-full border-0 bg-white"
        />

        <SignupModal
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
          onSuccess={handleAccountCreated}
        />

        <CardIssuedModal
          student={student}
          isOpen={isCardIssuedOpen}
          onProceed={handleProceedToDashboard}
        />
      </>
    );
  }

  // 2. Student Wallet Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-30 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setViewMode("landing")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Return to Landing Page"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
              TP
            </div>
            <div className="text-left">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 block leading-tight">
                TapNPay
              </span>
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                <ArrowLeft className="w-2.5 h-2.5" /> Back to Home
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Active</span>
            </div>
            <button
              onClick={() => setViewMode("landing")}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-md mx-auto w-full pb-20">
        {activeTab === "home" && (
          <Home
            student={student}
            recentTxns={transactions}
            onNavigate={setActiveTab}
          />
        )}
        {activeTab === "topup" && (
          <TopUp
            student={student}
            onSuccess={handleTopUpSuccess}
            onBack={() => setActiveTab("home")}
          />
        )}
        {activeTab === "receipts" && (
          <Receipts
            transactions={transactions}
            onBack={() => setActiveTab("home")}
          />
        )}
        {activeTab === "report" && (
          <ReportCard
            student={student}
            onBlockCard={handleBlockCard}
            onBack={() => setActiveTab("home")}
          />
        )}
      </main>

      {/* Bottom Bar */}
      <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200 p-2 fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
              activeTab === "home"
                ? "bg-indigo-50 text-indigo-600 font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <HomeIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Home</span>
          </button>

          <button
            onClick={() => setActiveTab("topup")}
            className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
              activeTab === "topup"
                ? "bg-indigo-50 text-indigo-600 font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <PlusCircle className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Top Up</span>
          </button>

          <button
            onClick={() => setActiveTab("receipts")}
            className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
              activeTab === "receipts"
                ? "bg-indigo-50 text-indigo-600 font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Receipt className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Receipts</span>
          </button>

          <button
            onClick={() => setActiveTab("report")}
            className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
              activeTab === "report"
                ? "bg-indigo-50 text-indigo-600 font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Security</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
