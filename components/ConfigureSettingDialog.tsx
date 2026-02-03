import { X } from "lucide-react";
import {
  GlobalDataRow,
  SystemConfig,
  TemplateOption,
} from "../components/types";
import { SaveSettingsButton } from "./SaveSettingsButton";
import { AddDataButton } from "./AddDataButton";
import { DeleteRowButton } from "./DeleteRowButton";
import { TemplateDropdown } from "./TemplateDropdown";

/* dnd-kit */
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ================================
   TYPES
================================ */
interface ConfigureSettingDialogProps {
  isOpen: boolean;
  onClose: () => void;

  globalRows: GlobalDataRow[];
  addGlobalRow: () => void;
  removeGlobalRow: (rowId: string) => void;
  updateGlobalRow: (
    rowId: string,
    field: "itemDataLabel" | "itemDataCell" | "itemQRCell",
    value: string,
  ) => void;
  reorderGlobalRow: (activeId: string, overId: string) => void;

  systems: SystemConfig[];
  onUpdateSystemFieldCell: (
    systemId: string,
    fieldIndex: number,
    value: string,
  ) => void;

  onAddDataRow: (systemId: string, type?: "BAG" | "BOX" | "MATCHING") => void;

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
    value: string,
  ) => void;

  onReorderDataRow: (
    systemId: string,
    activeId: string,
    overId: string,
  ) => void;

  onSaveSettings: () => void;

  templates: TemplateOption[];
  selectedTemplateId: string | null;
  onTemplateChange: (templateId: string) => void;
}

/* ================================
   SORTABLE ROW (HANDLE ONLY)
================================ */
function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (handleProps: any) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {children({ ...attributes, ...listeners })}
    </div>
  );
}

/* ================================
   MAIN
================================ */
export function ConfigureSettingDialog({
  isOpen,
  onClose,

  globalRows,
  addGlobalRow,
  removeGlobalRow,
  updateGlobalRow,
  reorderGlobalRow,

  systems,
  onUpdateSystemFieldCell,
  onAddDataRow,
  onRemoveDataRow,
  onUpdateDataRow,
  onReorderDataRow,

  onSaveSettings,

  templates,
  selectedTemplateId,
  onTemplateChange,
}: ConfigureSettingDialogProps) {
  if (!isOpen) return null;

  const PROMOS_LABELS = [
    "ITEM CODE",
    "LOT",
    "ORDER NO.",
    "ITEM APS",
    "QR CODE",
  ];

  const PRINT_LABEL_GROUPS: ("BAG" | "BOX" | "MATCHING" | undefined)[] = [
    "BAG",
    "BOX",
    "MATCHING",
    undefined,
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-white p-6 border-b border-indigo-200 flex justify-between">
          <h2 className="text-xl font-bold">CONFIGURE SETTINGS</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* TEMPLATE */}
          <TemplateDropdown
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onTemplateChange={onTemplateChange}
          />

          {/* GLOBAL ROWS */}
          <div className="border border-green-500 rounded-lg p-4 space-y-2">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) return;
                reorderGlobalRow(active.id as string, over.id as string);
              }}
            >
              <SortableContext
                items={globalRows.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                {globalRows.map((row) => (
                  <SortableRow key={row.id} id={row.id}>
                    {(handleProps) => (
                      <div className="grid grid-cols-[24px_300px_1fr_40px] gap-2 items-center bg-white">
                        <div
                          {...handleProps}
                          className="cursor-move text-gray-400 flex justify-center"
                        >
                          ☰
                        </div>

                        <input
                          value={row.itemDataLabel}
                          onChange={(e) =>
                            updateGlobalRow(
                              row.id,
                              "itemDataLabel",
                              e.target.value,
                            )
                          }
                          className="bg-gray-200 px-3 py-1 rounded text-center"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={row.itemDataCell}
                            onChange={(e) =>
                              updateGlobalRow(
                                row.id,
                                "itemDataCell",
                                e.target.value,
                              )
                            }
                            className="border px-2 py-1 rounded"
                          />
                          <input
                            value={row.itemQRCell}
                            onChange={(e) =>
                              updateGlobalRow(
                                row.id,
                                "itemQRCell",
                                e.target.value,
                              )
                            }
                            className="border px-2 py-1 rounded"
                          />
                        </div>

                        <DeleteRowButton
                          onClick={() => removeGlobalRow(row.id)}
                        />
                      </div>
                    )}
                  </SortableRow>
                ))}
              </SortableContext>
            </DndContext>

            <AddDataButton onClick={addGlobalRow} />
          </div>

          {/* SYSTEMS */}
          {systems.map((system, index) => (
            <div key={system.id}>
              <div className="bg-green-700 text-white px-4 py-2 rounded-t font-semibold">
                {index + 1}. {system.name}
              </div>

              <div className="border border-green-500 p-4 rounded-b space-y-4">
                {system.fields.length > 0 ? (
                  <div className="grid grid-cols-5 gap-2">
                    {system.fields.map((field, idx) => (
                      <div key={idx}>
                        <div className="bg-gray-200 text-black px-2 py-1 text-sm mb-1 rounded font-medium">
                          {PROMOS_LABELS[idx] ?? `FIELD ${idx + 1}`}
                        </div>
                        <input
                          type="text"
                          value={field.cell}
                          onChange={(e) =>
                            onUpdateSystemFieldCell(
                              system.id,
                              idx,
                              e.target.value,
                            )
                          }
                          className="w-full px-2 py-1 border border-green-500 rounded focus:ring-2 focus:ring-green-400 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  (system.name === "PRINT LABEL"
                    ? PRINT_LABEL_GROUPS
                    : [undefined]
                  ).map((typeGroup) => {
                    const rows = system.dataRows.filter((r) =>
                      typeGroup ? r.type === typeGroup : !r.type,
                    );

                    return (
                      <div key={typeGroup ?? "ALL"}>
                        {system.name === "PRINT LABEL" && (
                          <div className="bg-green-600 text-white px-4 py-2 rounded-t text-xs font-bold">
                            {typeGroup ?? "OTHERS"}
                          </div>
                        )}

                        <DndContext
                          collisionDetection={closestCenter}
                          onDragEnd={({ active, over }) => {
                            if (!over || active.id === over.id) return;
                            onReorderDataRow(
                              system.id,
                              active.id as string,
                              over.id as string,
                            );
                          }}
                        >
                          <SortableContext
                            items={rows.map((r) => r.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2 border-2 border-green-500 p-3 rounded-b bg-green-50/30">
                              {rows.map((row) => (
                                <SortableRow key={row.id} id={row.id}>
                                  {(handleProps) => (
                                    <div className="grid grid-cols-[24px_300px_1fr_40px] gap-2 items-center bg-white p-1 rounded">
                                      <div
                                        {...handleProps}
                                        className="cursor-move text-gray-400 flex justify-center"
                                      >
                                        ☰
                                      </div>

                                      <input
                                        value={row.itemDataLabel || ""}
                                        onChange={(e) =>
                                          onUpdateDataRow(
                                            system.id,
                                            row.id,
                                            "itemDataLabel",
                                            e.target.value,
                                          )
                                        }
                                        className="bg-gray-200 px-2 py-1 rounded text-center"
                                      />

                                      <div className="grid grid-cols-2 gap-2">
                                        <input
                                          value={row.itemDataCell}
                                          onChange={(e) =>
                                            onUpdateDataRow(
                                              system.id,
                                              row.id,
                                              "itemDataCell",
                                              e.target.value,
                                            )
                                          }
                                          className="border px-2 py-1 rounded"
                                        />
                                        <input
                                          value={row.itemQRCell}
                                          onChange={(e) =>
                                            onUpdateDataRow(
                                              system.id,
                                              row.id,
                                              "itemQRCell",
                                              e.target.value,
                                            )
                                          }
                                          className="border px-2 py-1 rounded"
                                        />
                                      </div>

                                      <DeleteRowButton
                                        onClick={() =>
                                          onRemoveDataRow(system.id, row.id)
                                        }
                                      />
                                    </div>
                                  )}
                                </SortableRow>
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>

                        <div className="mt-2">
                          <AddDataButton
                            onClick={() => onAddDataRow(system.id, typeGroup)}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white border-t p-6 flex justify-center">
          <SaveSettingsButton onClick={onSaveSettings} />
        </div>
      </div>
    </div>
  );
}
