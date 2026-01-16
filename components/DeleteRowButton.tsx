import { X } from "lucide-react";

interface DeleteRowButtonProps {
  onClick: () => void;
  title?: string;
}

export function DeleteRowButton({
  onClick,
  title = "Delete row",
}: DeleteRowButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 text-white hover:bg-red-600 h-6 w-6 rounded transition flex items-center justify-center"
      title={title}
    >
      <X className="w-3 h-3" />
    </button>
  );
}
