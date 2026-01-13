"use client";
import { FileText, Upload, X } from "lucide-react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import QRCode from "qrcode";
import {
  SystemConfig,
  LabelConfig,
  TemplateConfig,
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
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [templates, setTemplates] = useState<TemplateConfig[]>([]);
  const [selectedConfigTemplateId, setSelectedConfigTemplateId] = useState<
    string | null
  >(null);

  // Data grid for QR generation
  const [dataRows, setDataRows] = useState<DataRow[]>([]);

  // Dialog states
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get default systems configuration
  const getDefaultSystems = (): SystemConfig[] => [
    {
      id: "1",
      name: "PROMOS SYSTEM",
      fields: [
        { label: "ITEM CODE", cell: "A54" },
        { label: "LOT", cell: "A55" },
        { label: "ORDER NO.", cell: "A56" },
        { label: "ITEM APS", cell: "A57" },
        { label: "PROMOS QR CODE", cell: "AF4" },
      ],
      dataRows: [],
    },
    {
      id: "2",
      name: "PRINT LABEL",
      fields: [],
      dataRows: [
        { id: "1", itemDataCell: "BF3", itemQRCell: "A4", type: "BOX" },
        { id: "2", itemDataCell: "BF3", itemQRCell: "A4", type: "BAG" },
        { id: "3", itemDataCell: "BF3", itemQRCell: "A4", type: "MATCHING" },
      ],
    },
    {
      id: "3",
      name: "ATTACH LABEL",
      fields: [],
      dataRows: [
        { id: "1", itemDataCell: "BF3", itemQRCell: "A4" },
        { id: "2", itemDataCell: "BF3", itemQRCell: "A4" },
        { id: "3", itemDataCell: "BF3", itemQRCell: "A4" },
      ],
    },
    {
      id: "4",
      name: "BOXPACK",
      fields: [],
      dataRows: [
        { id: "1", itemDataCell: "BF3", itemQRCell: "A4" },
        { id: "2", itemDataCell: "BF3", itemQRCell: "A4" },
        { id: "3", itemDataCell: "BF3", itemQRCell: "A4" },
      ],
    },
  ];

  // Load templates from localStorage on mount
  useEffect(() => {
    const savedTemplates = localStorage.getItem("qrGeneratorTemplates");
    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates);
        setTemplates(parsed);
        if (parsed.length > 0) {
          setSelectedConfigTemplateId(parsed[0].id);
        }
      } catch (e) {
        console.error("Error loading templates:", e);
      }
    }
  }, []);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem("qrGeneratorTemplates", JSON.stringify(templates));
    }
  }, [templates]);

  // Handle template upload
  const handleUploadTemplate = (name: string, workbook: any) => {
    // Check if template with same name exists
    const existingTemplate = templates.find(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );

    if (existingTemplate) {
      // Ask user if they want to replace
      const shouldReplace = confirm(
        `A template named "${name}" already exists. Do you want to replace it?\n\n` +
          `Click OK to replace the existing template.\n` +
          `Click Cancel to keep both templates.`
      );

      if (shouldReplace) {
        // Replace existing template (keep settings, update workbook)
        setTemplates(
          templates.map((t) =>
            t.id === existingTemplate.id
              ? {
                  ...t,
                  workbook,
                  uploadedAt: new Date().toISOString(),
                }
              : t
          )
        );
        setSelectedConfigTemplateId(existingTemplate.id);
        alert(`Template "${name}" has been replaced successfully!`);
        return;
      }
    }

    // Create new template
    const newTemplate: TemplateConfig = {
      id: Date.now().toString(),
      name,
      uploadedAt: new Date().toISOString(),
      workbook,
      labels: {
        itemDataLabel: "ITEM DATA",
        itemQRLabel: "QR CODE",
        lotDataLabel: "LOT DATA",
        lotQRLabel: "QR CODE",
        qtyDataLabel: "Q'TY DATA",
        qtyQRLabel: "QR CODE",
      },
      itemDataCell: "BF3",
      itemQRCell: "A4",
      lotDataCell: "BF3",
      lotQRCell: "L4",
      qtyDataCell: "BF3",
      qtyQRCell: "W4",
      systems: getDefaultSystems(),
    };

    setTemplates([...templates, newTemplate]);
    setSelectedConfigTemplateId(newTemplate.id);
    alert(`Template "${name}" uploaded successfully!`);
  };

  // Get current template being configured
  const getCurrentTemplate = () => {
    return templates.find((t) => t.id === selectedConfigTemplateId);
  };

  // Template configuration functions
  const handleTemplateChange = (templateId: string) => {
    setSelectedConfigTemplateId(templateId);
  };

  const handleLabelsChange = (labels: LabelConfig) => {
    if (!selectedConfigTemplateId) return;
    setTemplates(
      templates.map((t) =>
        t.id === selectedConfigTemplateId ? { ...t, labels } : t
      )
    );
  };

  const handleCellChange = (field: string, value: string) => {
    if (!selectedConfigTemplateId) return;
    setTemplates(
      templates.map((t) =>
        t.id === selectedConfigTemplateId ? { ...t, [field]: value } : t
      )
    );
  };

  const handleSystemsChange = (systems: SystemConfig[]) => {
    if (!selectedConfigTemplateId) return;
    setTemplates(
      templates.map((t) =>
        t.id === selectedConfigTemplateId ? { ...t, systems } : t
      )
    );
  };

  const addDataRow = (systemId: string) => {
    const template = getCurrentTemplate();
    if (!template) return;

    const updatedSystems = template.systems.map((sys) => {
      if (sys.id === systemId) {
        const timestamp = Date.now();
        const newRows = [
          ...sys.dataRows,
          { id: timestamp.toString(), itemDataCell: "BF3", itemQRCell: "A4" },
        ];
        return { ...sys, dataRows: newRows };
      }
      return sys;
    });

    handleSystemsChange(updatedSystems);
  };

  const addTypedDataRow = (systemId: string) => {
    const template = getCurrentTemplate();
    if (!template) return;

    const updatedSystems = template.systems.map((sys) => {
      if (sys.id === systemId) {
        const timestamp = Date.now();
        let newRows = [
          ...sys.dataRows,
          {
            id: `${timestamp}-1`,
            itemDataCell: "BF3",
            itemQRCell: "A4",
            type: "BOX" as const,
          },
          {
            id: `${timestamp}-2`,
            itemDataCell: "BF3",
            itemQRCell: "A4",
            type: "BAG" as const,
          },
          {
            id: `${timestamp}-3`,
            itemDataCell: "BF3",
            itemQRCell: "A4",
            type: "MATCHING" as const,
          },
        ];

        newRows.sort((a, b) => {
          const order = { BOX: 1, BAG: 2, MATCHING: 3 };
          const aOrder = a.type ? order[a.type] : 999;
          const bOrder = b.type ? order[b.type] : 999;
          return aOrder - bOrder;
        });

        return { ...sys, dataRows: newRows };
      }
      return sys;
    });

    handleSystemsChange(updatedSystems);
  };

  const removeDataRow = (systemId: string, rowId: string) => {
    const template = getCurrentTemplate();
    if (!template) return;

    const updatedSystems = template.systems.map((sys) => {
      if (sys.id === systemId) {
        return {
          ...sys,
          dataRows: sys.dataRows.filter((row) => row.id !== rowId),
        };
      }
      return sys;
    });

    handleSystemsChange(updatedSystems);
  };

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
  ) => {
    const template = getCurrentTemplate();
    if (!template) return;

    const updatedSystems = template.systems.map((sys) => {
      if (sys.id === systemId) {
        let updatedRows = sys.dataRows.map((row) =>
          row.id === rowId ? { ...row, [field]: value } : row
        );

        if (sys.name === "PRINT LABEL" && field === "type") {
          updatedRows.sort((a, b) => {
            const order = { BOX: 1, BAG: 2, MATCHING: 3 };
            const aOrder = a.type ? order[a.type] : 999;
            const bOrder = b.type ? order[b.type] : 999;
            return aOrder - bOrder;
          });
        }

        return { ...sys, dataRows: updatedRows };
      }
      return sys;
    });

    handleSystemsChange(updatedSystems);
  };

  const handleSaveSettings = () => {
    // Settings are auto-saved via useEffect
    alert("Settings saved successfully!");
  };

  const handleResetSettings = () => {
    const template = getCurrentTemplate();
    if (!template) return;

    if (confirm(`Reset settings for template "${template.name}" to default?`)) {
      setTemplates(
        templates.map((t) =>
          t.id === selectedConfigTemplateId
            ? {
                ...t,
                labels: {
                  itemDataLabel: "ITEM DATA",
                  itemQRLabel: "QR CODE",
                  lotDataLabel: "LOT DATA",
                  lotQRLabel: "QR CODE",
                  qtyDataLabel: "Q'TY DATA",
                  qtyQRLabel: "QR CODE",
                },
                itemDataCell: "BF3",
                itemQRCell: "A4",
                lotDataCell: "BF3",
                lotQRCell: "L4",
                qtyDataCell: "BF3",
                qtyQRCell: "W4",
                systems: getDefaultSystems(),
              }
            : t
        )
      );
      alert("Settings reset to default!");
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter((t) => t.id !== templateId));
    if (selectedConfigTemplateId === templateId) {
      setSelectedConfigTemplateId(
        templates.length > 1 ? templates[0].id : null
      );
    }
  };

  const handleEditTemplate = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedTemplate = (templateId: string, newWorkbook: any) => {
    setTemplates(
      templates.map((t) =>
        t.id === templateId
          ? {
              ...t,
              workbook: newWorkbook,
              uploadedAt: new Date().toISOString(),
            }
          : t
      )
    );

    const template = templates.find((t) => t.id === templateId);
    if (template) {
      alert(`Template "${template.name}" updated successfully!`);
    }
  };

  const handleDeleteSelectedTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const newTemplates = templates.filter((t) => t.id !== templateId);
    setTemplates(newTemplates);

    // Select first template if available, otherwise null
    if (newTemplates.length > 0) {
      setSelectedConfigTemplateId(newTemplates[0].id);
    } else {
      setSelectedConfigTemplateId(null);
      localStorage.removeItem("qrGeneratorTemplates");
    }

    alert(`Template "${template.name}" has been deleted.`);
  };

  const handleGenerateQRCode = async () => {
    if (templates.length === 0) {
      alert("Please upload a template first");
      return;
    }

    if (dataRows.length === 0) {
      alert("Please enter data first");
      return;
    }

    // Here you would implement the QR code generation logic
    alert("QR Code generation will be implemented in the next step!");
  };

  const handleDownloadExample = () => {
    // Create example workbook
    const wb = XLSX.utils.book_new();

    // Create example worksheet with sample data and QR code positions
    const wsData = [
      // Headers and sample data
      [
        "",
        "",
        "",
        "QR Position A4",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "QR Position L4",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "QR Position W4",
      ],
      [
        "",
        "",
        "ITEM DATA (BF3)",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "Sample Item Code",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "LOT: 2024-001",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "QTY: 100",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "PROMOS SYSTEM DATA",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      // More rows to demonstrate structure
    ];

    // Add more rows to reach typical positions
    for (let i = wsData.length; i < 60; i++) {
      wsData.push([""]);
    }

    // Add PROMOS SYSTEM data at row 54-57
    wsData[53] = [
      "ITEM CODE: SAMPLE-001",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "PROMOS QR Position (AF4)",
    ];
    wsData[54] = ["LOT: 2024-001"];
    wsData[55] = ["ORDER NO: ORD-12345"];
    wsData[56] = ["ITEM APS: APS-001"];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws["!cols"] = [
      { wch: 5 }, // A
      { wch: 5 }, // B
      { wch: 20 }, // C
      { wch: 15 }, // D - QR Position A4
      { wch: 5 }, // E
      { wch: 5 }, // F
      { wch: 5 }, // G
      { wch: 5 }, // H
      { wch: 5 }, // I
      { wch: 5 }, // J
      { wch: 5 }, // K
      { wch: 15 }, // L - QR Position L4
      { wch: 5 }, // M
    ];

    // Add styling to important cells
    const cellStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "FFFF00" } },
    };

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    // Create instructions sheet
    const instructionsData = [
      ["MULTI-SYSTEM QR GENERATOR - EXAMPLE TEMPLATE"],
      [""],
      ["IMPORTANT POSITIONS:"],
      [""],
      ["1. ITEM DATA: Cell BF3 - Contains main item information"],
      ["2. QR CODE POSITIONS:"],
      ["   - Item QR: A4"],
      ["   - Lot QR: L4"],
      ["   - Qty QR: W4"],
      ["   - Promos QR: AF4"],
      [""],
      ["3. PROMOS SYSTEM (Rows 54-57):"],
      ["   - ITEM CODE: A54"],
      ["   - LOT: A55"],
      ["   - ORDER NO: A56"],
      ["   - ITEM APS: A57"],
      [""],
      ["4. DATA ROWS:"],
      ["   - PRINT LABEL: Supports BOX, BAG, MATCHING types"],
      ["   - ATTACH LABEL: Regular data rows"],
      ["   - BOXPACK: Regular data rows"],
      [""],
      ["INSTRUCTIONS:"],
      ["1. Upload this template using the UPLOAD TEMPLATE button"],
      ["2. Configure settings if needed using CONFIGURE SETTING"],
      ["3. Create a data file with your actual data"],
      ["4. Select the data file and generate QR codes"],
      [""],
      ["NOTE: This is a simplified example. Your actual template"],
      ["may have different cell positions and more complex layouts."],
    ];

    const wsInstructions = XLSX.utils.aoa_to_sheet(instructionsData);
    wsInstructions["!cols"] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, wsInstructions, "Instructions");

    // Download the file
    XLSX.writeFile(wb, "QR_Generator_Example_Template.xlsx");

    alert("Example template downloaded! Check your downloads folder.");
  };

  const handleDataFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Get first sheet
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
        header: 1,
      }) as any[][];

      // Convert Excel data to DataRow format
      // Assuming data starts from row 2 (row 1 is headers)
      const newDataRows: DataRow[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        newDataRows.push({
          id: `${Date.now()}_${i}`,
          orderNo: row[0]?.toString() || "",
          itemCode: row[1]?.toString() || "",
          externalLot: row[2]?.toString() || "",
          materialCode: row[3]?.toString() || "",
          internalLot: row[4]?.toString() || "",
          qty: row[5]?.toString() || "",
        });
      }

      setDataRows(newDataRows);
    };

    reader.readAsBinaryString(file);
    e.target.value = ""; // Reset input
  };

  const currentTemplate = getCurrentTemplate();

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mt-3 mb-8">
          <h1 className="inline-block text-2xl font-bold bg-white px-4 py-1 rounded-lg  border-2 border-indigo-200 text-indigo-900">
            MULTI-SYSTEM QR CODE GENERATOR
          </h1>
        </div>

        {/* Sections 1 & 2: TEMPLATE and SELECTOR side by side */}
        <div className="grid grid-cols-4 gap-6 mb-4">
          {/* Section 1: TEMPLATE */}
          <div className="col-span-1 bg-white rounded-xl  border-2 border-indigo-200 p-4">
            <h2 className="text-base font-bold text-indigo-900 mb-2">
              TEMPLATE
            </h2>
            <div className="space-y-3">
              <TemplateButton onClick={() => setIsUploadDialogOpen(true)} />
              <EditTemplateButton
                onClick={handleEditTemplate}
                disabled={!selectedConfigTemplateId}
              />
              <DeleteTemplateButton
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={!selectedConfigTemplateId}
              />
            </div>
          </div>

          {/* Section 2: SELECTOR */}
          <div className="col-span-3 bg-white rounded-xl  border-2 border-indigo-200 p-4">
            <div className="space-y-4">
              <div>
                <label className="text-base font-bold text-indigo-900 mb-6 block">
                  SELECT TEMPLATE
                </label>
                <TemplateDropdown
                  templates={templates}
                  selectedTemplateId={selectedConfigTemplateId}
                  onTemplateChange={handleTemplateChange}
                />
              </div>
              <div className="flex justify-end">
                <ConfigureSettingButton
                  onClick={() => setIsConfigDialogOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: EXCEL SHEET PREVIEW */}
        <div className="bg-white rounded-xl border-2 border-indigo-200 p-4 mb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              {dataRows.length > 0 && (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{dataRows.length}</span> rows
                  loaded
                </p>
              )}
              <div className="flex items-center gap-2 ml-auto">
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
            </div>

            {/* Always show Data Grid */}
            <ExcelStyleGrid data={dataRows} onDataChange={setDataRows} />
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <GenerateQRButton onClick={handleGenerateQRCode} />
        </div>

        {/* Template Upload Dialog */}
        <TemplateUploadDialog
          isOpen={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onUploadTemplate={handleUploadTemplate}
        />

        {/* Configure Setting Dialog */}
        {currentTemplate && (
          <ConfigureSettingDialog
            isOpen={isConfigDialogOpen}
            onClose={() => setIsConfigDialogOpen(false)}
            labels={currentTemplate.labels}
            onLabelsChange={handleLabelsChange}
            itemDataCell={currentTemplate.itemDataCell}
            itemQRCell={currentTemplate.itemQRCell}
            lotDataCell={currentTemplate.lotDataCell}
            lotQRCell={currentTemplate.lotQRCell}
            qtyDataCell={currentTemplate.qtyDataCell}
            qtyQRCell={currentTemplate.qtyQRCell}
            onItemDataCellChange={(v) => handleCellChange("itemDataCell", v)}
            onItemQRCellChange={(v) => handleCellChange("itemQRCell", v)}
            onLotDataCellChange={(v) => handleCellChange("lotDataCell", v)}
            onLotQRCellChange={(v) => handleCellChange("lotQRCell", v)}
            onQtyDataCellChange={(v) => handleCellChange("qtyDataCell", v)}
            onQtyQRCellChange={(v) => handleCellChange("qtyQRCell", v)}
            systems={currentTemplate.systems}
            onAddDataRow={addDataRow}
            onAddTypedDataRow={addTypedDataRow}
            onRemoveDataRow={removeDataRow}
            onUpdateDataRow={updateDataRow}
            onSaveSettings={handleSaveSettings}
            onResetSettings={handleResetSettings}
            templates={templates}
            selectedTemplateId={selectedConfigTemplateId}
            onTemplateChange={handleTemplateChange}
          />
        )}

        {/* Edit Template Dialog */}
        <EditTemplateDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          templates={templates}
          onSave={handleSaveEditedTemplate}
        />

        {/* Delete Template Dialog */}
        <DeleteTemplateDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          templates={templates}
          onDelete={handleDeleteSelectedTemplate}
        />
      </div>
    </div>
  );
}
