"use client";

import { useEffect, useRef, useState } from "react";
import {
  BiCheckCircle,
  BiError,
  BiErrorCircle,
  BiXCircle,
} from "react-icons/bi";
import { LuImport } from "react-icons/lu";

export type AlertDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  file?: File | null;
  setFile?: (file: File | null) => void;

  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
};

export default function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  file,
  setFile,
  loading = false,
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box w-100 p-5">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>
        <div className="flex items-center justify-center mt-4">
          <span className="flex size-10 items-center justify-center rounded-full ">
            {title === "Success" && (
              <BiCheckCircle className="size-10 text-green-600" />
            )}
            {title === "Warning" && (
              <BiError className="size-10 text-yellow-500" />
            )}
            {title === "Confirmation" && (
              <BiErrorCircle className="size-10 text-red-600" />
            )}
            {title === "Error" && (
              <BiXCircle className="size-10 text-red-600" />
            )}
            {title === "Import" && (
              <LuImport className="size-10 text-blue-600" />
            )}
          </span>
        </div>
        <p className="mt-6 mb-5 font-semibold text-center text-md text-gray-600">
          {message}
        </p>
        {title === "Confirmation" && (
          <div className="mt-6 flex justify-end gap-2 ">
            <button
              className="btn bg-red-600 hover:bg-red-700 text-white rounded-lg w-20"
              onClick={() => onConfirm?.()}
            >
              YES
            </button>
            <button
              className="btn bg-gray-500 hover:bg-gray-600 text-white rounded-lg w-20"
              onClick={onClose}
            >
              NO
            </button>
          </div>
        )}
        {title === "Import" && (
          <div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile?.(e.target.files?.[0] ?? null)}
              className="file-input w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:outline-none"
            />
            <div className="mt-6 flex justify-end gap-2 ">
              <button
                className="btn bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-20"
                onClick={onConfirm}
                disabled={!file}
              >
                UPLOAD
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
