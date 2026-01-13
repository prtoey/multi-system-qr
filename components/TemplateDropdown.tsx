import { FileSpreadsheet, Trash2 } from "lucide-react";
import { TemplateConfig } from "../components/types";

interface TemplateDropdownProps {
  templates: TemplateConfig[];
  selectedTemplateId: string | null;
  onTemplateChange: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
  showDelete?: boolean;
}

export function TemplateDropdown({
  templates,
  selectedTemplateId,
  onTemplateChange,
  onDeleteTemplate,
  showDelete = false,
}: TemplateDropdownProps) {
  if (templates.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <FileSpreadsheet className="w-5 h-5" />
        <span className="text-sm font-medium">No templates available</span>
      </div>
    );
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const handleDelete = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const template = templates.find((t) => t.id === templateId);
    if (
      template &&
      confirm(`Are you sure you want to delete template "${template.name}"?`)
    ) {
      onDeleteTemplate?.(templateId);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <FileSpreadsheet className="w-12 h-12 text-green-700 bg-green-100 rounded-lg p-2" />
      <select
        value={selectedTemplateId || ""}
        onChange={(e) => onTemplateChange(e.target.value)}
        className="flex-1 bg-green-50 border border-green-400 rounded-lg px-3 py-3 text-gray-900  font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        <option value="" disabled>
          SELECT TEMPLATE
        </option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>

      {showDelete && selectedTemplate && (
        <button
          onClick={(e) => handleDelete(selectedTemplate.id, e)}
          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
          title="Delete template"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
