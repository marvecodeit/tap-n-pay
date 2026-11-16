import { useState } from "react";
import {
  CreditCard,
  Plus,
  Printer,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { formatKobo } from "@tapnpay/ui";
import type { Card } from "@tapnpay/api-client";

interface CardsProps {
  cards: Card[];
  onToggleBlock: (cardId: string) => void;
  onIssueCard: (newCard: Card) => void;
}

export function Cards({ cards, onToggleBlock, onIssueCard }: CardsProps) {
  const [search, setSearch] = useState("");
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [initialBalanceNaira, setInitialBalanceNaira] = useState("");
  const [printableCard, setPrintableCard] = useState<Card | null>(null);

  const filteredCards = cards.filter(
    (c) =>
      c.student_name.toLowerCase().includes(search.toLowerCase()) ||
      c.card_id.toLowerCase().includes(search.toLowerCase()) ||
      c.student_id.toLowerCase().includes(search.toLowerCase()),
  );

  const generateCardId = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let part1 = "";
    let part2 = "";
    for (let i = 0; i < 4; i++)
      part1 += chars[Math.floor(Math.random() * chars.length)];
    for (let i = 0; i < 4; i++)
      part2 += chars[Math.floor(Math.random() * chars.length)];
    return `CARD-${part1}-${part2}`;
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim()) return;

    const newCard: Card = {
      card_id: generateCardId(),
      student_id: studentId.trim().toUpperCase(),
      student_name: studentName.trim(),
      balance: (parseInt(initialBalanceNaira, 10) || 0) * 100,
      version: 1,
      blocked: 0,
      issued_at: new Date().toISOString(),
    };

    onIssueCard(newCard);
    setShowIssueModal(false);
    setPrintableCard(newCard);
    setStudentName("");
    setStudentId("");
    setInitialBalanceNaira("");
  };

  return (
    <div>
      <div className="demo-banner">
        <CreditCard size={16} />
        <span>
          <b>Card records</b> · Issue cards, review balances, and manage card
          status.
        </span>
        <button
          className="btn btn-primary"
          onClick={() => setShowIssueModal(true)}
        >
          <Plus size={15} /> Issue new card
        </button>
      </div>
      <label
        className="table-search"
        style={{ width: "100%", marginBottom: 14 }}
      >
        <Search size={15} />
        <input
          type="search"
          placeholder="Search by student name, matric number, or card token ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      <section className="card-grid">
        {filteredCards.map((card) => (
          <article className="id-card" key={card.card_id}>
            <div className="id-card-top">
              <span className="brand-mini">
                <span className="brand-mark small-mark">
                  <span />
                </span>
                TapNPay
              </span>
              <span className="card-chip">
                <CreditCard size={16} />
              </span>
            </div>
            <div className="card-avatar-row">
              <span className="avatar avatar-admin">
                {card.student_name
                  .split(/\s+/)
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span>
                <b>{card.student_name}</b>
                <small>{card.student_id}</small>
              </span>
            </div>
            <div className="id-card-info">
              <span>Card ID token</span>
              <b>{card.card_id}</b>
            </div>
            <div className="id-card-bottom">
              <div>
                <span>Wallet balance</span>
                <b>{formatKobo(card.balance)}</b>
              </div>
              <div>
                <span>Issued</span>
                <b>{new Date(card.issued_at).toLocaleDateString()}</b>
              </div>
            </div>
            <div className="id-card-actions">
              {card.blocked === 1 ? (
                <span className="status-pill blocked">
                  <i />
                  <ShieldAlert size={12} /> Blocked
                </span>
              ) : (
                <span className="status-pill active">
                  <i />
                  <ShieldCheck size={12} /> Active
                </span>
              )}
              <div className="flex gap-2">
                <button
                  className="btn btn-outline"
                  onClick={() => setPrintableCard(card)}
                  title="Print card"
                  aria-label={`Print ${card.student_name}'s card`}
                >
                  <Printer size={15} />
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => onToggleBlock(card.card_id)}
                >
                  {card.blocked === 1 ? "Unblock" : "Block"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Issue Cafeteria QR Card
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Generates a secure 12-char static token linked to the student's
              central wallet.
            </p>
            <form onSubmit={handleIssueSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amara Nwosu"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Matric / Student ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STU-005"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Initial Top Up (₦)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={initialBalanceNaira}
                  onChange={(e) => setInitialBalanceNaira(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow"
                >
                  Issue Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Card Preview Modal */}
      {printableCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <h3 className="text-base font-bold text-white">
              Physical Card Token
            </h3>
            <div className="bg-white p-6 rounded-2xl text-slate-950 border border-slate-200 shadow-inner">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
                Campus Cafeteria Meal Card
              </div>
              {/* QR Code Placeholder Graphic */}
              <div className="w-40 h-40 mx-auto bg-slate-900 rounded-xl flex flex-col items-center justify-center p-4 text-white">
                <div className="grid grid-cols-4 gap-2 w-full h-full p-2 border-2 border-dashed border-white/40">
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-transparent"></div>
                  <div className="bg-white rounded-sm"></div>
                  <div className="bg-white rounded-sm"></div>
                </div>
              </div>
              <div className="mt-3 font-mono font-bold text-sm text-slate-900">
                {printableCard.card_id}
              </div>
              <div className="text-xs text-slate-600 font-semibold mt-1">
                {printableCard.student_name}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setPrintableCard(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
              >
                Print Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
