import React, { useState, useEffect } from "react";
import { getTerminalConfig, setTerminalConfig, type TerminalConfig } from "../db/syncState";
import { Settings, Check } from "lucide-react";

export function Setup() {
  const [config, setConfig] = useState<TerminalConfig | null>(null);
  const [saved, setSaved] = useState(false);

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

  if (!config) return null;

  return (
    <div className="w-full max-w-xl mx-auto p-4 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-[#8C5E1E]" />
        <h2 className="text-xl font-bold text-[#231B12]">Terminal Settings</h2>
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

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
            Terminal API Key
          </label>
          <input
            autoComplete="new-password"
            type="password"
            value={config.terminal_api_key}
            onChange={(e) =>
              setConfig({ ...config, terminal_api_key: e.target.value })
            }
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
          />
          <p className="mt-1 text-xs text-slate-400">
            Required in production. For local development, the API can allow
            loopback requests when TERMINAL_LOCALHOST_DEV_ACCESS=true.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-300" /> : null}
          {saved ? "Configuration Saved!" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
