import { FileText } from 'lucide-react';

interface TemplateButtonProps {
  onClick: () => void;
}

export function TemplateButton({ onClick }: TemplateButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="bg-white px-4 py-2 rounded-lg shadow border border-indigo-300 flex items-center gap-2 hover:bg-indigo-50 transition"
    >
      <FileText className="w-5 h-5 text-indigo-600" />
      <span className="text-indigo-900">TEMPLATE</span>
    </button>
  );
}
