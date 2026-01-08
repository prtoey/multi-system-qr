import { X } from 'lucide-react';

interface DeleteRowButtonProps {
  onClick: () => void;
  title?: string;
}

export function DeleteRowButton({ onClick, title = "Delete row" }: DeleteRowButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 text-white hover:bg-red-600 h-8 w-8 rounded transition flex items-center justify-center"
      title={title}
    >
      <X className="w-5 h-5" />
    </button>
  );
}
