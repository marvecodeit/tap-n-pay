import { useEffect, useRef, useState } from "react";
import {
  ChartNoAxesColumnIncreasing,
  QrCode,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

function Features() {
  const revealRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function revealOnScroll() {
      const revealContent = revealRef.current;
      if (
        !revealContent ||
        revealContent.getBoundingClientRect().top > window.innerHeight * 0.8
      ) {
        return;
      }

      setIsVisible(true);
      window.removeEventListener("scroll", revealOnScroll);
    }

    window.addEventListener("scroll", revealOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <section
      id="features"
      className="scroll-mt-24 min-h-[700px] bg-[#F8F3EC] px-5 py-16 text-[#34271A] sm:px-8 sm:py-20 lg:px-12"
    >
      <div
        ref={revealRef}
        className={`mx-auto w-full max-w-296 ${isVisible ? "animate-[home-enter_800ms_ease-out_both]" : "translate-y-5 opacity-0"} motion-reduce:animate-none motion-reduce:translate-y-0 motion-reduce:opacity-100`}
      >
        <header className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex rounded-full border border-[#EADCCB] bg-white px-3 py-1 text-sm font-bold tracking-wide text-[#8A5A16]">
              WHY TAPNPAY?
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              Everything You Need on Campus
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#75685A]">
              More than just payments. TapNPay gives you total control,
              opportunities, tracking, and trusted security.
            </p>
          </div>
          <span className="flex items-center gap-3 text-sm font-bold tracking-wide text-[#8A5A16]">
            BUILT FOR CAMPUS
            <span className="h-px w-10 bg-[#C88A2A]" />
          </span>
        </header>

        <div className="grid h-full gap-10 sm:grid-cols-2 lg:grid-cols-[repeat(4,278px)]">
          <article className="flex min-h-80 w-full flex-col rounded-2xl border border-[#F0E7DE] bg-white p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#D9B982] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-[298px]">
            <span className="grid size-10 place-items-center rounded-xl bg-[#F8F0E5] text-[#9A641B]">
              <QrCode aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold">QR Code Payments</h3>
            <p className="mt-2 text-base leading-relaxed text-[#75685A]">
              Use your unique printed TapNPay badge or scan merchant desk
              barcodes. Zero typing of 10-digit bank account numbers.
            </p>
            <p className="mt-auto pt-4 text-sm font-semibold text-[#8A5A16]">
              •&nbsp; Zero network lag delays
            </p>
          </article>

          <article className="flex min-h-80 w-full flex-col rounded-2xl border border-[#F0E7DE] bg-white p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#D9B982] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-[298px]">
            <span className="grid size-10 place-items-center rounded-xl bg-[#F8F0E5] text-[#9A641B]">
              <WalletCards aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold">Digital Wallet</h3>
            <p className="mt-2 text-base leading-relaxed text-[#75685A]">
              View your available funds at a glance. Set spending caps, automate
              allowances from home, and never get stranded at lunchtime.
            </p>
            <p className="mt-auto pt-4 text-sm font-semibold text-[#8A5A16]">
              •&nbsp; Auto-budgeting tools
            </p>
          </article>

          <article className="flex min-h-80 w-full flex-col rounded-2xl border border-[#F0E7DE] bg-white p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#D9B982] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-[298px]">
            <span className="grid size-10 place-items-center rounded-xl bg-[#F8F0E5] text-[#9A641B]">
              <ChartNoAxesColumnIncreasing
                aria-hidden="true"
                className="size-5"
              />
            </span>
            <h3 className="mt-4 text-lg font-bold">Transaction History</h3>
            <p className="mt-2 text-base leading-relaxed text-[#75685A]">
              Categorized logs of dining, printing, shuttle, and faculty
              association dues. Export receipts anytime for family reporting.
            </p>
            <p className="mt-auto pt-4 text-sm font-semibold text-[#8A5A16]">
              •&nbsp; Instant receipt PDF download
            </p>
          </article>

          <article className="flex min-h-80 w-full flex-col rounded-2xl border border-[#F0E7DE] bg-white p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#D9B982] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-[298px]">
            <span className="grid size-10 place-items-center rounded-xl bg-[#F8F0E5] text-[#9A641B]">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold">Secure Payments</h3>
            <p className="mt-2 text-base leading-relaxed text-[#75685A]">
              Transactions are cryptographically validated by school backend
              servers before balances debits occur. Lost card? Freeze it in 1
              click.
            </p>
            <p className="mt-auto pt-4 text-sm font-semibold text-[#8A5A16]">
              •&nbsp; One-tap card lock protection
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Features;
