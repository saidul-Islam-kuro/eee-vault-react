import ModalOverlay from "./ModalOverlay";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSegsnkWGAJNW2wPb__Olf_A9AvrO4PquNFZ3Gydfk7d_JByFg/viewform?usp=header";

export default function UploadModal({ open, onClose }) {
  return (
    <ModalOverlay open={open} onClose={onClose} align="center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 max-w-sm w-full text-center animate-pop-in border border-black/5 shadow-[0_24px_50px_-30px_rgba(0,0,0,0.5)]"
      >
        <h3 className="text-black font-bold text-lg mb-2">Contribute Paper</h3>
        <p className="text-black/60 text-sm mb-6">
          Please contact the admin or upload your scanned image/pdf files to the Google form to add a missing
          paper or note — kuro (^~^).
        </p>
        <button
          onClick={() => window.open(FORM_URL, "_blank")}
          className="tactile w-full bg-[#d92a2a] text-white font-bold py-3 rounded-2xl mb-2"
        >
          OPEN FORM
        </button>
        <button onClick={onClose} className="tactile w-full text-black/50 font-bold py-2">
          CANCEL
        </button>
      </div>
    </ModalOverlay>
  );
}
