function normalizeVideoId(value) {
  if (!value) return "";

  const raw = String(value).trim();
  const match = raw.match(/(?:youtube\.com\/.*(?:v=|\/embed\/|\/shorts\/)|youtu\.be\/|vi\/)([A-Za-z0-9_-]{11})/i)
    || raw.match(/([A-Za-z0-9_-]{11})/);

  return match ? match[1] : raw;
}

function normalizePlaylistId(value) {
  if (!value) return "";

  const raw = String(value).trim();
  const match = raw.match(/[?&]list=([A-Za-z0-9_-]+)/i) || raw.match(/(?:youtube\.com\/playlist\?list=|youtube\.com\/embed\/videoseries\?list=)([A-Za-z0-9_-]+)/i);
  return match ? match[1] : raw;
}

export default function VideoPlayer({ videoId, playlistId, title, className = "" }) {
  const normalizedVideoId = normalizeVideoId(videoId);
  const normalizedPlaylistId = normalizePlaylistId(playlistId);

  if (!normalizedVideoId && !normalizedPlaylistId) {
    return (
      <div className={`flex aspect-video w-full items-center justify-center rounded-[26px] border border-black/5 bg-[#f8f7f4] text-sm font-bold text-black/55 ${className}`}>
        Video unavailable
      </div>
    );
  }

  const src = normalizedPlaylistId
    ? `https://www.youtube.com/embed/videoseries?list=${normalizedPlaylistId}&rel=0&modestbranding=1&playsinline=1`
    : `https://www.youtube.com/embed/${normalizedVideoId}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className={`overflow-hidden rounded-[26px] border border-black/5 bg-black shadow-[0_24px_48px_-28px_rgba(0,0,0,0.7)] ${className}`}>
      <div className="relative aspect-video w-full">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={src}
          title={title || "Lecture video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
        />
      </div>
    </div>
  );
}
