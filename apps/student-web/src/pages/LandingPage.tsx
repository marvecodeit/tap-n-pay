import { useState } from "react";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Terminal,
  ExternalLink,
  Receipt,
  WifiOff,
  UserCheck,
  Lock,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { formatKobo } from "@tapnpay/ui";

interface LandingPageProps {
  onOpenSignup: () => void;
  onLoginDemo: () => void;
}

export function LandingPage({ onOpenSignup, onLoginDemo }: LandingPageProps) {
  const [simulatedDebit, setSimulatedDebit] = useState(false);
  const [simBalanceKobo, setSimBalanceKobo] = useState(150000); // ₦1,500.00

  const handleTestTap = () => {
    if (simBalanceKobo >= 50000) {
      setSimBalanceKobo((prev) => prev - 50000); // ₦500 meal
      setSimulatedDebit(true);
      setTimeout(() => setSimulatedDebit(false), 2500);
    } else {
      setSimBalanceKobo(150000); // reset
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md">
              TP
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
                TapNPay
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase">
                Campus Cafeteria Fast-Pay
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#speed-target"
              className="hover:text-white transition-colors"
            >
              The 7-Second Rule
            </a>
            <a
              href="#architecture"
              className="hover:text-white transition-colors"
            >
              Architecture
            </a>
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>POS Terminal Demo</span>
            </a>
            <a
              href="http://localhost:5175"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Admin HQ</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLoginDemo}
              className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              Log In
            </button>
            <button
              onClick={onOpenSignup}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-transform active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <span>Open Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Glow ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>
              Zero Network Dependency at Checkout • Powered by Paystack
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Skip the Cafeteria Queue. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
              Pay in Under 7 Seconds.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base leading-relaxed">
            Students top up their wallet in the web app, receive a card with a
            printed QR code, and tap at the cafeteria POS. No OTP, no PIN, and
            zero network delay.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenSignup}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-base shadow-xl shadow-emerald-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>Open Free Student Account</span>
            </button>

            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-base border border-slate-800 transition-colors flex items-center justify-center gap-2 shadow"
            >
              <Terminal className="w-5 h-5 text-indigo-400" />
              <span>Launch POS Terminal (Port 5174)</span>
            </a>
          </div>

          {/* Key Metrics Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                &lt; 5s
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-semibold">
                Average Checkout
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                100%
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-semibold">
                Offline Checkout Uptime
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">
                0 OTP
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-semibold">
                Zero Friction Tap
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                80mm
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-semibold">
                Instant Thermal Slip
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Card Simulation Preview */}
      <section className="py-12 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
              Interactive Hardware Simulation
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              The Card is Static Identity. The Server is the Wallet.
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Click the button below to test a live ₦500 cafeteria debit
              simulation:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* The Physical Card Token Mockup */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-6 rounded-3xl border border-indigo-800/50 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 block">
                    CAMPUS CAFETERIA CARD
                  </span>
                  <div className="text-lg font-black text-white">
                    John Okafor
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    STU-2026-001
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-sm shadow">
                  TP
                </div>
              </div>

              {/* QR Token */}
              <div className="bg-white p-3.5 rounded-2xl flex items-center gap-4 text-slate-900 mb-4">
                <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <div className="grid grid-cols-3 gap-1 p-1">
                    <div className="w-2 h-2 bg-white rounded-xs"></div>
                    <div className="w-2 h-2 bg-transparent"></div>
                    <div className="w-2 h-2 bg-white rounded-xs"></div>
                    <div className="w-2 h-2 bg-white rounded-xs"></div>
                    <div className="w-2 h-2 bg-white rounded-xs"></div>
                    <div className="w-2 h-2 bg-transparent"></div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    12-Char Card Token
                  </span>
                  <span className="font-mono font-bold text-base text-slate-900 tracking-wider">
                    CARD-A3F2-9K2
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs text-indigo-300 block">
                    Wallet Balance
                  </span>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    {formatKobo(simBalanceKobo)}
                  </div>
                </div>
                <button
                  onClick={handleTestTap}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs rounded-xl transition-all shadow"
                >
                  {simBalanceKobo < 50000
                    ? "Reset Balance"
                    : "Simulate ₦500 Tap"}
                </button>
              </div>
            </div>

            {/* Instant Terminal Response Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="font-mono text-xs text-slate-300">
                    POS-001 • Counter 1
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                  🟢 IndexedDB Sync Ready
                </span>
              </div>

              {simulatedDebit ? (
                <div className="text-center py-4 space-y-2 animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Payment Approved & Deducted!
                  </div>
                  <div className="text-3xl font-black font-mono text-white">
                    ₦500.00
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Meal Code:{" "}
                    <strong className="text-emerald-400">K7M2PQ</strong> (Slip
                    Printed)
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-2 text-slate-400">
                  <Smartphone className="w-10 h-10 text-slate-600 mx-auto" />
                  <div className="text-xs font-semibold text-slate-300">
                    Awaiting Checkout Scan
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    When student taps card, POS checks local balance in
                    IndexedDB and deducts instantly under 0.1 seconds.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* The 7-Second Rule Comparison Table */}
      <section id="speed-target" className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              The 7-Second Target
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Why Cafeteria Lines Move 10x Faster
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Eliminating the cloud roundtrip at checkout transforms cafeteria
              throughput.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase text-[11px] font-bold">
                    <th className="py-4 px-6">Payment Method</th>
                    <th className="py-4 px-6">Checkout Time</th>
                    <th className="py-4 px-6">Network Dependency</th>
                    <th className="py-4 px-6">Failure Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-4 px-6 font-bold text-red-400">
                      USSD / Bank Transfer
                    </td>
                    <td className="py-4 px-6 font-mono text-red-400">
                      60s – 300s
                    </td>
                    <td className="py-4 px-6 text-red-400">100% Dependent</td>
                    <td className="py-4 px-6 text-xs text-slate-400">
                      Bank downtime, fake alert scams, manual screenshot checks
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-bold text-amber-400">
                      Standard Bank POS
                    </td>
                    <td className="py-4 px-6 font-mono text-amber-400">
                      30s – 60s
                    </td>
                    <td className="py-4 px-6 text-amber-400">100% Dependent</td>
                    <td className="py-4 px-6 text-xs text-slate-400">
                      SIM network latency, PIN entry, declined network errors
                    </td>
                  </tr>
                  <tr className="bg-emerald-950/20 font-semibold">
                    <td className="py-4 px-6 font-black text-emerald-400 flex items-center gap-2">
                      <Zap className="w-4 h-4 fill-current text-emerald-400" />
                      <span>TapNPay QR</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-emerald-400 font-black text-base">
                      &lt; 5s Total
                    </td>
                    <td className="py-4 px-6 text-emerald-300 font-bold">
                      ZERO (Works Offline)
                    </td>
                    <td className="py-4 px-6 text-xs text-emerald-200/80">
                      Local balance cache, auto-reconciled in background
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-16 px-4 sm:px-6 bg-slate-900/30 border-t border-slate-800/80"
      >
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              How TapNPay Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-black text-xl">
                1
              </div>
              <h3 className="font-bold text-base text-white">
                Top Up via Paystack
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Open your student web app from any phone. Deposit money via
                Paystack cards or bank transfers directly into your campus
                cafeteria wallet.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-black text-xl">
                2
              </div>
              <h3 className="font-bold text-base text-white">
                Get Your QR Token Card
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your account comes with a random 12-char static ID token printed
                on a laminated physical card. No balance is stored on the card
                itself.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-600/20 text-teal-400 flex items-center justify-center font-black text-xl">
                3
              </div>
              <h3 className="font-bold text-base text-white">
                Tap & Dine in 7s
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cashier enters the meal price, you tap your card on the scanner,
                and the 80mm meal ticket prints immediately. Collect food and
                enjoy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-8 sm:p-12 rounded-3xl border border-indigo-700/50 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Speed Up Your Campus Meals?
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto">
            Create your student wallet account in seconds or test the cashier
            POS checkout terminal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenSignup}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-base shadow-xl shadow-emerald-500/25 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Sign Up / Open Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLoginDemo}
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-base transition-colors"
            >
              Enter Demo Account (John Okafor)
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              TP
            </div>
            <span className="font-bold text-slate-400">
              TapNPay Core v0.1.0
            </span>
          </div>
          <div>
            Built with React, Vite, Workbox PWA, Tailwind CSS, FastAPI, and
            Paystack.
          </div>
          <div className="flex gap-4">
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              Terminal POS
            </a>
            <a
              href="http://localhost:5175"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              Admin HQ
            </a>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              API Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
