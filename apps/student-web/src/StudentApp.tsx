import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { StudentShell } from "./portal/StudentShell";
import type { StudentProfile } from "./portal/PortalShared";
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
  const [student, setStudent] = useState<StudentProfile | null>(() => ({
    student_id: "ACC/2021/0082",
    name: "Daniel Okafor",
    email: "daniel.okafor@university.edu.ng",
    created_at: new Date().toISOString(),
    active_card_id: "CARD-A3F2-9K2",
    balance: 4_825_000,
    department: "Accounting",
    faculty: "Management",
    level: "400",
    isLocal: true,
  }));

  function saveRegisteredStudent(account: StudentProfile) {
    setStudent(account);
  }

  function clearStudent() {
    setStudent(null);
  }

  return (
    <Routes>
      <Route path="/" element={<MarketingEntry />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/register"
        element={<RegisterPage onRegistered={saveRegisteredStudent} />}
      />
      <Route path="/payment/:reference" element={<PaymentResultPage />} />
      <Route
        path="/dashboard"
        element={
          <StudentShell
            student={student}
            setStudent={(value) =>
              value ? saveRegisteredStudent(value) : clearStudent()
            }
          />
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
