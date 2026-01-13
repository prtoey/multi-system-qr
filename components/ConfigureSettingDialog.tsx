import { X } from "lucide-react";
import { SystemConfig, LabelConfig, TemplateConfig } from "../components/types";
import { SaveSettingsButton } from "./SaveSettingsButton";
import { ResetSettingsButton } from "./ResetSettingsButton";
import { AddDataButton } from "./AddDataButton";
import { AddTypedDataButton } from "./AddTypedDataButton";
import { DeleteRowButton } from "./DeleteRowButton";
import { TemplateDropdown } from "./TemplateDropdown";

interface ConfigureSettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  labels: LabelConfig;
  onLabelsChange: (labels: LabelConfig) => void;
  itemDataCell: string;
  itemQRCell: string;
  lotDataCell: string;
  lotQRCell: string;
  qtyDataCell: string;
  qtyQRCell: string;
  onItemDataCellChange: (value: string) => void;
  onItemQRCellChange: (value: string) => void;
  onLotDataCellChange: (value: string) => void;
  onLotQRCellChange: (value: string) => void;
  onQtyDataCellChange: (value: string) => void;
  onQtyQRCellChange: (value: string) => void;
  systems: SystemConfig[];
  onAddDataRow: (systemId: string) => void;
  onAddTypedDataRow: (systemId: string) => void;
  onRemoveDataRow: (systemId: string, rowId: string) => void;
  onUpdateDataRow: (
    systemId: string,
    rowId: string,
    field:
      | "itemDataCell"
      | "itemQRCell"
      | "itemDataLabel"
      | "itemQRLabel"
      | "type",
    value: string
  ) => void;
  onSaveSettings: () => void;
  onResetSettings: () => void;
  templates: TemplateConfig[];
  selectedTemplateId: string | null;
  onTemplateChange: (templateId: string) => void;
}

export function ConfigureSettingDialog({
  isOpen,
  onClose,
  labels,
  onLabelsChange,
  itemDataCell,
  itemQRCell,
  lotDataCell,
  lotQRCell,
  qtyDataCell,
  qtyQRCell,
  onItemDataCellChange,
  onItemQRCellChange,
  onLotDataCellChange,
  onLotQRCellChange,
  onQtyDataCellChange,
  onQtyQRCellChange,
  systems,
  onAddDataRow,
  onAddTypedDataRow,
  onRemoveDataRow,
  onUpdateDataRow,
  onSaveSettings,
  onResetSettings,
  templates,
  selectedTemplateId,
  onTemplateChange,
}: ConfigureSettingDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white p-6 border-b border-indigo-200 rounded-t-xl flex items-center justify-between">
          <h2 className="text-2xl font-bold text-indigo-900">
            Configure Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Template Selector */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
            <TemplateDropdown
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onTemplateChange={onTemplateChange}
            />
          </div>

          {/* Global Settings */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={labels.itemDataLabel}
                  onChange={(e) =>
                    onLabelsChange({ ...labels, itemDataLabel: e.target.value })
                  }
                  className="bg-indigo-100 text-indigo-900 px-3 py-1 w-32 rounded font-medium border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Label name"
                />
                <input
                  type="text"
                  value={itemDataCell}
                  onChange={(e) => onItemDataCellChange(e.target.value)}
                  className="px-3 py-1 border border-indigo-300 rounded flex-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 text-indigo-900 px-3 py-1 w-32 rounded font-medium border border-indigo-300">
                  {labels.itemQRLabel}
                </div>
                <input
                  type="text"
                  value={itemQRCell}
                  onChange={(e) => onItemQRCellChange(e.target.value)}
                  className="px-3 py-1 border border-indigo-300 rounded flex-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={labels.lotDataLabel}
                  onChange={(e) =>
                    onLabelsChange({ ...labels, lotDataLabel: e.target.value })
                  }
                  className="bg-indigo-100 text-indigo-900 px-3 py-1 w-32 rounded font-medium border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Label name"
                />
                <input
                  type="text"
                  value={lotDataCell}
                  onChange={(e) => onLotDataCellChange(e.target.value)}
                  className="px-3 py-1 border border-indigo-300 rounded flex-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 text-indigo-900 px-3 py-1 w-32 rounded font-medium border border-indigo-300">
                  {labels.lotQRLabel}
                </div>
                <input
                  type="text"
                  value={lotQRCell}
                  onChange={(e) => onLotQRCellChange(e.target.value)}
                  className="px-3 py-1 border border-indigo-300 rounded flex-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={labels.qtyDataLabel}
                  onChange={(e) =>
                    onLabelsChange({ ...labels, qtyDataLabel: e.target.value })
                  }
                  className="bg-indigo-100 text-indigo-900 px-3 py-1 w-32 rounded font-medium border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Label name"
                />
                <input
                  type="text"
                  value={qtyDataCell}
                  onChange={(e) => onQtyDataCellChange(e.target.value)}
                  className="px-3 py-1 border border-indigo-300 rounded flex-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-indigo-100 text-indigo-900 px-3 py-1 w-32 rounded font-medium border border-indigo-300">
                  {labels.qtyQRLabel}
                </div>
                <input
                  type="text"
                  value={qtyQRCell}
                  onChange={(e) => onQtyQRCellChange(e.target.value)}
                  className="px-3 py-1 border border-indigo-300 rounded flex-1 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Systems */}
          {systems.map((system, index) => (
            <div key={system.id}>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-t-lg shadow-md font-semibold">
                {index + 1}. {system.name}
              </div>
              <div className="bg-white p-4 rounded-b-lg shadow-md border border-blue-200">
                {system.fields.length > 0 ? (
                  // Single row system (PROMOS SYSTEM)
                  <div className="grid grid-cols-5 gap-2">
                    {system.fields.map((field, idx) => (
                      <div key={idx}>
                        <div className="bg-blue-100 text-blue-900 px-2 py-1 text-sm mb-1 rounded font-medium">
                          {field.label}
                        </div>
                        <input
                          type="text"
                          value={field.cell}
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Multiple row system
                  <div className="space-y-2">
                    {system.name === "PRINT LABEL" ? (
                      // Special layout for PRINT LABEL with type grouping
                      <>
                        {/* Group rows by type */}
                        {["BOX", "BAG", "MATCHING", null].map((typeGroup) => {
                          const rowsInGroup = system.dataRows.filter((row) =>
                            typeGroup === null
                              ? !row.type
                              : row.type === typeGroup
                          );

                          if (rowsInGroup.length === 0) return null;

                          return (
                            <div key={typeGroup || "no-type"} className="mb-4">
                              {/* Type Group Header */}
                              {typeGroup && (
                                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-t-lg font-bold text-sm mb-2">
                                  TYPE: {typeGroup}
                                </div>
                              )}
                              {!typeGroup && (
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-t-lg font-bold text-sm mb-2">
                                  REGULAR DATA (NO TYPE)
                                </div>
                              )}

                              {/* Rows in this type group */}
                              <div className="space-y-2 border-2 border-purple-200 rounded-b-lg p-3 bg-purple-50/30">
                                {rowsInGroup.map((row) => (
                                  <div key={row.id}>
                                    {/* Show Type selector if row has type */}
                                    {row.type && (
                                      <div className="mb-2">
                                        <label className="text-sm font-medium text-blue-900 mr-2">
                                          Type:
                                        </label>
                                        <select
                                          value={row.type}
                                          onChange={(e) =>
                                            onUpdateDataRow(
                                              system.id,
                                              row.id,
                                              "type",
                                              e.target.value
                                            )
                                          }
                                          className="px-3 py-1 border border-blue-300 rounded bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none font-medium text-blue-900"
                                        >
                                          <option value="BOX">BOX</option>
                                          <option value="BAG">BAG</option>
                                          <option value="MATCHING">
                                            MATCHING
                                          </option>
                                        </select>
                                      </div>
                                    )}

                                    {/* Item Data and QR Together */}
                                    <div className="grid grid-cols-[150px_1fr_40px] gap-2 items-center bg-white p-2 rounded border border-purple-200">
                                      <input
                                        type="text"
                                        value={row.itemDataLabel || "ITEM DATA"}
                                        onChange={(e) =>
                                          onUpdateDataRow(
                                            system.id,
                                            row.id,
                                            "itemDataLabel",
                                            e.target.value
                                          )
                                        }
                                        className="bg-blue-100 text-blue-900 px-3 py-1 rounded font-medium border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-center"
                                        placeholder="Label name"
                                      />
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs text-blue-700 block mb-1">
                                            Data Cell
                                          </label>
                                          <input
                                            type="text"
                                            value={row.itemDataCell}
                                            onChange={(e) =>
                                              onUpdateDataRow(
                                                system.id,
                                                row.id,
                                                "itemDataCell",
                                                e.target.value
                                              )
                                            }
                                            className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            placeholder="e.g., BF3"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-blue-700 block mb-1">
                                            QR Cell
                                          </label>
                                          <input
                                            type="text"
                                            value={row.itemQRCell}
                                            onChange={(e) =>
                                              onUpdateDataRow(
                                                system.id,
                                                row.id,
                                                "itemQRCell",
                                                e.target.value
                                              )
                                            }
                                            className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            placeholder="e.g., A4"
                                          />
                                        </div>
                                      </div>
                                      <DeleteRowButton
                                        onClick={() =>
                                          onRemoveDataRow(system.id, row.id)
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      // Regular layout for other systems
                      <>
                        {system.dataRows.map((row) => (
                          <div key={row.id}>
                            {/* Item Data and QR Together */}
                            <div className="grid grid-cols-[150px_1fr_40px] gap-2 items-center bg-blue-50 p-2 rounded">
                              <input
                                type="text"
                                value={row.itemDataLabel || "ITEM DATA"}
                                onChange={(e) =>
                                  onUpdateDataRow(
                                    system.id,
                                    row.id,
                                    "itemDataLabel",
                                    e.target.value
                                  )
                                }
                                className="bg-blue-100 text-blue-900 px-3 py-1 rounded font-medium border border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-center"
                                placeholder="Label name"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-blue-700 block mb-1">
                                    Data Cell
                                  </label>
                                  <input
                                    type="text"
                                    value={row.itemDataCell}
                                    onChange={(e) =>
                                      onUpdateDataRow(
                                        system.id,
                                        row.id,
                                        "itemDataCell",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    placeholder="e.g., BF3"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-blue-700 block mb-1">
                                    QR Cell
                                  </label>
                                  <input
                                    type="text"
                                    value={row.itemQRCell}
                                    onChange={(e) =>
                                      onUpdateDataRow(
                                        system.id,
                                        row.id,
                                        "itemQRCell",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    placeholder="e.g., A4"
                                  />
                                </div>
                              </div>
                              <DeleteRowButton
                                onClick={() =>
                                  onRemoveDataRow(system.id, row.id)
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Show both buttons for PRINT LABEL system */}
                    {system.name === "PRINT LABEL" ? (
                      <div className="flex gap-2">
                        <AddDataButton
                          onClick={() => onAddDataRow(system.id)}
                        />
                        <AddTypedDataButton
                          onClick={() => onAddTypedDataRow(system.id)}
                        />
                      </div>
                    ) : (
                      <AddDataButton onClick={() => onAddDataRow(system.id)} />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Save/Reset Buttons in Dialog */}
        <div className="sticky bottom-0 bg-white border-t border-indigo-200 p-6 flex justify-center gap-4">
          <ResetSettingsButton onClick={onResetSettings} />
          <SaveSettingsButton
            onClick={() => {
              onSaveSettings();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
