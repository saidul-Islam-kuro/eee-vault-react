const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const MEDIA_ID_PATTERN = /^[A-Za-z0-9_-]{11,128}$/;

function readYouTubeUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return { videoId: "", playlistId: "" };

  const playlistMatch = raw.match(/[?&]list=([A-Za-z0-9_-]+)/i);
  const videoMatch = raw.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*?\bv=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&#/]|$)/i
  );

  return {
    videoId: videoMatch?.[1] || "",
    playlistId: playlistMatch?.[1] || "",
  };
}

export function normalizeYouTubeMedia({ videoId, playlistId } = {}) {
  const values = [playlistId, videoId]
    .filter(Boolean)
    .map((value) => String(value).trim());
  const parsedUrls = values.map(readYouTubeUrl);
  const playlistFromUrl = parsedUrls.find((media) => media.playlistId)?.playlistId;
  if (playlistFromUrl) return { videoId: "", playlistId: playlistFromUrl };

  const videoFromUrl = parsedUrls.find((media) => media.videoId)?.videoId;
  if (videoFromUrl) return { videoId: videoFromUrl, playlistId: "" };

  const bareIds = values.filter((value) => MEDIA_ID_PATTERN.test(value));
  const bareVideoId = bareIds.find((value) => VIDEO_ID_PATTERN.test(value));
  if (bareVideoId) return { videoId: bareVideoId, playlistId: "" };

  const barePlaylistId = bareIds.find((value) => !VIDEO_ID_PATTERN.test(value));
  if (barePlaylistId) return { videoId: "", playlistId: barePlaylistId };

  return { videoId: "", playlistId: "" };
}
