import { X } from "lucide-react";
import {
  GlobalDataRow,
  SystemConfig,
  TemplateOption,
} from "../components/types";
import { SaveSettingsButton } from "./SaveSettingsButton";
import { AddDataButton } from "./AddDataButton";
import { AddTypedDataButton } from "./AddTypedDataButton";
import { DeleteRowButton } from "./DeleteRowButton";
import { TemplateDropdown } from "./TemplateDropdown";

interface ConfigureSettingDialogProps {
  isOpen: boolean;
  onClose: () => void;

  globalRows: GlobalDataRow[];

  addGlobalRow: () => void;
  removeGlobalRow: (rowId: string) => void;
  updateGlobalRow: (
    rowId: string,
    field: "itemDataLabel" | "itemDataCell" | "itemQRCell",
    value: string
  ) => void;
  systems: SystemConfig[];
  onUpdateSystemFieldCell: (
    systemId: string,
    fieldIndex: number,
    value: string
  ) => void;
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

  templates: TemplateOption[];
  selectedTemplateId: string | null;
  onTemplateChange: (templateId: string) => void;
}

export function ConfigureSettingDialog({
  isOpen,
  onClose,

  globalRows,
  addGlobalRow,
  removeGlobalRow,
  updateGlobalRow,

  systems,
  onUpdateSystemFieldCell,
  onAddDataRow,
  onAddTypedDataRow,
  onRemoveDataRow,
  onUpdateDataRow,
  onSaveSettings,

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
          <h2 className="text-xl font-bold text-black">CONFIGURE SETTINGS</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Template Selector */}
          <div className="mb-4 bg-white p-2 rounded-lg border border-green-500">
            <TemplateDropdown
              templates={templates}
              selectedTemplateId={selectedTemplateId}
              onTemplateChange={onTemplateChange}
            />
          </div>

          {/* Global Settings */}
          <div className="p-4 rounded-lg border border-green-500 space-y-1 text-sm">
            {globalRows.map((row) => (
              <div key={row.id}>
                {/* Item Data and QR Together */}
                <div className="grid grid-cols-[300px_1fr_40px] gap-2 items-end rounded">
                  <input
                    type="text"
                    value={row.itemDataLabel ?? ""}
                    onChange={(e) =>
                      updateGlobalRow(row.id, "itemDataLabel", e.target.value)
                    }
                    className="bg-gray-200 text-sm text-black px-3 py-1 rounded font-medium border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none text-center"
                    placeholder="Label name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-green-600 font-semibold block mb-1">
                        DATA
                      </label>
                      <input
                        type="text"
                        value={row.itemDataCell ?? ""}
                        onChange={(e) =>
                          updateGlobalRow(
                            row.id,
                            "itemDataCell",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 border border-green-600 rounded focus:ring-2 focus:ring-green-400 focus:outline-none"
                        placeholder="e.g., BF3"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-green-600 font-semibold block mb-1">
                        QR
                      </label>
                      <input
                        type="text"
                        value={row.itemQRCell ?? ""}
                        onChange={(e) =>
                          updateGlobalRow(row.id, "itemQRCell", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-green-600 rounded focus:ring-2 focus:ring-green-400 focus:outline-none"
                        placeholder="e.g., A4"
                      />
                    </div>
                  </div>
                  <div className="p-1">
                    <DeleteRowButton onClick={() => removeGlobalRow(row.id)} />
                  </div>
                </div>
              </div>
            ))}

            <AddDataButton onClick={addGlobalRow} />
          </div>

          {/* Systems */}
          {systems.map((system, index) => (
            <div key={system.id}>
              <div className="bg-green-700 text-white text-sm px-4 py-2 rounded-t-lg shadow-md font-semibold">
                {index + 1}. {system.name}
              </div>
              <div className="bg-white p-4 rounded-b-lg shadow-md border border-green-500">
                {system.fields.length > 0 ? (
                  // Single row system (PROMOS SYSTEM)
                  <div className="grid grid-cols-5 gap-2 text-sm">
                    {system.fields.map((field, idx) => (
                      <div key={idx}>
                        <div className="bg-gray-200 text-black px-2 py-1 text-sm mb-1 rounded font-medium">
                          {field.label}
                        </div>
                        <input
                          type="text"
                          value={field.cell}
                          onChange={(e) =>
                            onUpdateSystemFieldCell(
                              system.id,
                              idx,
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-green-500 rounded
             focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Multiple row system
                  <div className="space-y-2 text-sm ">
                    {system.name === "PRINT LABEL" ? (
                      // Special layout for PRINT LABEL with type grouping
                      <>
                        {/* Group rows by type */}
                        {["BAG", "BOX", "MATCHING", null].map((typeGroup) => {
                          const rowsInGroup = system.dataRows.filter((row) =>
                            typeGroup === null
                              ? !row.type
                              : row.type === typeGroup
                          );

                          if (rowsInGroup.length === 0) return null;

                          return (
                            <div key={typeGroup || "no-type"} className="mb-4 ">
                              {/* Type Group Header */}
                              {typeGroup && (
                                <div className="bg-green-600 text-white px-4 py-2 rounded-t-lg font-bold text-xs">
                                  {typeGroup}
                                </div>
                              )}
                              {!typeGroup && (
                                <div className="bg-green-600 text-white px-4 py-2 rounded-t-lg font-bold text-xs ">
                                  OTHERS
                                </div>
                              )}

                              {/* Rows in this type group */}
                              <div className="space-y-2 border-2 border-green-500 rounded-b-lg p-3 bg-green-50/30">
                                {rowsInGroup.map((row) => (
                                  <div key={row.id}>
                                    {/* Item Data and QR Together */}
                                    <div className="grid grid-cols-[300px_1fr_40px] gap-2 items-end bg-white ">
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
                                        className="bg-gray-200 text-sm text-black px-3 py-1 rounded font-medium border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none text-center"
                                        placeholder="Label name"
                                      />
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <label className="text-xs text-green-600 font-semiboldtext-green-600 font-semibold block mb-1">
                                            DATA
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
                                            className="w-full px-2 py-1 border border-green-600 rounded focus:ring-2 focus:ring-green-400 focus:outline-none"
                                            placeholder="e.g., BF3"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-green-600 font-semibold block mb-1">
                                            QR
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
                                            className="w-full px-2 py-1 border border-green-600 rounded focus:ring-2 focus:ring-green-400 focus:outline-none"
                                            placeholder="e.g., A4"
                                          />
                                        </div>
                                      </div>
                                      <div className="p-1">
                                        <DeleteRowButton
                                          onClick={() =>
                                            onRemoveDataRow(system.id, row.id)
                                          }
                                        />
                                      </div>
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
                            <div className="grid grid-cols-[300px_1fr_40px] gap-2 items-end  rounded">
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
                                className="bg-gray-200 text-sm text-black px-3 py-1 rounded font-medium border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none text-center"
                                placeholder="Label name"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-xs text-green-600 font-semibold block mb-1">
                                    DATA
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
                                    className="w-full px-2 py-1 border border-green-600 rounded focus:ring-2 focus:ring-green-400 focus:outline-none"
                                    placeholder="e.g., BF3"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-green-600 font-semibold block mb-1">
                                    QR
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
                                    className="w-full px-2 py-1 border border-green-600 rounded focus:ring-2 focus:ring-green-400 focus:outline-none"
                                    placeholder="e.g., A4"
                                  />
                                </div>
                              </div>
                              <div className="p-1">
                                <DeleteRowButton
                                  onClick={() =>
                                    onRemoveDataRow(system.id, row.id)
                                  }
                                />
                              </div>
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
          <SaveSettingsButton onClick={onSaveSettings} />
        </div>
      </div>
    </div>
  );
}
