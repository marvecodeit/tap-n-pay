import { useState } from "react";
import {
  ArrowRight,
  Bell,
  Bolt,
  Check,
  CircleCheck,
  Eye,
  History,
  Play,
  Plus,
  QrCode,
  ShieldCheck,
  Utensils,
  WalletCards,
} from "lucide-react";
import { sendStudentAction } from "../studentBridge.js";

function Home() {
  const [simulatedDebit, setSimulatedDebit] = useState(false);
  const [simBalanceKobo, setSimBalanceKobo] = useState(150000);

  function handleTestTap() {
    if (simBalanceKobo >= 50000) {
      setSimBalanceKobo((balance) => balance - 50000);
      setSimulatedDebit(true);
      setTimeout(() => setSimulatedDebit(false), 2500);
    } else {
      setSimBalanceKobo(150000);
    }
  }

  return (
    <main
      id="home"
      className="min-h-[801px] bg-[#F8F3EC] px-5 py-12 text-[#34271A] sm:px-8 sm:py-16 lg:px-12 border-b border-[#EADCCB]"
    >
      <section className="mx-auto grid max-w-[1600px] items-center gap-14 lg:grid-cols-2">
        <div className="animate-[home-enter_800ms_ease-out_both] motion-reduce:animate-none">
          <div className="   mb-8 inline-flex items-center gap-3 rounded-full border border-[#EADCCB] bg-white px-5 py-2 text-sm font-bold tracking-wide text-[#8A5A16]">
            <span className="size-2.5 rounded-full bg-[#8A5A16]" />
            SMART CAMPUS PAYMENT SYSTEM
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            Campus Payments,
            <br />
            <span className="relative inline-block pb-3 text-[#A66B1C]">
              Made Simple.
              <svg
                aria-hidden="true"
                className="absolute -bottom-1 left-[18%] h-3 w-[82%]"
                viewBox="0 0 320 18"
                preserveAspectRatio="none"
              >
                <path
                  d="M5 12 C75 6, 145 8, 205 10 S275 14, 315 8"
                  fill="none"
                  stroke="#E5B452"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#75685A] sm:text-xl">
            Say goodbye to cash hassles, failed transfers, and long cafeteria
            queues. TapNPay makes campus micropayments instant, reliable, and
            effortless. Fund your wallet once, tap your printed student card QR,
            and pay in under 2 seconds.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              onClick={(event) => {
                if (sendStudentAction("signup")) event.preventDefault();
              }}
              className="inline-flex items-center gap-3 rounded-full bg-[#8A5A16] px-7 py-4 text-lg font-semibold text-white no-underline shadow-[0_8px_18px_rgba(110,70,20,0.2)] transition-colors hover:bg-[#70470F]"
              href="#contact"
            >
              Get Started <ArrowRight aria-hidden="true" className="size-5" />
            </a>
            <a
              className="inline-flex items-center gap-3 rounded-full border border-[#EADCCB] bg-white px-7 py-4 text-lg font-semibold text-[#34271A] no-underline transition-colors hover:bg-[#FBF8F3]"
              href="#how-it-works"
            >
              <Play aria-hidden="true" className="size-5 text-[#A66B1C]" />
              See How It Works
            </a>
          </div>

          <div className="mt-12 mr-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-[#EADCCB] bg-white p-6 ">
              <Bolt
                aria-hidden="true"
                className="mb-4 size-10 rounded-xl bg-[#F8F0E5] p-2 text-[#A66B1C]"
              />
              <h2 className="text-lg font-bold">Fast</h2>
              <p className="mt-1 text-[#75685A]">Under 2-second scan pay</p>
            </article>
            <article className="rounded-2xl border border-[#EADCCB] bg-white p-6">
              <CircleCheck
                aria-hidden="true"
                className="mb-4 size-10 rounded-xl bg-[#F8F0E5] p-2 text-[#A66B1C]"
              />
              <h2 className="text-lg font-bold">Simple</h2>
              <p className="mt-1 text-[#75685A]">One-tap balance</p>
            </article>
            <article className="rounded-2xl border border-[#EADCCB] bg-white p-6">
              <ShieldCheck
                aria-hidden="true"
                className="mb-4 size-10 rounded-xl bg-[#F8F0E5] p-2 text-[#A66B1C]"
              />
              <h2 className="text-lg font-bold">Secure</h2>
            </article>
          </div>
        </div>

        <aside
          aria-label="TapNPay digital wallet preview"
          className="relative  ml-90 mx-auto w-full max-w-[460px] pb-14 pt-10 sm:pb-16"
        >
          <div className="relative mx-auto w-[min(100%,390px)] rounded-[3.5rem] border-[8px] border-[#EADCCB] bg-white p-3 shadow-[0_24px_60px_rgba(110,70,20,0.18)]">
            <div className="absolute left-1/2 top-3 z-10 h-4 w-24 -translate-x-1/2 " />
            <div className="rounded-[2.7rem] bg-[#342218] px-4 pb-5 pt-10 text-white sm:px-5">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-[#F3B965] font-bold text-[#342218]">
                  AJ
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Ariyo James</p>
                  <p className="text-sm text-[#E5B452]">AUL/CPM/23/088</p>
                </div>
                <span className="grid size-10 place-items-center rounded-full bg-white/10">
                  <Bell aria-hidden="true" className="size-5" />
                </span>
              </div>

              <div className="mt-5 rounded-3xl bg-white p-5 text-[#34433B]">
                <div className="flex items-center justify-between text-xs font-bold tracking-wide">
                  AVAILABLE BALANCE
                  <Eye aria-hidden="true" className="size-5 text-[#8A5A16]" />
                </div>
                <div className="mt-1 flex items-baseline">
                  <span className="text-4xl font-extrabold text-[#8A5A16]">
                    ₦{(simBalanceKobo / 100).toLocaleString("en-NG")}.00
                  </span>
                  <span className="ml-auto rounded-full bg-[#F8F0E5] px-3 py-1 text-xs font-bold text-[#8A5A16]">
                    Active
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-[#8A5A16]" />
                    Anchor University
                  </span>
                  <span className="flex items-center gap-1 font-bold text-[#8A5A16]">
                    <Plus className="size-4" /> Add Money
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 px-2 py-3 text-xs text-[#F3B965] transition-colors hover:bg-white/20"
                  onClick={handleTestTap}
                  type="button"
                >
                  <QrCode className="size-5" />
                  {simBalanceKobo < 50000 ? "Reset Balance" : "Pay Outlet"}
                </button>
                <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 px-2 py-3 text-xs text-[#F3B965]">
                  <WalletCards className="size-5" />
                  Top Up
                </div>
                <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 px-2 py-3 text-xs text-[#F3B965]">
                  <History className="size-5" />
                  History
                </div>
              </div>

              <div className="mt-4 rounded-3xl bg-[#F4F0EA] p-4 text-[#4D4033]">
                <div className="flex items-center justify-between text-xs font-bold tracking-wide">
                  RECENT OUTLETS
                  <span className="text-[#8A5A16]">VIEW ALL</span>
                </div>
                <div className="mt-4 flex  items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#F8F0E5] text-[#8A5A16]">
                    <Utensils className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1 text-xs font-medium">
                    Queen Idia Cafeteria
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    −₦1,200
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-[#F8F0E5] text-[#8A5A16]">
                    <WalletCards className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1 text-xs font-medium">
                    Campus Print Center
                  </span>
                  <span className="text-sm font-bold text-red-600">−₦350</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ rotate: "7deg" }}
            className="absolute right-0 top-1 flex max-w-[320px]  rotate-8 animate-wallet-bounce items-center gap-3 rounded-2xl border border-[#EADCCB] bg-white px-4 py-3 text-[#34271A] shadow-xl motion-reduce:animate-none sm:-right-2"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#8A5A16] text-white">
              <Check aria-hidden="true" className="size-6" />
            </span>
            <span className="text-xs leading-snug ">
              <strong className="block text-[#8A5A16]">
                {simulatedDebit ? "PAYMENT APPROVED!" : "SUCCESS!"}
              </strong>
              <strong className="block text-sm">
                {simulatedDebit
                  ? "₦500 deducted from your wallet"
                  : "Cafeteria Payment Confirmed"}
              </strong>
              {simulatedDebit
                ? "Balance updated · Instant settlement"
                : "₦1,200.00 · Instant Settlement"}
            </span>
          </div>

          <div
            style={{ rotate: "-5deg" }}
            className="absolute bottom-0 left-0 w-[min(82%,330px)] animate-wallet-bounce rounded-3xl border border-[#C88A2A] bg-[#8A5A16] p-4 text-white shadow-[0_18px_40px_rgba(0,0,0,0.25)] [animation-delay:1.5s] motion-reduce:animate-none sm:-left-8"
          >
            <div className="flex items-center justify-between border-b border-white/20 pb-2 font-bold">
              TapNPay <span className="text-[#F3B965]">●</span>
              <span className="rounded bg-white/15 px-2 py-1 text-[10px] tracking-wide">
                STUDENT ID
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="text-[10px] leading-relaxed text-[#F4DEC0]">
                CARDHOLDER
                <strong className="block text-sm text-white">
                  ARIYO JAMES
                </strong>
                DEPT OF COMPUTER SCIENCE
                <span className="mt-2 block">◉ NFC &amp; QR Link Enabled</span>
              </div>
              <QrCode
                aria-hidden="true"
                className="size-14 rounded-xl bg-white p-2 text-[#342218]"
              />
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Home;
