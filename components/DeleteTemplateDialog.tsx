import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import AlertDialog from "../components/AlertDialog";

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

export function DeleteTemplateDialog({
  isOpen,
  onClose,
  templates,
  onDelete,
}: DeleteTemplateDialogProps) {
  const [password, setPassword] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const [openAlert, setOpenAlert] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [confirmMessage, setConfirmMessage] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setIsPasswordVerified(false);
      setSelectedTemplateId("");
      setDeleteId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePasswordSubmit = () => {
    if (password === "admin123") {
      setIsPasswordVerified(true);
    } else {
      setOpenError(true);
      setPassword("");
    }
  };

  const handleDeleteClick = () => {
    if (!selectedTemplateId) {
      setOpenAlert(true);
      return;
    }

    const template = templates.find((t) => t.id === selectedTemplateId);
    if (!template) return;

    setConfirmMessage(
      `Are you sure you want to delete template "${template.name}" ?`
    );
    setDeleteId(selectedTemplateId);
    setConfirmOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-900">DELETE TEMPLATE</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Enter password"
              autoFocus
            />
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
            >
              VERIFY PASSWORD
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>

            {/* <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-xs text-red-800">
                ⚠️ Warning ⚠️
                <br /> The template and all its configurations will be
                permanently deleted.
              </p>
            </div> */}

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleDeleteClick}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                DELETE
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ERROR */}
      <AlertDialog
        isOpen={openError}
        title="Error"
        message="Incorrect password!"
        onClose={() => setOpenError(false)}
      />

      {/* WARNING */}
      <AlertDialog
        isOpen={openAlert}
        title="Warning"
        message="Please select a template to delete."
        onClose={() => setOpenAlert(false)}
      />

      {/* CONFIRM DELETE */}
      <AlertDialog
        isOpen={confirmOpen}
        title="Confirmation"
        message={confirmMessage}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={() => {
          if (deleteId) {
            onDelete(deleteId);
          }
          setConfirmOpen(false);
          setDeleteId(null);
          onClose();
        }}
      />
    </div>
  );
}
