import SessionButton from "./SessionButton";
import { BATCHES, isMissingLink } from "../lib/vault";

export default function CourseCard({ course, onOpenPaper, onMissing }) {
  return (
    <div className="glass-card p-6 rounded-3xl shadow-[0_18px_40px_-30px_rgba(0,0,0,0.4)] border border-black/5 bg-white/90 mb-4">
      <div className="flex flex-col gap-3">
        <div>
          <span className="text-[10px] font-black text-[#d92a2a] bg-[#fff3f3] px-2 py-0.5 rounded uppercase border border-[#f6d7d7]">
            {course.code}
          </span>
          <h3 className="text-lg font-bold text-black leading-tight mt-1">{course.title}</h3>
        </div>
        <div className="scroll-x-snap no-scrollbar pb-1">
          {BATCHES.map((batch) => {
            const link = course.links ? course.links[batch] : null;
            const missing = isMissingLink(link);
            return (
              <SessionButton
                key={batch}
                label={batch}
                sublabel={missing ? "Missing" : "Open"}
                available={!missing}
                onClick={() => (missing ? onMissing() : onOpenPaper(course, batch))}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
