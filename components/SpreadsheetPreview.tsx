import { FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

interface SpreadsheetPreviewProps {
  workbook: any;
  sheetName?: string;
  maxRows?: number;
  maxCols?: number;
}

export function SpreadsheetPreview({
  workbook,
  sheetName,
  maxRows = 20,
  maxCols = 10,
}: SpreadsheetPreviewProps) {
  if (!workbook) {
    return null;
  }

  const sheet = sheetName
    ? workbook.Sheets[sheetName]
    : workbook.Sheets[workbook.SheetNames[0]];
  const currentSheetName = sheetName || workbook.SheetNames[0];

  if (!sheet) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg">
        No data found in the selected sheet.
      </div>
    );
  }

  // Get the range of the sheet
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1");

  // Limit the display range
  const displayRange = {
    s: { r: range.s.r, c: range.s.c },
    e: {
      r: Math.min(range.e.r, range.s.r + maxRows - 1),
      c: Math.min(range.e.c, range.s.c + maxCols - 1),
    },
  };

  // Generate column headers (A, B, C, ...)
  const colHeaders: string[] = [];
  for (let c = displayRange.s.c; c <= displayRange.e.c; c++) {
    colHeaders.push(XLSX.utils.encode_col(c));
  }

  // Generate rows with data
  const rows: Array<{
    rowNum: number;
    cells: Array<{ col: string; value: any }>;
  }> = [];
  for (let r = displayRange.s.r; r <= displayRange.e.r; r++) {
    const rowCells: Array<{ col: string; value: any }> = [];
    for (let c = displayRange.s.c; c <= displayRange.e.c; c++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[cellAddress];
      rowCells.push({
        col: XLSX.utils.encode_col(c),
        value: cell ? cell.v : "",
      });
    }
    rows.push({ rowNum: r + 1, cells: rowCells });
  }

  return (
    <div className="bg-white border-2 border-indigo-300 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 flex items-center gap-3">
        <FileSpreadsheet className="w-5 h-5" />
        <div>
          <div className="font-bold">Data Preview</div>
          <div className="text-xs text-indigo-100">
            Sheet: {currentSheetName}
          </div>
        </div>
      </div>

      {/* Spreadsheet Grid */}
      <div className="overflow-auto max-h-96 bg-gray-50">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-blue-100 z-10">
            <tr>
              <th className="border border-gray-300 bg-blue-200 px-3 py-2 text-sm font-bold text-blue-900 min-w-12">
                #
              </th>
              {colHeaders.map((col) => (
                <th
                  key={col}
                  className="border border-gray-300 bg-blue-200 px-3 py-2 text-sm font-bold text-blue-900 min-w-32"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-600 bg-blue-50">
                  {row.rowNum}
                </td>
                {row.cells.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="border border-gray-300 px-3 py-2 text-sm text-gray-800"
                  >
                    {cell.value !== "" ? String(cell.value) : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      {(range.e.r > displayRange.e.r || range.e.c > displayRange.e.c) && (
        <div className="bg-indigo-50 border-t border-indigo-200 px-4 py-2 text-xs text-indigo-700">
          Showing {displayRange.e.r - displayRange.s.r + 1} of{" "}
          {range.e.r - range.s.r + 1} rows,{" "}
          {displayRange.e.c - displayRange.s.c + 1} of{" "}
          {range.e.c - range.s.c + 1} columns
        </div>
      )}
    </div>
  );
}
