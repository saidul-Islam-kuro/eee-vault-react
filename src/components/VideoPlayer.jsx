import { normalizeYouTubeMedia } from "../lib/youtube";

export default function VideoPlayer({ videoId, playlistId, title, className = "" }) {
  const { videoId: normalizedVideoId, playlistId: normalizedPlaylistId } =
    normalizeYouTubeMedia({ videoId, playlistId });
  const embedParams = new URLSearchParams({
    rel: "0",
    playsinline: "1",
    origin: window.location.origin,
    widget_referrer: window.location.href,
  });

  if (!normalizedVideoId && !normalizedPlaylistId) {
    return (
      <div className={`flex aspect-video w-full items-center justify-center rounded-[26px] border border-black/5 bg-[#f8f7f4] text-sm font-bold text-black/55 ${className}`}>
        Video unavailable
      </div>
    );
  }

  const src = normalizedPlaylistId
    ? `https://www.youtube.com/embed/videoseries?list=${normalizedPlaylistId}&${embedParams.toString()}`
    : `https://www.youtube.com/embed/${normalizedVideoId}?${embedParams.toString()}`;

  return (
    <div className={`overflow-hidden rounded-[26px] border border-black/5 bg-black shadow-[0_24px_48px_-28px_rgba(0,0,0,0.7)] ${className}`}>
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={src}
          title={title || "Lecture video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="origin"
          loading="lazy"
        />
      </div>
    </div>
  );
}
