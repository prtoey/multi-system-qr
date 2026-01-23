import { FileSpreadsheet } from "lucide-react";
import { TemplateConfig } from "../components/types";

interface TemplateSelectorProps {
  templates: TemplateConfig[];
  selectedTemplateId?: string | null;
  onTemplateChange: (templateId: string) => void;
}

export function TemplateSelector({
  templates,
  selectedTemplateId,
  onTemplateChange,
}: TemplateSelectorProps) {
  if (templates.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg">
        No templates uploaded yet. Please upload a template first.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Select Template
      </label>

      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${
              selectedTemplateId === template.id
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 bg-white hover:border-indigo-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet
                className={`w-5 h-5 ${
                  selectedTemplateId === template.id
                    ? "text-indigo-600"
                    : "text-gray-400"
                }`}
              />
              <div>
                <div
                  className={`font-semibold ${
                    selectedTemplateId === template.id
                      ? "text-indigo-900"
                      : "text-gray-900"
                  }`}
                >
                  {template.name}
                </div>
                <div className="text-xs text-gray-500">
                  Uploaded: {new Date(template.uploadedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
