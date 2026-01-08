import { RotateCcw } from 'lucide-react';

interface ResetSettingsButtonProps {
  onClick: () => void;
}

export function ResetSettingsButton({ onClick }: ResetSettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-500 text-white px-8 py-3 rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-600 transition font-bold text-lg"
    >
      <RotateCcw className="w-6 h-6" />
      RESET ALL SETTINGS
    </button>
  );
}
