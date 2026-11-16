import { CreditCard } from "lucide-react";
import { demoCardRecords, type DemoStudent } from "../data/adminDemoData";
import { StatusPill } from "./PageShared";

export default function StudentCards({
  onAction,
}: {
  onAction: (student: DemoStudent, action: string) => void;
}) {
  return (
    <>
      <div className="demo-banner">
        <CreditCard size={16} />
        <span>
          <b>Card records are illustrative.</b> Registration and last-use
          details are sample data.
        </span>
      </div>
      <section className="card-grid">
        {demoCardRecords.map(
          ({ student, identifier, qrRegistered, lastUse }) => (
            <article className="id-card" key={student.matric}>
              <div className="id-card-top">
                <span className="brand-mini">TapNPay</span>
                <CreditCard size={16} />
              </div>
              <div className="card-avatar-row">
                <span>
                  <b>{student.name}</b>
                  <small>{student.matric}</small>
                </span>
              </div>
              <div className="id-card-info">
                <span>Card identifier</span>
                <b>{identifier}</b>
              </div>
              <div className="id-card-bottom">
                <div>
                  <span>Registration</span>
                  <b>{qrRegistered ? "QR registered" : "Not registered"}</b>
                </div>
                <div>
                  <span>Last use</span>
                  <b>{lastUse}</b>
                </div>
              </div>
              <div className="id-card-actions">
                <StatusPill status={student.card} />
                <button
                  className="btn btn-outline"
                  onClick={() =>
                    onAction(
                      student,
                      student.card === "Blocked"
                        ? "reactivate-card"
                        : student.card === "Not issued"
                          ? "register-card"
                          : "block-card",
                    )
                  }
                >
                  {student.card === "Blocked"
                    ? "Reactivate"
                    : student.card === "Not issued"
                      ? "Register card"
                      : "Manage card"}
                </button>
              </div>
            </article>
          ),
        )}
      </section>
    </>
  );
}
