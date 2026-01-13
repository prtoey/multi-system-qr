import { useState, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Template {
  id: string;
  name: string;
}

interface EditTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSave: (templateId: string, newWorkbook: any) => void;
}

export function EditTemplateDialog({ isOpen, onClose, templates, onSave }: EditTemplateDialogProps) {
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [workbook, setWorkbook] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setIsPasswordVerified(false);
      setSelectedTemplateId('');
      setWorkbook(null);
      setFileName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasswordSubmit = () => {
    if (password === 'admin123') {
      setIsPasswordVerified(true);
    } else {
      alert('Incorrect password!');
      setPassword('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const wb = XLSX.read(data, { type: 'binary' });
      setWorkbook(wb);
      setFileName(file.name);
    };
    reader.readAsBinaryString(file);
  };

  const handleSave = () => {
    if (!selectedTemplateId) {
      alert('Please select a template to edit');
      return;
    }

    if (!workbook) {
      alert('Please upload a new Excel file');
      return;
    }

    onSave(selectedTemplateId, workbook);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-900">Edit Template</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isPasswordVerified ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transition"
            >
              Verify Password
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Template to Edit:
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select Template --</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New Template File:
              </label>
              <label className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-200 transition flex items-center justify-center gap-2">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {fileName || 'Click to upload new Excel file'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                />
              </label>
              {fileName && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ New file selected: {fileName}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}