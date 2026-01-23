"use client";

import { useEffect, useRef } from "react";
import { BiXCircle } from "react-icons/bi";

export type ExcelValidationError = {
  systemName?: string;
  rowIndex: number;
  field: string;
  cell: string;
  label?: string;
};

type Props = {
  isOpen: boolean;
  errors: ExcelValidationError[];
  onClose: () => void;
};

export default function ExcelValidationDialog({
  isOpen,
  errors,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-5xl p-6">
        {/* Close */}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <BiXCircle className="text-red-600 text-3xl" />
          <h3 className="text-lg font-bold text-red-600">
            EXCEL VALIDATION ERRORS
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[60vh] border rounded-lg">
          <table className="table table-sm table-zebra">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th></th>
                <th>TYPE</th>
                <th>ROW</th>
                <th>FIELD</th>
                <th>CELL</th>
              </tr>
            </thead>
            <tbody>
              {errors.map((err, idx) => (
                <tr key={idx}>
                  <td className="font-semibold">{idx + 1}</td>
                  <td>{err.systemName ?? "-"}</td>
                  <td>{err.rowIndex}</td>
                  <td>
                    <span className="badge badge-error badge-outline">
                      {err.field}
                    </span>
                  </td>
                  <td className="font-mono text-red-600">{err.cell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            className="btn bg-gray-600 hover:bg-gray-700 text-white rounded-lg w-24"
            onClick={onClose}
          >
            CLOSE
          </button>
        </div>
      </div>
    </dialog>
  );
}
