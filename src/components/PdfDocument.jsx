import { useEffect, useState } from "react";
import { fetchPublicPdf } from "../lib/pdfAsset.js";

export default function PdfDocument({ src, title }) {
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl;

    fetchPublicPdf(src, { signal: controller.signal })
      .then((pdfBlob) => {
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(pdfBlob);
        setState({ status: "ready", objectUrl });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ status: "error", message: error.message });
      });

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return (
    <div className="viewer-page-frame relative w-full h-[calc(100vh-64px)] bg-white">
      {state.status === "loading" && (
        <div className="absolute inset-0 z-10 grid place-items-center text-sm text-zinc-600">
          Loading PDF…
        </div>
      )}
      {state.status === "ready" && (
        <iframe
          src={state.objectUrl}
          title={title}
          className="relative z-20 w-full h-full border-0"
          allowFullScreen
        />
      )}
      {state.status === "error" && (
        <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-zinc-800">
          <div>
            <p>This PDF couldn't be loaded. {state.message}</p>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-red-700 underline"
            >
              Open original public file
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
