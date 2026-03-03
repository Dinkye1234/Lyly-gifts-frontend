// src/components/SearchModal.js

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { IoSearchOutline } from "react-icons/io5";
import SearchModal from "./SearchModal";

// Энэ компонент гаднаасаа 2 prop авна:
// isOpen: Modal нээлттэй эсэхийг заах boolean утга
// onClose: Modal-г хаах үед дуудагдах функц
export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Энд хайлтын логикийг хийнэ
    console.log("Хайж байна:", searchQuery);
    onClose(); // Хайсны дараа modal-г хаах
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Modal-ын ард байрлах хар фон */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      {/* Modal-ын үндсэн контент */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-start sm:p-6">
          <DialogPanel
            transition
            className="relative w-full max-w-lg transform text-left text-base shadow-2xl transition data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <form
              onSubmit={handleSearch}
              className="relative rounded-xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10"
            >
              <div className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400">
                <IoSearchOutline aria-hidden="true" className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus // Modal нээгдэхэд шууд энд focus хийнэ
                placeholder="Бэлэг хайх..."
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm dark:text-white"
              />
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
