import { useState } from 'react';
import { X, Upload, Lock } from 'lucide-react';
import * as XLSX from 'xlsx';

interface TemplateUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadTemplate: (name: string, workbook: any) => void;
}

export function TemplateUploadDialog({ isOpen, onClose, onUploadTemplate }: TemplateUploadDialogProps) {
  const [password, setPassword] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-populate template name from filename (without extension)
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setTemplateName(nameWithoutExt);
      setError('');
    }
  };

  const handleUpload = async () => {
    setError('');

    // Verify password
    if (password !== 'admin123') {
      setError('Incorrect password!');
      return;
    }

    // Verify template name
    if (!templateName.trim()) {
      setError('Please enter a template name!');
      return;
    }

    // Verify file selected
    if (!selectedFile) {
      setError('Please select a template file!');
      return;
    }

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      onUploadTemplate(templateName.trim(), workbook);
      
      // Reset form
      setPassword('');
      setTemplateName('');
      setSelectedFile(null);
      onClose();
    } catch (err) {
      setError('Failed to read template file. Please ensure it is a valid Excel file.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setTemplateName('');
    setSelectedFile(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6" />
            <h2 className="text-xl font-bold">Upload Template</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter template name"
            />
          </div>

          {/* File Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Template File
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                ✓ {selectedFile.name}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter password"
              onKeyPress={(e) => e.key === 'Enter' && handleUpload()}
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
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
          >
            Upload Template
          </button>
        </div>
      </div>
    </div>
  );
}
