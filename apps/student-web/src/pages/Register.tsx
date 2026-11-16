import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { StudentProfile } from "../portal/PortalShared";

export function RegisterPage({
  onRegistered,
}: {
  onRegistered: (student: StudentProfile) => void;
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    email: "",
    department: "",
    faculty: "",
    level: "",
    phone: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [cardRegistered, setCardRegistered] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!acceptedTerms || !cardRegistered)
      return setError(
        "Confirm the terms and student ID card registration to continue.",
      );

    const student: StudentProfile = {
      name: form.name.trim(),
      student_id: form.studentId.trim().toUpperCase(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      created_at: new Date().toISOString(),
      active_card_id: `CARD-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
      balance: 0,
      department: form.department.trim(),
      faculty: form.faculty.trim(),
      level: form.level,
      isLocal: true,
    };
    onRegistered(student);
    navigate("/dashboard/card");
  }

  return (
    <main className="min-h-screen bg-[#F8F3EC] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          className="text-sm font-semibold text-[#8A5A16] no-underline"
          to="/login"
        >
          ← Back to sign in
        </Link>
        <div className="mt-5 rounded-xl border border-[#EADCCB] bg-white p-5 sm:p-8">
          <p className="text-sm font-semibold text-[#8A5A16]">
            STUDENT REGISTRATION
          </p>
          <h1 className="mt-2 text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-[#75685A]">
            Demo registration creates a temporary profile in this session. No
            password or API is used.
          </p>
          <form className="mt-7 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
            <Field
              label="Full name"
              required
              value={form.name}
              onChange={(value) => update("name", value)}
            />
            <Field
              label="Student ID / matric number"
              required
              value={form.studentId}
              onChange={(value) => update("studentId", value)}
            />
            <Field
              label="School email"
              required
              type="email"
              value={form.email}
              onChange={(value) => update("email", value)}
            />
            <Field
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={(value) => update("phone", value)}
            />
            <Field
              label="Department"
              value={form.department}
              onChange={(value) => update("department", value)}
            />
            <Field
              label="Faculty"
              value={form.faculty}
              onChange={(value) => update("faculty", value)}
            />
            <label className="block bg-transparent text-sm font-semibold text-[#26352D]">
              Level of study
              <select
                className="mt-2 w-full rounded-lg border border-[#CBD8CF] bg-white px-3 py-3 font-normal"
                value={form.level}
                onChange={(event) => update("level", event.target.value)}
              >
                <option value="">Select level</option>
                {["100", "200", "300", "400", "500", "600", "Postgraduate"].map(
                  (level) => (
                    <option key={level}>{level}</option>
                  ),
                )}
              </select>
            </label>
            <label className="flex items-start gap-3 rounded-lg bg-[#FBF8F3] p-3 text-sm sm:col-span-2">
              <input
                className="mt-1"
                checked={cardRegistered}
                onChange={(event) => setCardRegistered(event.target.checked)}
                type="checkbox"
              />
              <span>
                I confirm that the student ID details I provided belong to me.
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-lg bg-[#FBF8F3] p-3 text-sm sm:col-span-2">
              <input
                className="mt-1"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                type="checkbox"
              />
              <span>I agree to the terms and privacy notice.</span>
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 sm:col-span-2"
              >
                {error}
              </p>
            )}
            <button
              className="rounded-lg bg-[#8A5A16] px-5 py-3 font-semibold text-white hover:bg-[#70470F] sm:col-span-2"
              type="submit"
            >
              Create student account
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block bg-transparent text-sm font-semibold text-[#26352D]">
      {label}
      {required && <span aria-hidden="true"> *</span>}
      <input
        autoComplete="off"
        className="mt-2 w-full rounded-lg border border-[#EADCCB] bg-white px-3 py-3 font-normal text-[#34271A] outline-none focus:border-[#8A5A16] focus:ring-2 focus:ring-[#F8F0E5]"
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
