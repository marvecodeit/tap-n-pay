import { useEffect, useRef, useState } from "react";
import { QrCode, UserRoundPlus, WalletCards } from "lucide-react";

function HowItWorks() {
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
      id="how-it-works"
      className="bg-white px-5 py-16 text-[#34271A] sm:px-8 sm:py-20 lg:px-12"
    >
      <div className="mx-auto max-w-296">
        <header className="mx-auto mb-3 max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-[#EADCCB] bg-[#F8F0E5] px-3 py-1 text-xs font-bold tracking-wide text-[#8A5A16]">
            HOW IT WORKS
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            Three Steps, One Seamless Payment
          </h2>
        </header>

        <div
          ref={revealRef}
          className={`w-full ${isVisible ? "animate-[home-enter_800ms_ease-out_both]" : "translate-y-5 opacity-0"} motion-reduce:animate-none motion-reduce:translate-y-0 motion-reduce:opacity-100`}
        >
          <p className="mx-auto mb-12 mt-3 max-w-xl text-center text-base leading-relaxed text-[#75685A] sm:text-lg">
            Get set up in under two minutes with zero hardware requirements
            beyond your campus ID card.
          </p>
          <div className="grid min-h-[347.98px] w-full gap-5 text-left md:grid-cols-3">
            <article className="flex min-h-64 flex-col rounded-2xl border border-[#F0E7DE] bg-[#FAF5EF] p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#D9B982] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-[#F8F0E5] text-[#9A641B]">
                  <UserRoundPlus aria-hidden="true" className="size-5" />
                </span>
                <span className="text-3xl font-extrabold text-[#F0E7DE]">
                  01
                </span>
              </div>
              <h3 className="mt-6 text-lg font-bold">Create Your Account</h3>
              <p className="mt-2 text-base leading-relaxed text-[#75685A]">
                Register with your matric number and School email. Connect your
                physical student card to generate your encrypted personal wallet
                identity.
              </p>
              <p className="mt-auto border-t border-[#F3ECE5] pt-4 text-sm font-medium text-[#8A5A16]">
                Instant campus sync ›
              </p>
            </article>

            <article className="flex min-h-64 flex-col rounded-2xl border border-[#F0E7DE] bg-[#FAF5EF] p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#D9B982] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-[#F8F0E5] text-[#9A641B]">
                  <WalletCards aria-hidden="true" className="size-5" />
                </span>
                <span className="text-3xl font-extrabold text-[#F0E7DE]">
                  02
                </span>
              </div>
              <h3 className="mt-6 text-lg font-bold">Fund Your Wallet</h3>
              <p className="mt-2 text-base leading-relaxed text-[#75685A]">
                Top up via instant bank transfer, debit card, or USSD code. Zero
                deposit fees and immediate balance reflection so you are always
                lunch-ready.
              </p>
              <p className="mt-auto border-t border-[#F3ECE5] pt-4 text-sm font-medium text-[#8A5A16]">
                Free bank transfer top-up ›
              </p>
            </article>

            <article className="flex min-h-64 flex-col rounded-2xl border border-[#F0E7DE] bg-[#FAF5EF] p-6 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#D9B982] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-[#F8F0E5] text-[#9A641B]">
                  <QrCode aria-hidden="true" className="size-5" />
                </span>
                <span className="text-3xl font-extrabold text-[#F0E7DE]">
                  03
                </span>
              </div>
              <h3 className="mt-6 text-lg font-bold">Scan and Pay</h3>
              <p className="mt-2 text-base leading-relaxed text-[#75685A]">
                Present your student card QR code to any campus vendor terminal,
                or scan their QR using the mobile web app. Done in seconds.
              </p>
              <p className="mt-auto border-t border-[#F3ECE5] pt-4 text-sm font-medium text-[#8A5A16]">
                Offline-resilient fallback ›
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
