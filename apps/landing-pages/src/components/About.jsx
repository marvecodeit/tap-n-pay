import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, QrCode, Wallet } from "lucide-react";

const campusFeatures = [
  {
    title: "QR Code Card Payments",
    description: "Scan your personal card to pay for meals.",
    icon: QrCode,
  },
  {
    title: "Easy Wallet Management",
    description: "Fund your wallet and monitor your balance.",
    icon: Wallet,
  },
  {
    title: "Transfer to Friends",
    description: "Send money to other registered students easily.",
    icon: ArrowLeftRight,
  },
];

const campusMetrics = [
  { target: 30, suffix: "s", prefix: "< ", label: "Average Cafeteria Queue" },
  { target: 100, suffix: "%", label: "Cashless Campus Convenience" },
  { target: 99.98, suffix: "%", decimals: 2, label: "Uptime Guarantee" },
];

function About() {
  const revealRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [metricValues, setMetricValues] = useState(campusMetrics.map(() => 0));

  useEffect(() => {
    const content = revealRef.current;
    if (!content) return undefined;

    let animationFrame;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);
        observer.disconnect();

        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (prefersReducedMotion) {
          setMetricValues(campusMetrics.map((metric) => metric.target));
          return;
        }

        const startTime = performance.now();
        const duration = 1400;

        function animateMetrics(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const easedProgress = 1 - (1 - progress) ** 3;
          setMetricValues(
            campusMetrics.map((metric) => metric.target * easedProgress),
          );

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animateMetrics);
          }
        }

        animationFrame = requestAnimationFrame(animateMetrics);
      },
      { threshold: 0.2 },
    );

    observer.observe(content);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section
      id="about"
      className="scroll-mt-24 flex min-h-[734px] items-center border-y border-[#EADDCF]/50 bg-white px-6 py-12 text-[#221911] sm:px-8 sm:py-16 lg:px-12 lg:py-[113px]"
    >
      <div
        ref={revealRef}
        className={`mx-auto grid w-full max-w-[1184px] grid-cols-1 items-center gap-12 lg:grid-cols-2 ${isVisible ? "animate-[home-enter_800ms_ease-out_both]" : "translate-y-5 opacity-0"} motion-reduce:animate-none motion-reduce:translate-y-0 motion-reduce:opacity-100`}
      >
        <div>
          <span className="inline-flex rounded-full border border-[#EADDCF]/80 bg-[#F7EFE4] px-[15px] py-[5px] text-[11px] font-bold uppercase leading-[14px] tracking-[0.55px] text-[#8C5E1E]">
            About TapNPay
          </span>

          <h2 className="mt-3 max-w-[568px] text-3xl font-extrabold leading-tight text-[#221911] sm:text-4xl">
            Connecting Campus
            <br />
            Life Through
            <br />
            Seamless Payments.
          </h2>

          <p className="mt-4 max-w-[568px] text-base leading-relaxed text-[#75685A] sm:text-lg">
            TapNPay was born from the everyday challenges of campus life, where
            a lack of change and slow POS transactions often leave students
            waiting instead of making the most of their short breaks between
            lectures.
          </p>
          <p className="mt-4 max-w-[568px] text-base leading-relaxed text-[#75685A]">
            We’re building a smarter, more connected campus payment experience
            through a localized micropayment ledger, physical student badges,
            and fast QR-code scanning. By bringing students and campus merchants
            together through simple, seamless transactions, TapNPay aims to make
            everyday payments faster, easier, and more convenient across
            Nigerian tertiary institutions.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[#EADDCF] pt-[18px]">
            {campusMetrics.map((metric, index) => (
              <div key={metric.label}>
                <p className="whitespace-nowrap text-[clamp(24px,3vw,34px)] font-extrabold leading-[51px] text-[#8C5E1E]">
                  {metric.prefix ?? ""}
                  {metricValues[index].toFixed(metric.decimals ?? 0)}
                  {metric.suffix}
                </p>
                <p className="max-w-[150px] text-xs leading-[18px] text-[#6A5E52]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative self-center overflow-hidden rounded-[30px] border border-[#EADDCF] bg-[#F7EFE4] px-9 shadow-[0_18px_48px_rgba(94,65,32,0.08)] sm:px-9">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 -top-24 size-48 rounded-full border-[34px] border-[#F1E3CD] sm:-right-16"
          />
          {campusFeatures.map(({ title, description, icon: Icon }, index) => (
            <article
              className={`relative flex min-h-[144px] items-center gap-5 py-5 ${index < campusFeatures.length - 1 ? "border-b border-[#E5D4BE]" : ""}`}
              key={title}
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-[18px] bg-white text-[#98621E] shadow-[0_8px_18px_rgba(73,50,25,0.06)]">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold leading-6 text-[#221911]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-5 text-[#75685A]">
                  {description}
                </p>
              </div>
              <span className="self-start pt-1 text-xs italic text-[#B78A52]">
                0{index + 1}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
