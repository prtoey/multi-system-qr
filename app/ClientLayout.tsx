"use client";

import { Upload, X } from "lucide-react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  TemplateOption,
  GlobalDataRow,
  SystemConfig,
  DataRow,
} from "../components/types";

import { TemplateButton } from "../components/TemplateButton";
import { EditTemplateButton } from "../components/EditTemplateButton";
import { DeleteTemplateButton } from "../components/DeleteTemplateButton";
import { ConfigureSettingButton } from "../components/ConfigureSettingButton";
import { GenerateQRButton } from "../components/GenerateQRButton";
import { TemplateUploadDialog } from "../components/TemplateUploadDialog";
import { EditTemplateDialog } from "../components/EditTemplateDialog";
import { DeleteTemplateDialog } from "../components/DeleteTemplateDialog";
import { ConfigureSettingDialog } from "../components/ConfigureSettingDialog";
import { TemplateDropdown } from "../components/TemplateDropdown";
import { ExcelStyleGrid } from "../components/ExcelStyleGrid";
import AlertDialog from "../components/AlertDialog";
import ExcelValidationDialog, {
  ExcelValidationError,
} from "../components/ExcelValidationDialog";

export default function ClientLayout() {
  /* TEMPLATE */
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );

  /* CONFIG */
  const [globalRows, setGlobalRows] = useState<GlobalDataRow[]>([]);
  const [systems, setSystems] = useState<SystemConfig[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    ExcelValidationError[]
  >([]);
  const [validationOpen, setValidationOpen] = useState(false);

  /* DATA */
  const [dataRows, setDataRows] = useState<DataRow[]>([]);

  /* UI */
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openError, setOpenError] = useState(false);

  /* TEMPLATE LIST */
  const fetchTemplateOptions = async () => {
    const res = await fetch("/api/templates/getName", { cache: "no-store" });
    const data = await res.json();

    if (!Array.isArray(data.templates)) {
      setTemplateOptions([]);
      return;
    }

    const options = data.templates.map((name: string) => ({
      id: name,
      name,
    }));

    setTemplateOptions(options);

    if (!selectedTemplateId && options.length > 0) {
      setSelectedTemplateId(options[0].id);
    }
  };

  useEffect(() => {
    fetchTemplateOptions();
  }, []);

  /* EXCEL LOAD */
  const loadTemplateConfig = async (templateId: string) => {
    const res = await fetch(`/api/templates/config/${templateId}`, {
      cache: "no-store",
    });
    const data = await res.json();

    setGlobalRows(data.config.globalRows);
    setSystems(data.config.systems);
  };

  useEffect(() => {
    if (selectedTemplateId) {
      loadTemplateConfig(selectedTemplateId);
    }
  }, [selectedTemplateId]);

  /* CONFIG MUTATORS */
  const addGlobalRow = () =>
    setGlobalRows((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        itemDataLabel: "NEW LABEL",
        itemDataCell: "",
        itemQRCell: "",
      },
    ]);

  const removeGlobalRow = (rowId: string) =>
    setGlobalRows((prev) => prev.filter((r) => r.id !== rowId));

  const updateGlobalRow = (
    rowId: string,
    field: "itemDataLabel" | "itemDataCell" | "itemQRCell",
    value: string,
  ) =>
    setGlobalRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r)),
    );

  const updateSystemFieldCell = (
    systemId: string,
    fieldIndex: number,
    value: string,
  ) => {
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === systemId
          ? {
              ...sys,
              fields: sys.fields.map((f, i) =>
                i === fieldIndex ? { ...f, cell: value } : f,
              ),
            }
          : sys,
      ),
    );
  };

  const addDataRow = (systemId: string) =>
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === systemId
          ? {
              ...sys,
              dataRows: [
                ...sys.dataRows,
                {
                  id: Date.now().toString(),
                  itemDataCell: "",
                  itemQRCell: "",
                },
              ],
            }
          : sys,
      ),
    );

  const addTypedDataRow = (systemId: string) => {
    const ts = Date.now();
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === systemId
          ? {
              ...sys,
              dataRows: [
                ...sys.dataRows,
                {
                  id: `${ts}-1`,
                  itemDataCell: "",
                  itemQRCell: "",
                  type: "BOX",
                },
                {
                  id: `${ts}-2`,
                  itemDataCell: "",
                  itemQRCell: "",
                  type: "BAG",
                },
                {
                  id: `${ts}-3`,
                  itemDataCell: "",
                  itemQRCell: "",
                  type: "MATCHING",
                },
              ],
            }
          : sys,
      ),
    );
  };

  const removeDataRow = (systemId: string, rowId: string) =>
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === systemId
          ? { ...sys, dataRows: sys.dataRows.filter((r) => r.id !== rowId) }
          : sys,
      ),
    );

  const updateDataRow = (
    systemId: string,
    rowId: string,
    field:
      | "itemDataCell"
      | "itemQRCell"
      | "itemDataLabel"
      | "itemQRLabel"
      | "type",
    value: string,
  ) =>
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === systemId
          ? {
              ...sys,
              dataRows: sys.dataRows.map((r) =>
                r.id === rowId ? { ...r, [field]: value } : r,
              ),
            }
          : sys,
      ),
    );

  /* Validate Excel Cell */
  const isValidExcelCell = (cell?: string) => {
    if (!cell) return false;
    try {
      const decoded = XLSX.utils.decode_cell(cell.toUpperCase());
      return decoded.r >= 0 && decoded.c >= 0;
    } catch {
      return false;
    }
  };

  /* SAVE CONFIG */
  const handleSaveSettings = async () => {
    if (!selectedTemplateId) return;

    const errors: ExcelValidationError[] = [];

    // GLOBAL
    globalRows.forEach((row, i) => {
      if (!isValidExcelCell(row.itemDataCell)) {
        errors.push({
          systemName: "MAIN",
          rowIndex: i + 1,
          field: "DATA",
          cell: row.itemDataCell ?? "",
          label: row.itemDataLabel,
        });
      }
      if (!isValidExcelCell(row.itemQRCell)) {
        errors.push({
          systemName: "MAIN",
          rowIndex: i + 1,
          field: "QR",
          cell: row.itemQRCell ?? "",
          label: row.itemDataLabel,
        });
      }
    });

    // PROMOS SYSTEM (fields[])
    systems.forEach((system) => {
      if (system.fields.length > 0) {
        system.fields.forEach((field, i) => {
          if (!isValidExcelCell(field.cell)) {
            errors.push({
              systemName: "PROMOS",
              rowIndex: i + 1,
              field: field.label,
              cell: field.cell,
              label: field.label,
            });
          }
        });
      }
    });

    // SYSTEM
    systems.forEach((system) => {
      system.dataRows.forEach((row, i) => {
        if (!isValidExcelCell(row.itemDataCell)) {
          errors.push({
            systemName: system.name,
            rowIndex: i + 1,
            field: "DATA",
            cell: row.itemDataCell,
          });
        }
        if (!isValidExcelCell(row.itemQRCell)) {
          errors.push({
            systemName: system.name,
            rowIndex: i + 1,
            field: "QR",
            cell: row.itemQRCell,
          });
        }
      });
    });

    // show table dialog
    if (errors.length > 0) {
      setValidationErrors(errors);
      setValidationOpen(true);
      return;
    }

    // save
    await fetch("/api/templates/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: selectedTemplateId,
        config: { globalRows, systems },
      }),
    });

    setOpenAlert(true);
    setIsConfigDialogOpen(false);
  };

  /* EXCEL LOAD */
  const handleDataFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const buffer = event.target?.result;
        if (!buffer) return;

        const data = new Uint8Array(buffer as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });

        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          blankrows: false,
        }) as any[][];

        const parsed: DataRow[] = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row) continue;

          const hasData = row.some(
            (cell) => cell !== undefined && String(cell).trim() !== "",
          );
          if (!hasData) continue;

          parsed.push({
            id: `${Date.now()}_${i}_${Math.random()}`,
            orderNo: String(row[0] ?? "").trim(),
            itemCode: String(row[1] ?? "").trim(),
            externalLot: String(row[2] ?? "").trim(),
            materialCode: String(row[3] ?? "").trim(),
            internalLot: String(row[4] ?? "").trim(),
            qty: String(row[5] ?? "").trim(),
          });
        }

        setDataRows(parsed);
      } catch (err) {
        console.error("Excel read error:", err);
      }
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  /* TEMPLATE DIALOG HANDLERS */
  const handleUploadTemplate = () => {
    fetchTemplateOptions();
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const res = await fetch(`/api/templates/delete/${templateId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setOpenError(true);
      return;
    }

    const data = await res.json();
    handleDeleteSelectedTemplate(templateId);
  };

  const handleDeleteSelectedTemplate = (deletedId: string) => {
    setSelectedTemplateId((prev) => (prev === deletedId ? null : prev));
    fetchTemplateOptions();
  };

  async function handleGenerateExcel() {
    const res = await fetch("/api/generate-excel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateId: selectedTemplateId,
        rows: dataRows,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      alert(err);
      return;
    }

    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${selectedTemplateId}.xlsx`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mt-3 mb-8">
          <h1 className="inline-block text-2xl font-bold bg-white px-4 py-1 rounded-lg border-2 border-indigo-200 text-indigo-900">
            MULTI-SYSTEM QR CODE GENERATOR
          </h1>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-4">
          <div className="col-span-1 bg-white rounded-xl border-2 border-indigo-200 p-4">
            <h2 className="text-base font-bold text-indigo-900 mb-2">
              TEMPLATE
            </h2>
            <div className="space-y-3">
              <TemplateButton onClick={() => setIsUploadDialogOpen(true)} />
              <EditTemplateButton
                onClick={() => setIsEditDialogOpen(true)}
                disabled={!selectedTemplateId}
              />
              <DeleteTemplateButton
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={!selectedTemplateId}
              />
            </div>
          </div>

          <div className="col-span-3 bg-white rounded-xl border-2 border-indigo-200 p-4">
            <label className="text-base font-bold text-indigo-900 mb-6 block">
              SELECT TEMPLATE
            </label>
            <TemplateDropdown
              templates={templateOptions}
              selectedTemplateId={selectedTemplateId}
              onTemplateChange={setSelectedTemplateId}
            />
            <div className="flex justify-end mt-4">
              {templateOptions.length > 0 && (
                <ConfigureSettingButton
                  onClick={() => setIsConfigDialogOpen(true)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-indigo-200 p-4 mb-4">
          <div className="flex justify-end gap-2 mb-2">
            <label
              htmlFor="excel-upload"
              className="bg-green-600 text-white px-3 py-2 rounded-lg shadow cursor-pointer hover:bg-green-700 transition flex items-center gap-2 text-xs font-semibold"
            >
              <Upload className="w-3 h-3" />
              LOAD FROM EXCEL
            </label>

            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleDataFileSelect}
            />

            {dataRows.length > 0 && (
              <button
                onClick={() => setDataRows([])}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2 text-xs font-semibold"
              >
                <X className="w-4 h-4" />
                CLEAR ALL
              </button>
            )}
          </div>

          <ExcelStyleGrid data={dataRows} onDataChange={setDataRows} />
        </div>

        <div className="flex justify-center mt-8">
          <GenerateQRButton onClick={handleGenerateExcel} />
        </div>

        <TemplateUploadDialog
          isOpen={isUploadDialogOpen}
          onClose={() => {
            setIsUploadDialogOpen(false);
            handleUploadTemplate();
          }}
          onUploadTemplate={handleUploadTemplate}
        />

        <EditTemplateDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          templates={templateOptions}
        />

        <DeleteTemplateDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          templates={templateOptions}
          onDelete={handleDeleteTemplate}
        />

        <AlertDialog
          isOpen={openAlert}
          title="Success"
          message="Settings saved successfully!"
          onClose={() => setOpenAlert(false)}
        />

        <AlertDialog
          isOpen={openError}
          title="Error"
          message="Failed to delete template , Please try again."
          onClose={() => setOpenError(false)}
        />

        <ExcelValidationDialog
          isOpen={validationOpen}
          errors={validationErrors}
          onClose={() => {
            setValidationOpen(false);
            loadTemplateConfig(selectedTemplateId!);
          }}
        />

        {isConfigDialogOpen && (
          <ConfigureSettingDialog
            isOpen
            onClose={() => setIsConfigDialogOpen(false)}
            globalRows={globalRows}
            addGlobalRow={addGlobalRow}
            removeGlobalRow={removeGlobalRow}
            updateGlobalRow={updateGlobalRow}
            systems={systems}
            onUpdateSystemFieldCell={updateSystemFieldCell}
            onAddDataRow={addDataRow}
            onAddTypedDataRow={addTypedDataRow}
            onRemoveDataRow={removeDataRow}
            onUpdateDataRow={updateDataRow}
            onSaveSettings={handleSaveSettings}
            onResetSettings={() =>
              selectedTemplateId && loadTemplateConfig(selectedTemplateId)
            }
            templates={templateOptions}
            selectedTemplateId={selectedTemplateId}
            onTemplateChange={setSelectedTemplateId}
          />
        )}
      </div>
    </div>
  );
}
