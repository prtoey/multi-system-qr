import { FileText } from "lucide-react";

interface TemplateButtonProps {
  onClick: () => void;
}

export function TemplateButton({ onClick }: TemplateButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-green-600 to-green-700 text-xs text-white px-6 py-2 rounded-lg shadow-lg font-semibold flex items-center justify-start gap-2 transition hover:from-green-700 hover:to-green-800 hover:shadow-xl"
    >
      <FileText className="text-xs" />
      UPLOAD TEMPLATE
    </button>
  );
}
