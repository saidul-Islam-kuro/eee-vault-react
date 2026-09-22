import ModalOverlay from "./ModalOverlay";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSegsnkWGAJNW2wPb__Olf_A9AvrO4PquNFZ3Gydfk7d_JByFg/viewform?usp=header";

export default function UploadModal({ open, onClose }) {
  return (
    <ModalOverlay open={open} onClose={onClose} align="center">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 max-w-sm w-full text-center animate-pop-in"
      >
        <h3 className="text-slate-800 font-bold text-lg mb-2">Contribute Paper</h3>
        <p className="text-slate-500 text-sm mb-6">
          Please contact the admin or upload your scanned image/pdf files to the Google form to add a missing
          paper or note — kuro (^~^).
        </p>
        <button
          onClick={() => window.open(FORM_URL, "_blank")}
          className="tactile w-full bg-red-600 text-white font-bold py-3 rounded-2xl mb-2"
        >
          OPEN FORM
        </button>
        <button onClick={onClose} className="tactile w-full text-slate-400 font-bold py-2">
          CANCEL
        </button>
      </div>
    </ModalOverlay>
  );
}
