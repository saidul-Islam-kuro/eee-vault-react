import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import UploadModal from "./UploadModal";

export default function Layout() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <TopBar onAddPaper={() => setUploadOpen(true)} />
      <main
        className="max-w-6xl mx-auto p-4 md:p-8"
        style={{ paddingBottom: "calc(88px + env(safe-area-inset-bottom, 0px))" }}
      >
        <Outlet context={{ openUpload: () => setUploadOpen(true) }} />
      </main>
      <BottomNav />
      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
