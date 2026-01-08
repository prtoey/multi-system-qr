"use client";
import {
  FileText,
  Upload,
  Download,
  QrCode,
  Plus,
  X,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import QRCode from "qrcode";
import { DataField, SystemConfig, LabelConfig } from "../components/types";
import { TemplateButton } from "../components/TemplateButton";
import { ConfigureSettingButton } from "../components/ConfigureSettingButton";
import { GenerateQRButton } from "../components/GenerateQRButton";
import { TemplateDialog } from "../components/TemplateDialog";
import { ConfigureSettingDialog } from "../components/ConfigureSettingDialog";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templateWorkbook, setTemplateWorkbook] =
    useState<XLSX.WorkBook | null>(null);

  // Configure settings
  const [itemDataCell, setItemDataCell] = useState("BF3");
  const [itemQRCell, setItemQRCell] = useState("A4");
  const [lotDataCell, setLotDataCell] = useState("BF3");
  const [lotQRCell, setLotQRCell] = useState("L4");
  const [qtyDataCell, setQtyDataCell] = useState("BF3");
  const [qtyQRCell, setQtyQRCell] = useState("W4");

  // Label configuration
  const [labels, setLabels] = useState<LabelConfig>({
    itemDataLabel: "ITEM DATA",
    itemQRLabel: "QR CODE",
    lotDataLabel: "LOT DATA",
    lotQRLabel: "QR CODE",
    qtyDataLabel: "Q'TY DATA",
    qtyQRLabel: "QR CODE",
  });

  const [systems, setSystems] = useState<SystemConfig[]>([
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
        { id: "1", itemDataCell: "BF3", itemQRCell: "A4" },
        { id: "2", itemDataCell: "BF3", itemQRCell: "A4" },
        { id: "3", itemDataCell: "BF3", itemQRCell: "A4" },
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
  ]);

  // Toggle for Configure Setting visibility
  const [isConfigVisible, setIsConfigVisible] = useState(true);

  // Template dialog state
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templatePassword, setTemplatePassword] = useState("");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Configure setting dialog state
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);

  // Set your password here
  const TEMPLATE_PASSWORD = "admin123"; // Change this to your desired password

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("qrGeneratorSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.labels) setLabels(parsed.labels);
        if (parsed.cells) {
          setItemDataCell(parsed.cells.itemDataCell || "BF3");
          setItemQRCell(parsed.cells.itemQRCell || "A4");
          setLotDataCell(parsed.cells.lotDataCell || "BF3");
          setLotQRCell(parsed.cells.lotQRCell || "L4");
          setQtyDataCell(parsed.cells.qtyDataCell || "BF3");
          setQtyQRCell(parsed.cells.qtyQRCell || "W4");
        }
        if (parsed.systems) setSystems(parsed.systems);
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
  }, []);

  // Save settings to localStorage
  const handleSaveSettings = () => {
    const settings = {
      labels,
      cells: {
        itemDataCell,
        itemQRCell,
        lotDataCell,
        lotQRCell,
        qtyDataCell,
        qtyQRCell,
      },
      systems,
    };
    localStorage.setItem("qrGeneratorSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  // Reset to default settings
  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setLabels({
        itemDataLabel: "ITEM DATA",
        itemQRLabel: "QR CODE",
        lotDataLabel: "LOT DATA",
        lotQRLabel: "QR CODE",
        qtyDataLabel: "Q'TY DATA",
        qtyQRLabel: "QR CODE",
      });
      setItemDataCell("BF3");
      setItemQRCell("A4");
      setLotDataCell("BF3");
      setLotQRCell("L4");
      setQtyDataCell("BF3");
      setQtyQRCell("W4");
      localStorage.removeItem("qrGeneratorSettings");
      alert("Settings reset to default!");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTemplateFile(file);
      // Auto-import when template is selected from dialog
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary", cellFormula: true });
        setTemplateWorkbook(workbook);
        setIsTemplateDialogOpen(false);
        alert("Template imported successfully!");
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleTemplateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTemplateFile(file);
      // Auto-import when template is selected from dialog
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary", cellFormula: true });
        setTemplateWorkbook(workbook);
        // setIsTemplateDialogOpen(false);
        // alert("Template imported successfully!");
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleClearFile = () => {
    setTemplateFile(null);
    setTemplateWorkbook(null);
  };

  const handleImport = () => {
    if (!templateFile) {
      alert("Please select a file first");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "binary", cellFormula: true });
      setTemplateWorkbook(workbook);
      alert("Template imported successfully!");
    };
    reader.readAsBinaryString(templateFile);
  };

  const handleGenerateQRCode = async () => {
    if (!templateWorkbook) {
      alert("Please import template first");
      return;
    }

    const newWb = XLSX.utils.book_new();
    const sheetName = templateWorkbook.SheetNames[0];
    const sheet = JSON.parse(
      JSON.stringify(templateWorkbook.Sheets[sheetName])
    );

    // Generate QR codes for each system
    for (const system of systems) {
      if (system.fields.length > 0) {
        // Single field system (like PROMOS SYSTEM)
        const qrData = system.fields.map((f) => f.cell).join(" | ");
        const qrDataUrl = await QRCode.toDataURL(qrData, { width: 100 });

        const qrField = system.fields.find((f) => f.label.includes("QR"));
        if (qrField) {
          sheet[qrField.cell] = {
            v: `QR: ${qrData.substring(0, 30)}...`,
            t: "s",
            l: { Target: qrDataUrl },
          };
        }
      } else {
        // Multiple row system
        for (const row of system.dataRows) {
          const qrData = `${row.itemDataCell} -> ${row.itemQRCell}`;
          const qrDataUrl = await QRCode.toDataURL(qrData, { width: 100 });

          sheet[row.itemQRCell] = {
            v: `QR: ${qrData}`,
            t: "s",
            l: { Target: qrDataUrl },
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(newWb, sheet, sheetName);
    XLSX.writeFile(newWb, "generated_qrcodes.xlsx");
  };

  const addDataRow = (systemId: string) => {
    setSystems(
      systems.map((sys) => {
        if (sys.id === systemId) {
          return {
            ...sys,
            dataRows: [
              ...sys.dataRows,
              {
                id: Date.now().toString(),
                itemDataCell: "BF3",
                itemQRCell: "A4",
              },
            ],
          };
        }
        return sys;
      })
    );
  };

  const removeDataRow = (systemId: string, rowId: string) => {
    setSystems(
      systems.map((sys) => {
        if (sys.id === systemId) {
          return {
            ...sys,
            dataRows: sys.dataRows.filter((row) => row.id !== rowId),
          };
        }
        return sys;
      })
    );
  };

  const updateDataRow = (
    systemId: string,
    rowId: string,
    field: "itemDataCell" | "itemQRCell" | "itemDataLabel" | "itemQRLabel",
    value: string
  ) => {
    setSystems(
      systems.map((sys) => {
        if (sys.id === systemId) {
          return {
            ...sys,
            dataRows: sys.dataRows.map((row) =>
              row.id === rowId ? { ...row, [field]: value } : row
            ),
          };
        }
        return sys;
      })
    );
  };

  const toggleSystemVisibility = (systemId: string) => {
    setSystems(
      systems.map((sys) =>
        sys.id === systemId ? { ...sys, isVisible: !sys.isVisible } : sys
      )
    );
  };

  const handleVerifyPassword = () => {
    if (templatePassword === TEMPLATE_PASSWORD) {
      setIsPasswordVerified(true);
      setErrorMessage("");
    } else {
      setErrorMessage("Incorrect password! Please try again.");
      setTemplatePassword("");
    }
  };

  const handleCloseTemplateDialog = () => {
    setTemplateFile(null);
    setIsTemplateDialogOpen(false);
    setTemplatePassword("");
    setIsPasswordVerified(false);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        {/* Header - Centered Title */}
        <div className="text-center mb-20">
          <h1 className="inline-block text-3xl font-bold bg-white px-8 py-4 rounded-lg shadow-lg border-2 border-indigo-200 text-indigo-900">
            MULTI-SYSTEM QR CODE GENERATOR
          </h1>
        </div>
        {/* Template and Configure Setting Buttons */}
        <div className="flex justify-start gap-4 mb-6">
          <TemplateButton
            onClick={() => {
              setTemplateFile(null); // reset file
              setTemplateWorkbook(null); // reset workbook
              setTemplatePassword(""); // reset password
              setIsPasswordVerified(false); // reset password verification status
              setErrorMessage(""); // reset error message
              setIsTemplateDialogOpen(true);
            }}
          />

          <ConfigureSettingButton onClick={() => setIsConfigDialogOpen(true)} />
        </div>

        {/* Template Upload Dialog */}
        <TemplateDialog
          isOpen={isTemplateDialogOpen}
          onClose={handleCloseTemplateDialog}
          isPasswordVerified={isPasswordVerified}
          templatePassword={templatePassword}
          onPasswordChange={setTemplatePassword}
          onVerifyPassword={handleVerifyPassword}
          onFileSelect={handleTemplateFileSelect}
          errorMessage={errorMessage}
          handleClearFile={handleClearFile}
          templateFile={templateFile}
        />

        {/* File Selection */}
        {/* <div className="mb-6">
          {templateFile ? (
            <div className="bg-white rounded-lg shadow-md border border-indigo-300 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {templateFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(templateFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearFile}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <label className="bg-white px-6 py-4 rounded-lg shadow-md border-2 border-dashed border-indigo-300 cursor-pointer hover:bg-indigo-50 transition flex items-center justify-center gap-2 text-indigo-900 font-medium">
              <Upload className="w-5 h-5" />
              SELECT FILE
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
              />
            </label>
          )}
        </div> */}

        {/* Import and Generate Buttons */}
        <div className="flex justify-end gap-4 mb-6">
          <GenerateQRButton onClick={handleGenerateQRCode} />
        </div>

        {/* Configure Setting Dialog */}
        <ConfigureSettingDialog
          isOpen={isConfigDialogOpen}
          onClose={() => setIsConfigDialogOpen(false)}
          labels={labels}
          onLabelsChange={setLabels}
          itemDataCell={itemDataCell}
          itemQRCell={itemQRCell}
          lotDataCell={lotDataCell}
          lotQRCell={lotQRCell}
          qtyDataCell={qtyDataCell}
          qtyQRCell={qtyQRCell}
          onItemDataCellChange={setItemDataCell}
          onItemQRCellChange={setItemQRCell}
          onLotDataCellChange={setLotDataCell}
          onLotQRCellChange={setLotQRCell}
          onQtyDataCellChange={setQtyDataCell}
          onQtyQRCellChange={setQtyQRCell}
          systems={systems}
          onAddDataRow={addDataRow}
          onRemoveDataRow={removeDataRow}
          onUpdateDataRow={updateDataRow}
          onSaveSettings={handleSaveSettings}
          onResetSettings={handleResetSettings}
        />
      </div>
    </div>
  );
}
