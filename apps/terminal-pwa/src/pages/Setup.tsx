import React, { useState, useEffect } from "react";
import { getTerminalConfig, setTerminalConfig, setLastSyncTime, type TerminalConfig } from "../db/syncState";
import { saveCardsBatch } from "../db/balances";
import { formatKobo } from "@tapnpay/ui";
import { Settings, Sparkles, Check } from "lucide-react";
import { demoCards } from "../data/demoCards";

export function Setup() {
  const [config, setConfig] = useState<TerminalConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    getTerminalConfig().then(setConfig);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    await setTerminalConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSeedDemoData = async () => {
    await saveCardsBatch(demoCards);
    await setLastSyncTime(new Date()); // unlocks terminal
    setSeeded(true);
    setTimeout(() => setSeeded(false), 3000);
  };

  if (!config) return null;

  return (
    <div className="w-full max-w-xl mx-auto p-4 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">Terminal Configuration</h2>
      </div>

      <form onSubmit={handleSave} className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Terminal ID
          </label>
          <input
            type="text"
            value={config.terminal_id}
            onChange={(e) => setConfig({ ...config, terminal_id: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Cashier Name / ID
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Cashier ID"
              value={config.cashier_id}
              onChange={(e) => setConfig({ ...config, cashier_id: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
            />
            <input
              type="text"
              placeholder="Cashier Name"
              value={config.cashier_name}
              onChange={(e) => setConfig({ ...config, cashier_name: e.target.value })}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Cafeteria Name
          </label>
          <input
            type="text"
            value={config.cafeteria_name}
            onChange={(e) => setConfig({ ...config, cafeteria_name: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Backend Server URL
          </label>
          <input
            type="text"
            value={config.api_base_url}
            onChange={(e) => setConfig({ ...config, api_base_url: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
          {saved ? "Configuration Saved!" : "Save Settings"}
        </button>
      </form>

      {/* Demo Seed Section for Fast Testing */}
      <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Quick Demo Student Cards
          </div>
          <button
            onClick={handleSeedDemoData}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition-colors"
          >
            {seeded ? "Loaded!" : "Load 4 Test Cards"}
          </button>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Seeds test cards into this browser's IndexedDB so you can test scanning and checkouts offline:
        </p>
        <div className="space-y-1.5 text-xs font-mono text-slate-300">
          {demoCards.map((c) => (
            <div key={c.card_id} className="flex justify-between bg-slate-900/60 px-3 py-1.5 rounded-lg">
              <span>{c.student_name} ({c.card_id})</span>
              <span className={c.blocked ? "text-red-400" : "text-emerald-400 font-bold"}>
                {c.blocked ? "BLOCKED" : formatKobo(c.balance)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
