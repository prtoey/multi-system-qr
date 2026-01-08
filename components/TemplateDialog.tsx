import { X, Upload, FileText } from "lucide-react";

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isPasswordVerified: boolean;
  templatePassword: string;
  errorMessage: string;
  onPasswordChange: (password: string) => void;
  onVerifyPassword: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  templateFile: File | null;
  handleClearFile: () => void;
}

export function TemplateDialog({
  isOpen,
  onClose,
  isPasswordVerified,
  templatePassword,
  errorMessage,
  onPasswordChange,
  onVerifyPassword,
  onFileSelect,
  templateFile,
  handleClearFile,
}: TemplateDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-indigo-900">Upload Template</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isPasswordVerified ? (
          // Password verification step
          <>
            <p className="text-gray-600 mb-6">
              Please enter the password to upload template
            </p>

            <div className="space-y-4">
              <input
                type="password"
                value={templatePassword}
                onChange={(e) => onPasswordChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onVerifyPassword()}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:border-indigo-500 text-lg"
                autoFocus
              />
              {errorMessage && (
                <p className="text-red-500 text-sm text-center">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={onVerifyPassword}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-500 transition font-medium text-md"
              >
                🔒 Verify Password
              </button>
            </div>
          </>
        ) : !templateFile ? (
          <>
            <p className="text-gray-600 mb-6">
              Select an Excel template file (.xlsx or .xls) to import
            </p>

            <label className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-500 transition flex items-center justify-center gap-3 font-medium">
              <Upload className="w-6 h-6" />
              Choose Template File
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={onFileSelect}
              />
            </label>
          </>
        ) : (
          <div className="space-y-4">
            {/* File Preview Card */}
            <div className="flex items-center justify-between rounded-lg border border-indigo-300 bg-indigo-50 p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {templateFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(templateFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <button
                onClick={handleClearFile}
                className="text-red-500 hover:text-red-700 transition"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  // 🔹 call upload / submit logic here
                  console.log("Upload template");
                }}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition font-medium"
              >
                Upload Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
