import { useState } from "react";
import { FileSpreadsheet, Trash2 } from "lucide-react";
import { TemplateOption } from "../components/types";
import AlertDialog from "./AlertDialog";
interface TemplateDropdownProps {
  templates: TemplateOption[];
  selectedTemplateId: string | null;
  onTemplateChange: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
  showDelete?: boolean;
}

export function TemplateDropdown({
  templates,
  selectedTemplateId,
  onTemplateChange,
}: TemplateDropdownProps) {
  if (templates.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <FileSpreadsheet className="w-12 h-12 text-gray-700 bg-gray-100 rounded-lg p-3" />
        <span className="text-md font-medium">No templates available</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <FileSpreadsheet className="w-12 h-12 text-green-700 bg-green-100 rounded-lg p-3" />
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
    </div>
  );
}
