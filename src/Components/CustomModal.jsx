import ReactModal from "react-modal";
ReactModal.setAppElement("#root");

export default function CustomModal({ isOpen, onClose, children }) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Custom Modal"
      className="bg-white p-6 rounded-md w-[1000px] max-h-96 overflow-y-auto relative mx-auto mt-20 shadow-xl outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
      >
        ✖
      </button>
      {children}
    </ReactModal>
  );
}
