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

export default function ClientLayout() {
  /* ================= TEMPLATE ================= */
  const [templateOptions, setTemplateOptions] = useState<TemplateOption[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  /* ================= CONFIG (FROM BACKEND) ================= */
  const [globalRows, setGlobalRows] = useState<GlobalDataRow[]>([]);
  const [systems, setSystems] = useState<SystemConfig[]>([]);

  /* ================= DATA ================= */
  const [dataRows, setDataRows] = useState<DataRow[]>([]);

  /* ================= UI ================= */
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  /* =====================================================
     TEMPLATE LIST
     ===================================================== */
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

  /* =====================================================
     LOAD CONFIG (backend fallback default)
     ===================================================== */
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

  /* =====================================================
     CONFIG MUTATORS
     ===================================================== */
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
    value: string
  ) =>
    setGlobalRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [field]: value } : r))
    );

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
          : sys
      )
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
          : sys
      )
    );
  };

  const removeDataRow = (systemId: string, rowId: string) =>
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === systemId
          ? { ...sys, dataRows: sys.dataRows.filter((r) => r.id !== rowId) }
          : sys
      )
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
    value: string
  ) =>
    setSystems((prev) =>
      prev.map((sys) =>
        sys.id === systemId
          ? {
              ...sys,
              dataRows: sys.dataRows.map((r) =>
                r.id === rowId ? { ...r, [field]: value } : r
              ),
            }
          : sys
      )
    );

  /* =====================================================
     SAVE CONFIG
     ===================================================== */
  const handleSaveSettings = async () => {
    if (!selectedTemplateId) return;

    await fetch("/api/templates/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: selectedTemplateId,
        config: { globalRows, systems },
      }),
    });

    alert("Settings saved successfully!");
  };

  /* =====================================================
     EXCEL LOAD
     ===================================================== */
  const handleDataFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const wb = XLSX.read(event.target?.result, { type: "binary" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

      const parsed: DataRow[] = [];
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i]) continue;
        parsed.push({
          id: `${Date.now()}_${i}`,
          orderNo: rows[i][0] ?? "",
          itemCode: rows[i][1] ?? "",
          externalLot: rows[i][2] ?? "",
          materialCode: rows[i][3] ?? "",
          internalLot: rows[i][4] ?? "",
          qty: rows[i][5] ?? "",
        });
      }
      setDataRows(parsed);
    };

    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  /* =====================================================
     TEMPLATE DIALOG HANDLERS
     ===================================================== */
  const handleUploadTemplate = () => {
    fetchTemplateOptions();
  };

  const handleDeleteSelectedTemplate = () => {
    setSelectedTemplateId(null);
    fetchTemplateOptions();
  };

  /* =====================================================
     RENDER (UNCHANGED UI)
     ===================================================== */
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
              <ConfigureSettingButton
                onClick={() => setIsConfigDialogOpen(true)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-indigo-200 p-4 mb-4">
          <div className="flex justify-end gap-2 mb-2">
            <label className="bg-green-600 text-white px-3 py-2 rounded-lg shadow cursor-pointer hover:from-green-700 hover:to-green-800 transition flex items-center gap-2 text-xs font-semibold">
              <Upload className="w-3 h-3" />
              LOAD FROM EXCEL
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleDataFileSelect}
              />
            </label>

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

        <div className="flex justify-center">
          <GenerateQRButton onClick={() => alert("Generate QR")} />
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
          onDelete={handleDeleteSelectedTemplate}
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
