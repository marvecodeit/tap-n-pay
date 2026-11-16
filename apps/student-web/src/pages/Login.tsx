import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function LoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!studentId.trim() || !password) {
      setError("Enter your student ID and password.");
      return;
    }
    setError("");
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(125deg,#FBF1E5_0%,#F8F3EC_32%,#EDF2E8_68%,#F8EDE5_100%)] text-[#34271A]">
      <header className="h-[68px] border-b border-[#EADCCB]/80 bg-white/90 px-5 sm:px-8">
        <nav className="mx-auto flex h-full max-w-6xl items-center justify-between">
          <Link
            className="inline-flex items-center gap-2.5 text-[#34271A] no-underline"
            to="/"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-[#8A5A16] text-white shadow-sm">
              <Wallet aria-hidden="true" className="size-[18px]" />
            </span>
            <span className="text-lg font-bold">
              TapNPay<span className="text-[#A66B1C]">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm font-semibold sm:gap-7">
            <Link
              className="hidden text-[#6B5D4D] no-underline transition-colors hover:text-[#8A5A16] sm:inline"
              to="/"
            >
              Explore
            </Link>
            <span aria-current="page" className="text-[#34271A]">
              Log in
            </span>
            <Link
              className="rounded-lg bg-[#8A5A16] px-4 py-2.5 text-white no-underline shadow-sm transition-colors hover:bg-[#70470F] sm:px-5"
              to="/register"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex min-h-[calc(100vh-68px)] items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-[500px] rounded-2xl border border-[#EADCCB] bg-white px-7 py-10 shadow-[0_18px_55px_rgba(52,39,26,0.08)] sm:px-9 sm:py-12">
          <Link
            className="inline-flex items-center gap-2 text-[#34271A] no-underline"
            to="/"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-[#8A5A16] text-white shadow-sm">
              <Wallet aria-hidden="true" className="size-4" />
            </span>
            <span className="text-lg font-bold">
              TapNPay<span className="text-[#A66B1C]">.</span>
            </span>
          </Link>
          <p className="mt-7 text-xs font-bold tracking-[0.16em] text-[#8A5A16]">
            STUDENT PORTAL
          </p>
          <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-normal text-[#34271A] sm:text-[34px]">
            Good to see you again.
          </h1>
          <p className="mt-2 text-base leading-relaxed text-[#75685A]">
            Sign in to continue to TapNPay.
          </p>

          <form
            autoComplete="on"
            className="mt-6 space-y-3.5"
            onSubmit={submit}
          >
            <label className="block text-sm font-semibold text-[#4F4235]">
              Student ID or matric number
              <input
                id="student-username"
                name="username"
                autoComplete="username"
                className="mt-2 h-12 w-full rounded-lg border border-[#EADCCB] bg-white px-3 text-base font-normal text-[#34271A] outline-none placeholder:text-[#9A8874] focus:border-[#8A5A16] focus:ring-2 focus:ring-[#F8F0E5]"
                required
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                placeholder="Enter your student ID"
              />
            </label>
            <label className="block text-sm font-semibold text-[#4F4235]">
              Password
              <span className="mt-2 flex h-12 rounded-lg border border-[#EADCCB] bg-white focus-within:border-[#8A5A16] focus-within:ring-2 focus-within:ring-[#F8F0E5]">
                <input
                  id="student-password"
                  name="password"
                  autoComplete="current-password"
                  className="min-w-0 flex-1 rounded-l-lg bg-transparent px-3 text-base font-normal text-[#34271A] outline-none placeholder:text-[#9A8874]"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="px-3 text-[#75685A] transition-colors hover:text-[#34271A]"
                  onClick={() => setShowPassword((show) => !show)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="size-4" />
                  ) : (
                    <Eye aria-hidden="true" className="size-4" />
                  )}
                </button>
              </span>
            </label>
            <div className="flex justify-end pt-0.5 text-sm">
              <Link
                className="font-semibold text-[#8A5A16] no-underline hover:text-[#70470F]"
                to="/dashboard/help"
              >
                Forgot password?
              </Link>
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
              >
                {error}
              </p>
            )}
            <button
              className="w-full rounded-lg bg-[#8A5A16] py-3.5 text-base font-bold text-white shadow-[0_6px_14px_rgba(110,70,20,0.18)] transition-colors hover:bg-[#70470F]"
              type="submit"
            >
              Log in <span aria-hidden="true">→</span>
            </button>
          </form>

          <div className="my-5 border-t border-[#F0E7DE]" />
          <p className="text-center text-sm text-[#75685A]">
            New to TapNPay?{" "}
            <Link
              className="font-bold text-[#8A5A16] no-underline hover:text-[#70470F]"
              to="/register"
            >
              Create an account
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
