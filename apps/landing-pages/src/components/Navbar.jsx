import { sendStudentAction } from "../studentBridge.js";

const qrFinderOrigins = [
  [0, 0],
  [0, 14],
  [14, 0],
];

const qrModules = Array.from({ length: 21 }, (_, row) =>
  Array.from({ length: 21 }, (_, column) => {
    for (const [finderRow, finderColumn] of qrFinderOrigins) {
      const localRow = row - finderRow;
      const localColumn = column - finderColumn;

      if (
        localRow >= 0 &&
        localRow < 7 &&
        localColumn >= 0 &&
        localColumn < 7
      ) {
        return (
          localRow === 0 ||
          localRow === 6 ||
          localColumn === 0 ||
          localColumn === 6 ||
          (localRow >= 2 &&
            localRow <= 4 &&
            localColumn >= 2 &&
            localColumn <= 4)
        );
      }

      if (
        row >= finderRow - 1 &&
        row <= finderRow + 7 &&
        column >= finderColumn - 1 &&
        column <= finderColumn + 7
      ) {
        return false;
      }
    }

    return (row * 17 + column * 31 + row * column * 7) % 23 < 11;
  }),
);

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white px-5 py-3 text-[#6B5D4D] shadow-sm sm:px-8 lg:px-12">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-x-6 gap-y-4"
      >
        <a
          href="#home"
          className="flex items-center gap-2 text-[#201D19] no-underline"
        >
          <svg
            aria-hidden="true"
            className="size-12 shrink-0 sm:size-14"
            viewBox="0 0 64 64"
            fill="none"
          >
            <defs>
              <linearGradient
                id="card-gold"
                x1="8"
                y1="4"
                x2="58"
                y2="60"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#8E601D" />
                <stop offset="1" stopColor="#E6B75E" />
              </linearGradient>
              <linearGradient
                id="card-light"
                x1="38"
                y1="20"
                x2="60"
                y2="58"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F1CE7D" />
                <stop offset="1" stopColor="#DDAA4C" />
              </linearGradient>
              <linearGradient
                id="card-shadow"
                x1="8"
                y1="16"
                x2="34"
                y2="58"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#89601F" />
                <stop offset="1" stopColor="#704B18" />
              </linearGradient>
              <clipPath id="card-clip">
                <rect x="2" y="2" width="60" height="60" rx="12" />
              </clipPath>
            </defs>
            <g clipPath="url(#card-clip)">
              <rect x="2" y="2" width="60" height="60" fill="url(#card-gold)" />
              <path
                d="M42 17C28 25 16 39 20 62H2V2h60v11l-20 4Z"
                fill="url(#card-shadow)"
              />
              <path
                d="M42 17C28 25 16 39 20 62h42V13l-20 4Z"
                fill="url(#card-light)"
              />
              <path
                d="M13 10h39l-2.8 7H10.2L13 10Z"
                fill="#684516"
                fillOpacity=".88"
                filter="drop-shadow(0 1px 1px #704B18)"
              />
              <path
                d="M42 17C28 25 16 39 20 62"
                stroke="#FFF0C8"
                strokeWidth="3.5"
              />
              <g fill="#81591F">
                {qrModules.flatMap((row, rowIndex) =>
                  row.map(
                    (isDark, columnIndex) =>
                      isDark && (
                        <rect
                          key={`${rowIndex}-${columnIndex}`}
                          x={29 + columnIndex * 1.3}
                          y={29 + rowIndex * 1.3}
                          width="1.15"
                          height="1.15"
                        />
                      ),
                  ),
                )}
              </g>
            </g>
            <rect
              x="2"
              y="2"
              width="60"
              height="60"
              rx="12"
              stroke="#A9782A"
              strokeWidth="1.5"
            />
          </svg>
          <span className="text-2xl font-extrabold leading-none tracking-normal sm:text-3xl">
            TapNPay
          </span>
        </a>

        <div className="flex min-h-[50px] flex-wrap items-center justify-center gap-1 rounded-full bg-[#F8F3EC] p-1 md:h-[50px] md:flex-nowrap md:gap-2">
          <a
            href="#home"
            aria-current="page"
            className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-base font-medium text-[#8A5A16] no-underline shadow-sm transition-colors hover:bg-white/90 sm:px-6 sm:text-lg lg:px-8 lg:text-xl"
          >
            Home
          </a>
          <a
            href="#how-it-works"
            className="whitespace-nowrap rounded-full px-4 py-2 text-base font-medium text-[#6B5D4D] no-underline transition-colors hover:bg-white/70 sm:px-6 sm:text-lg lg:px-8 lg:text-xl"
          >
            How It Works
          </a>
          <a
            href="#features"
            className="whitespace-nowrap rounded-full px-4 py-2 text-base font-medium text-[#6B5D4D] no-underline transition-colors hover:bg-white/70 sm:px-6 sm:text-lg lg:px-8 lg:text-xl"
          >
            Features
          </a>
          <a
            href="#about"
            className="whitespace-nowrap rounded-full px-4 py-2 text-base font-medium text-[#6B5D4D] no-underline transition-colors hover:bg-white/70 sm:px-6 sm:text-lg lg:px-8 lg:text-xl"
          >
            About Us
          </a>
          <a
            href="#contact"
            className="whitespace-nowrap rounded-full px-4 py-2 text-base font-medium text-[#6B5D4D] no-underline transition-colors hover:bg-white/70 sm:px-6 sm:text-lg lg:px-8 lg:text-xl"
          >
            Contact
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => sendStudentAction("login")}
            className="flex h-[42px] items-center justify-center rounded-full border border-[#EADCCB] px-4 text-base font-semibold text-[#6B5D4D] shadow-sm transition-colors hover:bg-[#F8F3EC] sm:px-7 sm:text-lg"
            type="button"
          >
            Login
          </button>
          <a
            onClick={(event) => {
              if (sendStudentAction("signup")) event.preventDefault();
            }}
            className="inline-flex h-[42px] items-center justify-center whitespace-nowrap rounded-full bg-[#8A5A16] px-4 text-base font-semibold text-white no-underline shadow-[0_8px_18px_rgba(110,70,20,0.2)] transition-colors hover:bg-[#70470F] sm:px-7 sm:text-lg"
            href="#contact"
          >
            Get Started
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
