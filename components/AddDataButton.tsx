import { Plus } from 'lucide-react';

interface AddDataButtonProps {
  onClick: () => void;
}

export function AddDataButton({ onClick }: AddDataButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 mt-4 hover:bg-blue-700 transition font-medium"
    >
      <Plus className="w-5 h-5" />
      ADD DATA
    </button>
  );
}
