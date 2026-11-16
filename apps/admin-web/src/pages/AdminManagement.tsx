import { Shield, ShieldCheck, UserCog, Users, Wallet } from "lucide-react";
import { demoAdministrators } from "../data/adminDemoData";
import { StatusPill } from "./PageShared";

export default function AdminManagement() {
  const roles = [
    {
      name: "Super Admin",
      copy: "Full portal access, configuration and administrator management.",
      icon: Shield,
    },
    {
      name: "Finance Admin",
      copy: "Transaction review, funding records and report access.",
      icon: Wallet,
    },
    {
      name: "Student Support Admin",
      copy: "Student profiles, card support and notification access.",
      icon: Users,
    },
  ];
  return (
    <>
      <section className="panel role-banner">
        <ShieldCheck size={21} />
        <div>
          <b>Role-based access</b>
          <p>
            Permissions shown here are illustrative. Assign access according to
            your institution’s policies.
          </p>
        </div>
      </section>
      <section className="panel list-panel">
        <div className="list-toolbar">
          <div>
            <h2>Administrators</h2>
            <p>{demoAdministrators.length} demo admin accounts</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => window.alert("Demo: administrator invite form")}
          >
            Add administrator
          </button>
        </div>
        <div className="admin-list">
          {demoAdministrators.map((admin) => (
            <div className="admin-row" key={admin.email}>
              <span className="avatar avatar-admin">{admin.initials}</span>
              <span className="admin-person">
                <b>{admin.name}</b>
                <small>{admin.email}</small>
              </span>
              <span className="role-pill">{admin.role}</span>
              <StatusPill status={admin.state} />
            </div>
          ))}
        </div>
      </section>
      <div className="role-grid">
        {roles.map(({ name, copy, icon: Icon }) => (
          <div className="panel role-card" key={name}>
            <span>
              <Icon size={17} />
            </span>
            <b>{name}</b>
            <p>{copy}</p>
          </div>
        ))}
      </div>
      <UserCog className="sr-only" aria-hidden="true" />
    </>
  );
}
