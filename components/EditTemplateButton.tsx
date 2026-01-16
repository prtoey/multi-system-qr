import { Edit } from "lucide-react";

interface EditTemplateButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function EditTemplateButton({
  onClick,
  disabled,
}: EditTemplateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-linear-to-r from-blue-600 to-blue-700 text-xs text-white px-6 py-2 rounded-lg shadow-lg font-semibold flex items-center justify-start gap-2 transition ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
      }`}
    >
      <Edit className="text-xs" />
      EDIT TEMPLATE
    </button>
  );
}
