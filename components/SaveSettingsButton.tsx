import { Save } from "lucide-react";

interface SaveSettingsButtonProps {
  onClick: () => void;
}

export function SaveSettingsButton({ onClick }: SaveSettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-600 text-white px-8 py-3 rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-700 transition font-bold text-sm"
    >
      <Save className="w-6 h-6" />
      SAVE ALL SETTINGS
    </button>
  );
}
