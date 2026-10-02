import { useRef, useState } from "react";
import { usePinchZoom } from "../hooks/usePinchZoom";

export default function ZoomableImage({ src }) {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  const [failed, setFailed] = useState(false);
  usePinchZoom(wrapperRef, imgRef, [src]);

  return (
    <div className="viewer-page w-full mb-3">
      <div ref={wrapperRef} className="zoom-wrapper">
        <img ref={imgRef} src={src} loading="lazy" alt="Page" draggable={false} onError={() => setFailed(true)} />
        {failed && (
          <div className="p-6 text-center text-sm text-white bg-zinc-900">
            <p>This image couldn't be loaded. Check that the GitHub file is public and try again.</p>
            <a href={src} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-red-300 underline">
              Open image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
