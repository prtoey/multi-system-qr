import { Download } from 'lucide-react';

interface DownloadExampleButtonProps {
  onClick: () => void;
}

export function DownloadExampleButton({ onClick }: DownloadExampleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:from-purple-700 hover:to-purple-800 transition flex items-center gap-2 font-semibold"
    >
      <Download className="w-5 h-5" />
      DOWNLOAD EXAMPLE TEMPLATE
    </button>
  );
}
