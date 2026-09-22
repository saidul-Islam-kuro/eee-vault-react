import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import { ChevronRight, Send, WandSparkles, Settings } from "lucide-react";
import AiKeySettingsModal from "./AiKeySettingsModal";
import { useAiProviders } from "../hooks/useAiProviders";
import { convertImageUrlToBase64, sendQueryToAI } from "../lib/aiProviders";

export default function AiChatPanel({ open, onClose, pages, resetKey }) {
  const { apis, activeName, quotaStatus, addApi, deleteApi, switchApi, refresh } = useAiProviders();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [imageParts, setImageParts] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [input, setInput] = useState("");
  const messagesRef = useRef(null);

  // Reset the conversation whenever a different paper is opened.
  useEffect(() => {
    setChatHistory([]);
    setImageParts([]);
    setIsThinking(false);
  }, [resetKey]);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([messagesRef.current]).catch(() => {});
    }
  }, [chatHistory, isThinking]);

  function normalizeResponseContent(content) {
    if (typeof content === "string") return content;
    if (content == null) return "";
    return JSON.stringify(content, null, 2);
  }

  async function handleSend() {
    if (isThinking) return;
    const text = input.trim();
    if (!text) return;
    if (!activeName) {
      setSettingsOpen(true);
      return;
    }

    setInput("");
    const nextHistory = [...chatHistory, { role: "user", content: text }];
    setChatHistory(nextHistory);
    setIsThinking(true);

    try {
      let parts = imageParts;
      if (parts.length === 0 && pages.length > 0) {
        const converted = [];
        for (const url of pages) {
          const dataUrl = await convertImageUrlToBase64(url);
          converted.push({ inlineData: { mimeType: "image/jpeg", data: dataUrl.split(",")[1] } });
        }
        parts = converted;
        setImageParts(converted);
      }
      const response = await sendQueryToAI(nextHistory, parts);
      setChatHistory((h) => [...h, { role: "assistant", content: normalizeResponseContent(response) }]);
    } catch (err) {
      setChatHistory((h) => [...h, { role: "assistant", content: `❌ ${err.message || String(err)}` }]);
    } finally {
      setIsThinking(false);
      refresh();
    }
  }

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white border-l border-slate-200 z-[120] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="p-4 bg-white border-b border-slate-200"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <WandSparkles className="text-red-500" size={16} />
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">Vault Assistant</h3>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setSettingsOpen(true)} className="text-slate-400 hover:text-slate-800" title="API Settings">
                <Settings size={16} />
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-red-600">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {apis && Object.keys(apis).length > 0 ? (
            <select
              value={activeName || ""}
              onChange={(e) => switchApi(e.target.value)}
              className="w-full bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs text-slate-700 outline-none mb-2"
            >
              {Object.keys(apis).map((n) => {
                const type = apis[n].type;
                const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
                return (
                  <option key={n} value={n}>
                    {n} ({typeLabel})
                  </option>
                );
              })}
            </select>
          ) : (
            <p className="text-[10px] text-red-500 font-bold">⚠ No Provider Set — tap the gear icon</p>
          )}

          {quotaStatus ? (
            <>
              <div className="text-[10px] text-slate-500 flex items-center justify-between">
                <span>Quota Usage</span>
                <span className="font-bold">
                  {quotaStatus.used}/{quotaStatus.limit}
                </span>
              </div>
              <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    quotaStatus.percentUsed > 90 ? "bg-red-500" : quotaStatus.percentUsed > 75 ? "bg-amber-500" : "bg-green-500"
                  }`}
                  style={{ width: `${quotaStatus.percentUsed}%` }}
                />
              </div>
            </>
          ) : null}
        </div>

        <div ref={messagesRef} className="flex-grow p-4 overflow-y-auto bg-white no-scrollbar">
          <div className="bg-blue-50 border border-red-100 rounded-2xl p-4 text-xs text-slate-600 space-y-2 mb-4">
            <p className="font-bold text-red-600">ℹ How to use</p>
            <p>
              Set your API key (Gemini recommended) in Settings. You can save multiple providers to get more usage
              on free tiers.
            </p>
          </div>
          {chatHistory.map((msg, i) => {
            const safeContent = normalizeResponseContent(msg.content);

            return msg.role === "user" ? (
              <div key={i} className="flex justify-end p-2 mb-2">
                <div className="bg-red-600 text-white text-[13px] px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] break-words">
                  {safeContent}
                </div>
              </div>
            ) : (
              <div
                key={i}
                className="w-full px-2 py-4 mb-2 text-slate-800 text-[14px] leading-relaxed ai-markdown-content overflow-hidden"
                dangerouslySetInnerHTML={{ __html: marked.parse(safeContent || "") }}
              />
            );
          })}
          {isThinking ? (
            <div className="text-[10px] text-slate-400 text-center py-2 animate-pulse">
              AI is thinking via {activeName}...
            </div>
          ) : null}
        </div>

        <div
          className="p-4 bg-white border-t border-slate-200"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask to solve Q1, derive formulas..."
              className="flex-grow bg-slate-50 text-slate-800 text-xs p-3 rounded-xl outline-none border border-slate-300 focus:border-red-500 transition-colors"
            />
            <button onClick={handleSend} className="tactile bg-red-600 text-white px-4 rounded-xl">
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      <AiKeySettingsModal
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          refresh();
        }}
        apis={apis}
        activeName={activeName}
        addApi={addApi}
        deleteApi={deleteApi}
      />
    </>
  );
}
