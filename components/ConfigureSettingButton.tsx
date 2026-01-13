import { Settings } from "lucide-react";

interface ConfigureSettingButtonProps {
  onClick: () => void;
}

export function ConfigureSettingButton({
  onClick,
}: ConfigureSettingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 px-4 py-2 rounded-lg shadow border border-gray-400 flex items-center gap-2 hover:bg-indigo-50 transition"
    >
      <Settings className="w-5 h-5 text-gray-600" />
    </button>
  );
}
