import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

interface Template {
  id: string;
  name: string;
}

interface DeleteTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onDelete: (templateId: string) => void;
}

export function DeleteTemplateDialog({ isOpen, onClose, templates, onDelete }: DeleteTemplateDialogProps) {
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setIsPasswordVerified(false);
      setSelectedTemplateId('');
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

  const handleDelete = () => {
    if (!selectedTemplateId) {
      alert('Please select a template to delete');
      return;
    }

    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return;

    if (confirm(`Are you sure you want to delete the template "${template.name}"?\n\nThis action cannot be undone.`)) {
      onDelete(selectedTemplateId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-900">Delete Template</h2>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter password"
                autoFocus
              />
            </div>
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition"
            >
              Verify Password
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Template to Delete:
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">-- Select Template --</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                ⚠️ Warning: This action cannot be undone. The template and all its configurations will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Template
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
