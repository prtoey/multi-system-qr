"use client";

import { useEffect, useRef } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { BiError } from "react-icons/bi";
import { BiErrorCircle } from "react-icons/bi";
import { BiXCircle } from "react-icons/bi";

export type AlertDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;

  title: string;
  message: string;

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
  loading = false,
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isConfirm = Boolean(onConfirm);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box w-100 p-5">
        {/* Close button */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>

        {/* Icon + Title */}
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
          </span>
        </div>

        {/* Message */}
        <p className="mt-6 mb-5 font-semibold text-center text-md text-gray-600">
          {message}
        </p>

        {title === "Confirmation" && (
          <div className="mt-6 flex justify-end gap-2 ">
            <button
              className="btn bg-red-600 hover:bg-red-700 text-white rounded-lg w-20"
              onClick={onConfirm}
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
      </div>
    </dialog>
  );
}
