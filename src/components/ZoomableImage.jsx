import { useRef } from "react";
import { usePinchZoom } from "../hooks/usePinchZoom";

export default function ZoomableImage({ src }) {
  const wrapperRef = useRef(null);
  const imgRef = useRef(null);
  usePinchZoom(wrapperRef, imgRef, [src]);

  return (
    <div className="viewer-page w-full mb-3">
      <div ref={wrapperRef} className="zoom-wrapper">
        <img ref={imgRef} src={src} loading="lazy" alt="Page" draggable={false} />
      </div>
    </div>
  );
}
