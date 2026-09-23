import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import UploadModal from "./UploadModal";

export default function Layout() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f3] text-[#111111]">
      <TopBar onAddPaper={() => setUploadOpen(true)} />
      <main
        className="mx-auto max-w-6xl p-4 md:p-8"
        style={{ paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))" }}
      >
        <Outlet context={{ openUpload: () => setUploadOpen(true) }} />
      </main>
      <BottomNav />
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
