"use client";
import { useState, useEffect } from "react";
import { X, Save, Upload } from "lucide-react";
import * as XLSX from "xlsx";

interface Template {
  name: string;
}

interface EditTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
}

export function EditTemplateDialog({
  isOpen,
  onClose,
  templates,
}: EditTemplateDialogProps) {
  const [password, setPassword] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [workbook, setWorkbook] = useState<any>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setIsPasswordVerified(false);
      setSelectedTemplateId("");
      setWorkbook(null);
      setFileName("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasswordSubmit = () => {
    if (password === "admin123") {
      setIsPasswordVerified(true);
    } else {
      alert("Incorrect password!");
      setPassword("");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const wb = XLSX.read(data, { type: "binary" });
      setWorkbook(wb);
      setFileName(file.name);
    };
    reader.readAsBinaryString(file);
  };

  const handleSave = async () => {
    if (!selectedTemplateId) {
      setError("Please select a template file");
      return;
    }

    if (!workbook) {
      setError("Please upload a new Excel file");
      return;
    }

    try {
      const wbout = XLSX.write(workbook, {
        type: "array",
        bookType: "xlsx",
      });

      const file = new File([wbout], "template.xlsx", {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const formData = new FormData();
      formData.append("templateId", selectedTemplateId);
      formData.append("file", file);

      const res = await fetch("/api/templates/edit", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      onClose();
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to update template");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">EDIT TEMPLATE</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isPasswordVerified ? (
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter password"
              autoFocus
            />
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              VERIFY PASSWORD
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Template</option>
              {templates.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <label className="w-full h-10 bg-blue-100 border-2 border-dashed rounded-lg p-4 cursor-pointer flex items-center justify-center gap-2">
              <Upload className="w-5 h-5" />
              <span className="text-sm">
                {fileName || "Click to upload new Excel file"}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
              />
            </label>
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                SAVE
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
