import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlayCircle, Video, FolderOpen, ChevronRight, ArrowLeft, Search } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import { useVaultDataContext } from "../context/VaultDataContext";
import { slugify } from "../lib/vault";

function flattenCourseVideos(course) {
  if (!course || !Array.isArray(course.videos)) return [];

  return course.videos.flatMap((module) => {
    if (module?.playlistId) {
      return [{
        title: module.title || module.name || "Playlist",
        playlistId: module.playlistId,
        type: module.type || "Playlist",
        moduleTitle: module.title || module.name || "Module",
        key: `playlist-${module.playlistId}`,
      }];
    }

    const list = Array.isArray(module?.classes)
      ? module.classes
      : Array.isArray(module?.items)
        ? module.items
        : Array.isArray(module?.playlists)
          ? module.playlists
          : [];

    return list.map((item) => ({
      ...item,
      key: item.videoId || `${module?.title || module?.name || "module"}-${item.title}`,
      moduleTitle: module?.title || module?.name || "Module",
    }));
  });
}

export default function VideosPage() {
  const { courseData, status } = useVaultDataContext();
  const { courseCode } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCourseCode, setSelectedCourseCode] = useState(courseCode || "");
  const [activeMediaKey, setActiveMediaKey] = useState("");

  useEffect(() => {
    setSelectedCourseCode(courseCode || "");
  }, [courseCode]);

  const coursesWithVideoCount = useMemo(
    () =>
      courseData
        .map((course) => ({
          ...course,
          videoCount: flattenCourseVideos(course).length,
        }))
        .filter((course) => {
          const q = query.trim().toLowerCase();
          if (!q) return true;
          return (
            course.title.toLowerCase().includes(q) ||
            course.code.toLowerCase().includes(q) ||
            (course.semester || "").toLowerCase().includes(q)
          );
        }),
    [courseData, query]
  );

  const selectedCourse = useMemo(() => {
    if (!coursesWithVideoCount.length) return null;

    if (selectedCourseCode) {
      return (
        coursesWithVideoCount.find(
          (course) => slugify(course.code) === selectedCourseCode || course.code === selectedCourseCode
        ) || coursesWithVideoCount[0]
      );
    }

    return coursesWithVideoCount.find((course) => course.videoCount > 0) || coursesWithVideoCount[0];
  }, [coursesWithVideoCount, selectedCourseCode]);

  const courseVideoItems = useMemo(() => flattenCourseVideos(selectedCourse), [selectedCourse]);

  useEffect(() => {
    if (!selectedCourse || courseVideoItems.length === 0) {
      setActiveMediaKey("");
      return;
    }

    setActiveMediaKey((current) => {
      if (current && courseVideoItems.some((item) => item.key === current)) return current;
      return courseVideoItems[0].key;
    });
  }, [selectedCourse, courseVideoItems]);

  const activeVideo = useMemo(
    () => courseVideoItems.find((item) => item.key === activeMediaKey) || courseVideoItems[0] || null,
    [courseVideoItems, activeMediaKey]
  );

  const groupedModules = useMemo(() => {
    if (!selectedCourse || !Array.isArray(selectedCourse.videos)) return [];

    return selectedCourse.videos.map((module) => {
      if (module?.playlistId) {
        return {
          ...module,
          items: [{
            title: module.title || module.name || "Playlist",
            playlistId: module.playlistId,
            type: module.type || "Playlist",
            key: `playlist-${module.playlistId}`,
            moduleTitle: module.title || module.name || "Module",
          }],
        };
      }

      const items = Array.isArray(module?.classes)
        ? module.classes
        : Array.isArray(module?.items)
          ? module.items
          : Array.isArray(module?.playlists)
            ? module.playlists
            : [];

      return {
        ...module,
        items: items.map((item) => ({
          ...item,
          key: item.videoId || `${module?.title || module?.name || "module"}-${item.title}`,
          moduleTitle: module?.title || module?.name || "Module",
        })),
      };
    });
  }, [selectedCourse]);

  if (status === "loading") {
    return <div className="py-16 text-center text-sm text-black/55">Loading video library…</div>;
  }

  if (status === "error") {
    return <div className="py-16 text-center text-sm text-[#d92a2a]">Couldn't load the video data.</div>;
  }

  if (courseCode && selectedCourse) {
    const courseList = groupedModules.flatMap((module) => module.items || []);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/videos")}
            className="tactile inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black/65"
          >
            <ArrowLeft size={14} />
            All courses
          </button>
        </div>

        <div className="rounded-[32px] border border-black/5 bg-white/90 p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.42)] md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-[#fff3f3] p-2 text-[#d92a2a]">
              <Video size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-black/50">{selectedCourse.code}</p>
              <h3 className="text-xl font-black tracking-[-0.04em] text-black">{selectedCourse.title}</h3>
            </div>
          </div>

          {activeVideo ? (
            <div className="grid gap-5 xl:grid-cols-[1.7fr_0.9fr]">
              <div>
                <VideoPlayer
                  videoId={activeVideo.videoId}
                  playlistId={activeVideo.playlistId}
                  title={activeVideo.title}
                />
                <div className="mt-4 rounded-2xl border border-black/5 bg-[#faf9f7] p-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#d92a2a]">
                    <FolderOpen size={12} />
                    {activeVideo.moduleTitle}
                  </div>
                  <h4 className="mt-2 text-lg font-black tracking-[-0.04em] text-black">{activeVideo.title}</h4>
                </div>
              </div>

              <aside className="min-h-[280px] rounded-[28px] border border-black/5 bg-[#faf9f7] p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-black/55">Course videos</h4>
                  <span className="text-[10px] font-bold text-black/45">{courseList.length}</span>
                </div>

                <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
                  {groupedModules.map((module) => (
                    <div key={`${selectedCourse.code}-${module.title || module.name}`}>
                      <div className="mb-2 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
                        {module.title || module.name}
                      </div>
                      <div className="space-y-2">
                        {(module.items || []).map((item) => {
                          const selected = item.key === activeVideo.key;
                          return (
                            <button
                              key={item.key || `${selectedCourse.code}-${item.title}`}
                              type="button"
                              onClick={() => setActiveMediaKey(item.key)}
                              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                                selected
                                  ? "border-[#f0b0b0] bg-[#fff3f3]"
                                  : "border-black/5 bg-white"
                              }`}
                            >
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${selected ? "bg-[#d92a2a] text-white" : "bg-[#f5f3ee] text-black/60"}`}>
                                <PlayCircle size={16} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-black">{item.title}</p>
                                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
                                  {item.type || "Lecture"}
                                </p>
                              </div>
                              <ChevronRight size={16} className="text-black/30" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-black/10 bg-[#faf9f7] p-8 text-center text-sm font-bold uppercase tracking-[0.2em] text-black/45">
              No video available for this course yet
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-black/65">
          Video Classes
        </div>
        <h2 className="mt-4 text-2xl font-black tracking-[-0.04em] text-black">Video Classes &amp; Playlists</h2>
        <p className="mt-1 text-sm text-black/65">Browse course lessons, modules, and lecture playlists.</p>
      </div>

      <div className="glass-card mb-6 rounded-[28px] border border-black/5 bg-white/90 p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.42)] md:p-5">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-black/45" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search course, code, or semester..."
            className="w-full rounded-2xl border border-black/5 bg-[#f9f8f6] py-3 pl-12 pr-4 text-sm text-black outline-none transition focus:border-[#d92a2a]"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {coursesWithVideoCount.map((course) => {
          const available = course.videoCount > 0;

          return (
            <button
              key={course.code}
              type="button"
              onClick={() => navigate(`/videos/${slugify(course.code)}`)}
              className="tactile group rounded-[30px] border border-black/5 bg-white/90 p-5 text-left shadow-[0_18px_40px_-30px_rgba(0,0,0,0.42)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-28px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-[#f5d0d0] bg-[#fff3f3] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d92a2a]">
                  {course.code}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-black/45">
                  {available ? `${course.videoCount} videos` : "Missing"}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-black leading-snug tracking-[-0.04em] text-black">{course.title}</h3>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-black/45">{course.semester}</p>
              <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-black/5 bg-[#faf9f7] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-black/60">
                <span className="flex items-center gap-2">
                  <PlayCircle size={14} className={available ? "text-[#d92a2a]" : "text-black/40"} />
                  {available ? "Available" : "No videos"}
                </span>
                <ChevronRight size={14} className="text-black/40 transition group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
