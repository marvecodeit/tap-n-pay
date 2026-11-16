import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  LifeBuoy,
} from "lucide-react";
import { demoFaqs } from "../data/adminDemoData";

export default function HelpSupport({
  notify,
}: {
  notify: (message: string) => void;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="help-layout">
      <section className="panel faq-panel">
        <div className="panel-head">
          <div>
            <h2>Frequently asked questions</h2>
            <p>Quick guidance for common admin tasks.</p>
          </div>
          <BookOpen size={19} />
        </div>
        {demoFaqs.map(([question, answer], index) => (
          <div className="faq-item" key={question}>
            <button onClick={() => setOpen(open === index ? null : index)}>
              <b>{question}</b>
              <ChevronDown
                className={open === index ? "rotate" : ""}
                size={16}
              />
            </button>
            {open === index && <p>{answer}</p>}
          </div>
        ))}
      </section>
      <section className="support-card">
        <span>
          <LifeBuoy size={20} />
        </span>
        <h2>Need a hand?</h2>
        <p>
          Our support team can help with account access, card registration and
          transaction questions.
        </p>
        <div className="support-contact">
          <small>EMAIL SUPPORT</small>
          <b>support@tapnpay.edu.ng</b>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => notify("Support email copied to clipboard")}
        >
          Contact support <ArrowUpRight size={15} />
        </button>
      </section>
      <section className="panel guidance-card">
        <CircleHelp size={18} />
        <span>
          <b>Demo environment guidance</b>
          <p>
            All records and metrics in this portal are sample data. Connect a
            verified service before relying on financial or student account
            information.
          </p>
        </span>
      </section>
    </div>
  );
}
