import { Settings } from 'lucide-react';

interface ConfigureSettingButtonProps {
  onClick: () => void;
}

export function ConfigureSettingButton({ onClick }: ConfigureSettingButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="bg-white px-4 py-2 rounded-lg shadow border border-indigo-300 flex items-center gap-2 hover:bg-indigo-50 transition"
    >
      <Settings className="w-5 h-5 text-indigo-600" />
      <span className="text-indigo-900">CONFIGURE SETTING</span>
    </button>
  );
}
