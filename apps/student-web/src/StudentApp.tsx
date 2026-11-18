import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { StudentShell } from "./portal/StudentShell";
import {
  toStudentProfile,
  type StudentProfile,
} from "./portal/PortalShared";
import { DashboardPage } from "./pages/Dashboard";
import { HelpPage } from "./pages/Help";
import { NotificationsPage } from "./pages/Notifications";
import { SettingsPage } from "./pages/Settings";
import { StudentCardPage } from "./pages/StudentCard";
import { TransactionsPage } from "./pages/Transactions";
import { WalletPage } from "./pages/Wallet";
import { ReceiptsPage } from "./pages/Receipts";
import { LoginPage } from "./pages/Login";
import { PaymentResultPage } from "./pages/PaymentResult";
import { RegisterPage } from "./pages/Register";
import { TransferPage } from "./pages/Transfer";
import {
  api,
  getApiErrorMessage,
  isUnauthorizedApiError,
  refreshStudentSession,
} from "./lib/api";

const landingPagesUrl =
  import.meta.env.VITE_LANDING_PAGES_URL || "http://localhost:5176";
const landingPagesOrigin = new URL(landingPagesUrl).origin;

function MarketingEntry() {
  const navigate = useNavigate();

  useEffect(() => {
    function handleLandingAction(event: MessageEvent) {
      if (
        event.origin !== landingPagesOrigin ||
        event.data?.source !== "tapnpay-landing-pages"
      ) {
        return;
      }

      if (event.data.action === "signup") navigate("/register");
      if (event.data.action === "login") navigate("/login");
    }

    window.addEventListener("message", handleLandingAction);
    return () => window.removeEventListener("message", handleLandingAction);
  }, [navigate]);

  return (
    <iframe
      title="TapNPay campus payments landing page"
      src={landingPagesUrl}
      className="fixed inset-0 z-0 h-dvh w-full border-0 bg-white"
    />
  );
}

function StudentRoutes() {
  const location = useLocation();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    if (!location.pathname.startsWith("/dashboard") || student) {
      setSessionLoaded(true);
      return;
    }

    let active = true;

    async function restoreSession() {
      try {
        await refreshStudentSession();
        const account = await api.getCurrentStudent();
        if (active) setStudent(toStudentProfile(account));
      } catch (error) {
        api.clearToken();
        if (
          active &&
          !isUnauthorizedApiError(error)
        ) {
          setSessionError(
            getApiErrorMessage(error, "Could not restore your student session."),
          );
        }
      } finally {
        if (active) setSessionLoaded(true);
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, [location.pathname, student]);

  function saveRegisteredStudent(account: StudentProfile) {
    setStudent(account);
  }

  function clearStudent() {
    setStudent(null);
  }

  if (!sessionLoaded) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F8F3EC] text-sm text-[#75685A]">
        Connecting to TapNPay...
      </main>
    );
  }

  return (
    <>
    <Routes>
      <Route path="/" element={<MarketingEntry />} />
      <Route
        path="/login"
        element={<LoginPage onAuthenticated={saveRegisteredStudent} />}
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/payment/:reference" element={<PaymentResultPage />} />
      <Route
        path="/dashboard"
        element={
          student ? (
            <StudentShell
              student={student}
              setStudent={(value) =>
                value ? saveRegisteredStudent(value) : clearStudent()
              }
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="card" element={<StudentCardPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="transfer" element={<TransferPage />} />
        <Route path="receipts" element={<ReceiptsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    {sessionError && (
      <p
        className="fixed bottom-4 left-4 z-50 max-w-md rounded-lg border border-red-200 bg-white p-3 text-sm text-red-800 shadow-lg"
        role="alert"
      >
        {sessionError}
      </p>
    )}
    </>
  );
}

export default function StudentApp() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <StudentRoutes />
    </BrowserRouter>
  );
}
