import { QrCode } from 'lucide-react';

interface GenerateQRButtonProps {
  onClick: () => void;
}

export function GenerateQRButton({ onClick }: GenerateQRButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md flex items-center gap-2 hover:bg-indigo-700 transition font-medium"
    >
      <QrCode className="w-5 h-5" />
      GENERATE QR CODE
    </button>
  );
}
