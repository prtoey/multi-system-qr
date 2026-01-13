import { Plus } from 'lucide-react';

interface AddTypedDataButtonProps {
  onClick: () => void;
}

export function AddTypedDataButton({ onClick }: AddTypedDataButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2 mt-4 hover:bg-purple-700 transition font-medium"
    >
      <Plus className="w-5 h-5" />
      ADD TYPED DATA (BOX/BAG/MATCHING)
    </button>
  );
}
