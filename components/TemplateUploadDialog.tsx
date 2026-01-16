import { useState } from "react";
import { X, Upload, Lock } from "lucide-react";
import * as XLSX from "xlsx";

interface TemplateUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadTemplate: (name: string, workbook: any) => void;
}

export function TemplateUploadDialog({
  isOpen,
  onClose,
  onUploadTemplate,
}: TemplateUploadDialogProps) {
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const getTemplateNameFromFile = () =>
    selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError("");
    }
  };

  const handleUpload = async () => {
    setError("");

    if (password !== "admin123") {
      setError("Incorrect password!");
      return;
    }

    if (!selectedFile) {
      setError("Please select a template file!");
      return;
    }

    const templateName = getTemplateNameFromFile();

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("templateName", templateName);

      const res = await fetch("/api/templates/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      handleClose();
    } catch {
      setError("Failed to upload template");
    }
  };

  const handleClose = () => {
    setPassword("");
    setSelectedFile(null);
    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-green-600 to-green-700 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6" />
            <h2 className="text-xl font-bold">UPLOAD TEMPLATE</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-300 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Template Name */}

          {/* File Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Template File
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="file-input w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              Password
              <Lock className="w-4 h-4" />
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:outline-none"
              placeholder="Enter password"
              onKeyDown={(e) => e.key === "Enter" && handleUpload()}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 mb-1 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            CANCEL
          </button>
          <button
            onClick={handleUpload}
            className="px-6 py-2 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg font-medium transition shadow-xs hover:from-green-700 hover:to-green-800"
          >
            UPLOAD
          </button>
        </div>
      </div>
    </div>
  );
}
