import { useState } from "react";
import { Key, X, CircleCheck, Trash2, ExternalLink } from "lucide-react";
import ModalOverlay from "./ModalOverlay";
import { getApiQuotaStatus } from "../lib/aiProviders";

export default function AiKeySettingsModal({ open, onClose, apis, activeName, addApi, deleteApi }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  const apiNames = Object.keys(apis);

  function handleAdd() {
    try {
      addApi(name.trim(), type, key.trim());
      setName("");
      setType("");
      setKey("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <ModalOverlay open={open} onClose={onClose} align="center" zIndex={300}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-black/5 rounded-3xl p-6 max-w-sm w-full overflow-y-auto max-h-[90vh] animate-pop-in shadow-[0_24px_50px_-30px_rgba(0,0,0,0.5)]"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#fff3f3] text-[#d92a2a] rounded-full flex items-center justify-center">
              <Key size={14} />
            </div>
            <h3 className="text-black font-black uppercase text-sm tracking-wide">API Provider Setup</h3>
          </div>
          <button onClick={onClose} className="text-black/45 hover:text-[#d92a2a]">
            <X size={18} />
          </button>
        </div>

        <p className="text-black/60 text-xs mb-4">
          Add your personal Gemini, OpenRouter, or local Ollama keys. Stored only in this browser.
        </p>

        <div className="space-y-4 text-left text-sm">
          <div className="bg-[#f9f8f6] p-4 rounded-xl border border-black/5">
            <h4 className="font-bold text-xs mb-2 text-black/75">Add New Provider</h4>
            <div className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (e.g. Gemini Backup)"
                className="w-full text-xs p-2 rounded-lg border border-black/10 outline-none bg-white text-black"
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-black/10 outline-none bg-white text-black"
              >
                <option value="">Select Protocol</option>
                <option value="gemini">Gemini Protocol</option>
                <option value="openrouter">OpenRouter Protocol</option>
                <option value="ollama">Local Ollama API</option>
              </select>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="API Key or Server URL"
                className="w-full text-xs p-2 rounded-lg border border-black/10 outline-none bg-white text-black"
              />
              {error ? <p className="text-[11px] text-[#d92a2a] font-bold">{error}</p> : null}
              <button onClick={handleAdd} className="tactile w-full bg-[#171717] text-white text-xs font-bold py-2 rounded-lg">
                Save Provider
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-xs mb-2 text-black/75">Saved Providers</h4>
            {apiNames.length === 0 ? (
              <p className="text-xs text-black/40">No providers added yet.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                {apiNames.map((n) => {
                  const api = apis[n];
                  const status = getApiQuotaStatus(n);
                  const isActive = n === activeName;
                  return (
                    <div
                      key={n}
                      className={`p-3 border rounded-xl flex justify-between items-center ${
                        isActive ? "bg-[#fff3f3] border-[#f6d7d7]" : "bg-white border-black/5"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs text-black flex items-center gap-1">
                          {n} {isActive ? <CircleCheck className="text-[#d92a2a]" size={13} /> : null}
                        </p>
                        <p className="text-[10px] text-black/55">
                          {api.type.toUpperCase()} • {status.used}/{status.limit}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteApi(n)}
                        className="tactile text-[#d92a2a] hover:bg-[#fff3f3] p-2 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-[#d92a2a] font-bold hover:underline"
          >
            Get Free Gemini API Key <ExternalLink size={10} />
          </a>
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-[#171717] font-bold hover:underline"
          >
            Get OpenRouter API Key <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </ModalOverlay>
  );
}
