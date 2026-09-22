import { useEffect } from "react";

export function usePinchZoom(wrapperRef, imgRef, deps = []) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!wrapper || !img) return undefined;

    let scale = 1,
      lastScale = 1,
      panX = 0,
      panY = 0,
      startX = 0,
      startY = 0,
      startDist = 0,
      isPanning = false,
      lastTap = 0,
      originX = 0,
      originY = 0;

    function clampPan() {
      const limitX = Math.max(0, (img.offsetWidth * scale - wrapper.offsetWidth) / 2);
      const limitY = Math.max(0, (img.offsetHeight * scale - wrapper.offsetHeight) / 2);
      panX = Math.max(-limitX, Math.min(limitX, panX));
      panY = Math.max(-limitY, Math.min(limitY, panY));
    }
    function update(mode) {
      img.style.transition = mode === "animate" ? "transform 0.3s cubic-bezier(0.16,1,0.3,1)" : "none";
      img.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${scale})`;
    }
    function onTouchStart(e) {
      if (e.touches.length === 2) {
        isPanning = false;
        startDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        lastScale = scale;
        const r = img.getBoundingClientRect();
        originX = ((e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left) / scale;
        originY = ((e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top) / scale;
      } else if (e.touches.length === 1) {
        isPanning = true;
        startX = e.touches[0].clientX - panX;
        startY = e.touches[0].clientY - panY;
      }
    }
    function onTouchMove(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        scale = Math.max(
          1,
          Math.min(
            5,
            lastScale *
              (Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY) /
                startDist)
          )
        );
        const r = wrapper.getBoundingClientRect();
        panX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left - originX * scale;
        panY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top - originY * scale;
        clampPan();
        update("instant");
      } else if (e.touches.length === 1 && isPanning && scale > 1) {
        e.preventDefault();
        panX = e.touches[0].clientX - startX;
        panY = e.touches[0].clientY - startY;
        clampPan();
        update("instant");
      }
    }
    function onTouchEnd(e) {
      const now = Date.now();
      if (now - lastTap < 300 && e.changedTouches.length === 1) {
        if (scale > 1) {
          scale = 1;
          panX = 0;
          panY = 0;
        } else {
          scale = 2.5;
          const r = wrapper.getBoundingClientRect();
          panX = (r.width / 2 - (e.changedTouches[0].clientX - r.left)) * (scale - 1);
          panY = (r.height / 2 - (e.changedTouches[0].clientY - r.top)) * (scale - 1);
        }
        clampPan();
        update("animate");
      }
      lastTap = now;
      isPanning = false;
    }

    wrapper.addEventListener("touchstart", onTouchStart, { passive: false });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
    wrapper.addEventListener("touchend", onTouchEnd);

    return () => {
      wrapper.removeEventListener("touchstart", onTouchStart);
      wrapper.removeEventListener("touchmove", onTouchMove);
      wrapper.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
