import { CheckCircle2, Clock3, CreditCard, GraduationCap, ShieldCheck, UserCog, Wallet, type LucideIcon } from "lucide-react";

export type DemoStudent = { name: string; initials: string; matric: string; department: string; faculty: string; level: string; status: "Active" | "Pending" | "Suspended"; card: "Active" | "Blocked" | "Not issued"; balance?: number };
export type DemoTransaction = { ref: string; name: string; initials: string; matric: string; amount: number; date: string; time: string; status: "Successful" | "Pending" | "Failed"; type: string };

// Replace this module with API-backed records when the admin service is connected.
export const demoStudents: DemoStudent[] = [
  { name: "Amara Nwosu", initials: "AN", matric: "AUL/CMP/23/055", department: "Computer Science", faculty: "Science", level: "300", status: "Active", card: "Active", balance: 18450 },
  { name: "Daniel Okafor", initials: "DO", matric: "AUL/ACC/21/082", department: "Accounting", faculty: "Management", level: "400", status: "Active", card: "Active", balance: 8200 },
  { name: "Zainab Bello", initials: "ZB", matric: "AUL/LAW/23/156", department: "Law", faculty: "Law", level: "200", status: "Pending", card: "Not issued" },
  { name: "Emeka Obi", initials: "EO", matric: "AUL/ENG/22/314", department: "Electrical Engineering", faculty: "Engineering", level: "300", status: "Active", card: "Blocked", balance: 12500 },
  { name: "Tomi Adeyemi", initials: "TA", matric: "AUL/MED/20/067", department: "Medicine", faculty: "Health Sciences", level: "500", status: "Active", card: "Active", balance: 32100 },
  { name: "Ibrahim Musa", initials: "IM", matric: "AUL/ECO/21/193", department: "Economics", faculty: "Social Sciences", level: "400", status: "Suspended", card: "Blocked", balance: 4500 },
  { name: "Chidera Eze", initials: "CE", matric: "AUL/BIO/23/241", department: "Biology", faculty: "Science", level: "200", status: "Active", card: "Active", balance: 9700 },
];
export const demoRecentRegistrations = demoStudents.slice(0, 3).map((student, index) => ({ student, dateLabel: index === 0 ? "Today" : "Yesterday" }));

export const demoTransactions: DemoTransaction[] = [
  { ref: "TNP-2904-8F21", name: "Amara Nwosu", initials: "AN", matric: "AUL/CMP/23/055", amount: 4500, date: "29 Oct 2026", time: "10:42 AM", status: "Successful", type: "Account funding" },
  { ref: "TNP-2904-7C13", name: "Daniel Okafor", initials: "DO", matric: "AUL/ACC/21/082", amount: 1200, date: "29 Oct 2026", time: "10:18 AM", status: "Successful", type: "Student purchase" },
  { ref: "TNP-2904-2A90", name: "Emeka Obi", initials: "EO", matric: "AUL/ENG/22/314", amount: 850, date: "29 Oct 2026", time: "09:56 AM", status: "Pending", type: "Student purchase" },
  { ref: "TNP-2904-5B77", name: "Tomi Adeyemi", initials: "TA", matric: "AUL/MED/20/067", amount: 10000, date: "29 Oct 2026", time: "09:31 AM", status: "Successful", type: "Account funding" },
  { ref: "TNP-2904-1D44", name: "Chidera Eze", initials: "CE", matric: "AUL/BIO/23/241", amount: 650, date: "29 Oct 2026", time: "09:08 AM", status: "Failed", type: "Student purchase" },
];

export const demoDashboardMetrics: { label: string; value: string; change: string; hint: string; icon: LucideIcon; color: string }[] = [
  { label: "Registered students", value: "2,846", change: "+8.2%", hint: "vs. previous period", icon: GraduationCap, color: "gold" },
  { label: "Active accounts", value: "2,631", change: "92.4%", hint: "of registered students", icon: ShieldCheck, color: "green" },
  { label: "Successful transactions", value: "1,284", change: "+12.6%", hint: "vs. previous period", icon: CheckCircle2, color: "blue" },
  { label: "Transaction value", value: "₦8.42m", change: "+6.4%", hint: "demo volume · this month", icon: Wallet, color: "purple" },
  { label: "Pending transactions", value: "12", change: "Needs attention", hint: "awaiting confirmation", icon: Clock3, color: "orange" },
  { label: "Blocked cards", value: "18", change: "0.6%", hint: "of issued cards", icon: CreditCard, color: "red" },
];

export const demoDashboardActivity = [
  { icon: UserCog, title: "New administrator added", detail: "Finance Admin · 12 min ago", color: "purple" },
  { icon: CreditCard, title: "Card marked as blocked", detail: "Emeka Obi · 38 min ago", color: "orange" },
  { icon: GraduationCap, title: "Student registration completed", detail: "AUL/CMP/23/062 · 1 hour ago", color: "blue" },
  { icon: Wallet, title: "Funding reconciliation reviewed", detail: "Finance Admin · 2 hours ago", color: "green" },
];

export const demoPopoverNotifications = ["2 payments need review", "New student registration", "Card status updated"];
export const demoPopoverTimes = ["Just now", "18 minutes ago", "1 hour ago"];
export const demoNotificationRecords = [
  { category: "Payment", title: "Payment confirmation pending", copy: "Transaction TNP-2904-2A90 is awaiting provider confirmation.", time: "Today · 10:56 AM", icon: Clock3, unread: true },
  { category: "Payment", title: "Payment attempt failed", copy: "A cafeteria purchase could not be completed. No manual status changes are allowed.", time: "Today · 09:08 AM", icon: CheckCircle2, unread: true },
  { category: "Card", title: "Student card blocked", copy: "A card status was updated for Emeka Obi.", time: "Today · 09:02 AM", icon: CreditCard, unread: true },
  { category: "Student", title: "New student registration", copy: "A new student profile was added to the demo directory.", time: "Yesterday · 04:35 PM", icon: GraduationCap, unread: false },
  { category: "System", title: "System maintenance notice", copy: "Scheduled maintenance information for campus administrators.", time: "Yesterday · 02:12 PM", icon: UserCog, unread: false },
];

export const demoAdministrators = [
  { name: "Admin Olawale", email: "admin@tapnpay.edu.ng", role: "Super Admin", state: "Active", initials: "AO" },
  { name: "Chika Okeke", email: "finance@tapnpay.edu.ng", role: "Finance Admin", state: "Active", initials: "CO" },
  { name: "Mariam Yusuf", email: "support@tapnpay.edu.ng", role: "Student Support Admin", state: "Active", initials: "MY" },
];
export const demoCurrentAdmin = demoAdministrators[0];
export const demoCardRecords = demoStudents.slice(0, 6).map((student, index) => ({
  student,
  identifier: `TP-${student.matric.slice(-3)}-${String(index + 31).padStart(3, "0")}`,
  qrRegistered: student.card !== "Not issued",
  lastUse: index === 0 ? "Today, 10:42 AM" : index === 1 ? "Yesterday" : "No recent record",
}));

export const demoAuditRecords = [
  ["Admin Olawale", "Updated card status", "Emeka Obi · AUL/ENG/22/314", "29 Oct 2026 · 09:02 AM", "Completed"],
  ["Chika Okeke", "Reviewed funding record", "TNP-2904-8F21", "29 Oct 2026 · 08:42 AM", "Completed"],
  ["Mariam Yusuf", "Viewed student profile", "Zainab Bello · AUL/LAW/23/156", "29 Oct 2026 · 08:18 AM", "Completed"],
  ["Admin Olawale", "Created administrator", "Finance Admin · Chika Okeke", "28 Oct 2026 · 04:36 PM", "Completed"],
  ["Chika Okeke", "Exported transaction report", "October 2026 · demo", "28 Oct 2026 · 02:15 PM", "Completed"],
];

export const demoFaqs = [
  ["How do I register a student card?", "Open Student ID Cards, select Register card, and verify the student's identity before confirming. The demo flow records a sample action only."],
  ["Can I manually mark a transaction successful?", "No. Payment status must come from verified provider confirmation. Review pending records and follow your payment provider's reconciliation process."],
  ["Where can I view administrative changes?", "Audit Logs shows administrator actions and outcomes with timestamps."],
  ["How do I export a report?", "Open Reports & Analytics, choose your date range, then use Download CSV to export the sample data."],
];

export const demoSummary = { registered: "2,846", active: "2,631", awaitingActivation: "37", suspended: "18", successfulToday: "1,284", pendingReview: "12", failedPayments: "8", recordedCredits: "₦284,500", studentSpending: "₦198,250", monthlyVolume: "4,920", successfulValue: "₦8.42m", cardsRegistered: "2,418", reportFailedPayments: "38" };
export const demoPeriodTotals: Record<string, string> = { Daily: "184 today", Weekly: "1,284 this week", Monthly: "4,920 this month", Yearly: "48,216 this year" };
export const demoReportMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const demoTransactionBars = [42, 59, 47, 71, 51, 64, 83, 62, 93, 75, 100, 82];
export const demoRegistrationTrend = [38, 56, 47, 72, 60, 83, 65, 92, 78, 100, 74, 86];
