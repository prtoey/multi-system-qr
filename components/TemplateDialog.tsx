import { X, Upload } from 'lucide-react';

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isPasswordVerified: boolean;
  templatePassword: string;
  onPasswordChange: (password: string) => void;
  onVerifyPassword: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TemplateDialog({
  isOpen,
  onClose,
  isPasswordVerified,
  templatePassword,
  onPasswordChange,
  onVerifyPassword,
  onFileSelect,
}: TemplateDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
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
                onKeyPress={(e) => e.key === 'Enter' && onVerifyPassword()}
                placeholder="Enter password"
                className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none focus:border-indigo-500 text-lg"
                autoFocus
              />

              <button
                onClick={onVerifyPassword}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 transition font-medium text-lg"
              >
                Verify Password
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              🔒 Password protected area
            </div>
          </>
        ) : (
          // File upload step (shown after password verification)
          <>
            <p className="text-gray-600 mb-6">
              Select an Excel template file (.xlsx or .xls) to import
            </p>

            <label className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-4 rounded-lg shadow-md cursor-pointer hover:from-indigo-600 hover:to-purple-600 transition flex items-center justify-center gap-3 font-medium">
              <Upload className="w-6 h-6" />
              Choose Template File
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={onFileSelect}
              />
            </label>

            <div className="mt-4 text-center text-sm text-gray-500">
              Supported formats: Excel (.xlsx, .xls)
            </div>
          </>
        )}
      </div>
    </div>
  );
}
