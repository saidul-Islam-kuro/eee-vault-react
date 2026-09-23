import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bot, FileDown, X, ArrowLeft } from "lucide-react";
import ZoomableImage from "../components/ZoomableImage";
import AiChatPanel from "../components/AiChatPanel";
import ConfirmDialog from "../components/ConfirmDialog";
import { useConfirmDialog } from "../hooks/useConfirmDialog";
import { useVaultDataContext } from "../context/VaultDataContext";
import { compilePagesToPdf } from "../lib/pdfCompile";

export default function ViewerPage() {
  const { code, batch } = useParams();
  const navigate = useNavigate();
  const { courseData } = useVaultDataContext();
  const confirmDialog = useConfirmDialog();

  const [aiOpen, setAiOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const decodedCode = decodeURIComponent(code);
  const decodedBatch = decodeURIComponent(batch);

  const course = useMemo(() => courseData.find((c) => c.code === decodedCode), [courseData, decodedCode]);
  const rawLink = course?.links ? course.links[decodedBatch] : null;
  const pages = Array.isArray(rawLink) ? rawLink : rawLink ? [rawLink] : [];
  const title = course ? `${course.title} - ${decodedBatch}` : "Paper not found";

  function handleClose() {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/vault");
  }

  function requestPdf() {
    confirmDialog.ask({
      icon: FileDown,
      title: "Compile PDF?",
      message: "Download the compiled A4 PDF of every page.",
      confirmLabel: "Start",
      confirmTone: "green",
      onConfirm: async () => {
        confirmDialog.close();
        setIsCompiling(true);
        try {
          await compilePagesToPdf(pages, title);
        } catch {
          window.alert("Download error.");
        } finally {
          setIsCompiling(false);
        }
      },
    });
  }

  if (!course || pages.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#111111] flex flex-col items-center justify-center gap-4 text-white p-6 text-center">
        <p className="font-bold uppercase tracking-wide text-sm text-white/70">This paper couldn't be found.</p>
        <button onClick={handleClose} className="tactile bg-[#d92a2a] px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="viewer-page fixed inset-0 z-[100] flex flex-col md:flex-row overflow-hidden bg-black">
      <div className="flex-grow flex flex-col h-full relative">
        <div
          className="px-4 py-3 bg-zinc-900 flex justify-between items-center border-b border-red-900/30 z-[110] min-h-[64px]"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)" }}
        >
          <div className="flex-grow pr-3">
            <h2 className="font-bold text-white uppercase text-xs tracking-wide leading-tight break-words max-w-full">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAiOpen(true)}
              className="tactile px-3 py-2 rounded-xl text-xs font-bold bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center gap-1"
            >
              <Bot size={14} /> AI
            </button>
            {isCompiling ? (
              <div className="flex items-center justify-center px-3 py-2">
                <div className="loader-ring" />
              </div>
            ) : (
              <button
                onClick={requestPdf}
                className="tactile px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 flex items-center gap-1"
              >
                <FileDown size={14} /> PDF
              </button>
            )}
            <button
              onClick={handleClose}
              className="tactile px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] tracking-wide uppercase flex items-center gap-1"
            >
              <X size={14} /> Close
            </button>
          </div>
        </div>

        <div className="flex-grow bg-black relative overflow-y-auto no-scrollbar">
          <div className="w-full">
            {pages.map((url, i) => {
              const isPdf = /\.pdf(?:\?|$)/i.test(url);
              const iframeSrc = isPdf ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}` : url;

              return isPdf ? (
                <div key={`${url}-${i}`} className="viewer-page-frame w-full h-[calc(100vh-64px)] bg-white">
                  <iframe
                    src={iframeSrc}
                    title={`${title}-${i + 1}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              ) : (
                <ZoomableImage key={`${url}-${i}`} src={url} />
              );
            })}
          </div>
        </div>
      </div>

      <AiChatPanel open={aiOpen} onClose={() => setAiOpen(false)} pages={pages} resetKey={`${decodedCode}-${decodedBatch}`} />

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={confirmDialog.close}
        onConfirm={confirmDialog.confirm}
        {...(confirmDialog.config || {})}
      />
    </div>
  );
}
