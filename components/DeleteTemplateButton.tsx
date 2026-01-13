import { Trash2 } from "lucide-react";

interface DeleteTemplateButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function DeleteTemplateButton({
  onClick,
  disabled,
}: DeleteTemplateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-xs text-white px-6 py-2 rounded-lg shadow-lg font-semibold flex items-center justify-start gap-2 transition ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:from-red-700 hover:to-red-800 hover:shadow-xl"
      }`}
    >
      <Trash2 className="text-xs" />
      DELETE TEMPLATE
    </button>
  );
}
