import { Plus } from "lucide-react";
import { DataRow } from "../components/types";

interface ExcelStyleGridProps {
  data: DataRow[];
  onDataChange: (data: DataRow[]) => void;
}

export function ExcelStyleGrid({ data, onDataChange }: ExcelStyleGridProps) {
  // Helper to check if a row is empty (all fields except id are empty)
  const isRowEmpty = (row: DataRow) =>
    !row.orderNo &&
    !row.itemCode &&
    !row.externalLot &&
    !row.materialCode &&
    !row.internalLot &&
    !row.qty;

  // Filter out empty rows before updating
  const setRealRows = (rows: DataRow[]) => {
    const realRows = rows.filter((row) => !isRowEmpty(row));
    onDataChange(realRows);
  };

  const handleAddRow = () => {
    const newRow: DataRow = {
      id: Date.now().toString(),
      orderNo: "",
      itemCode: "",
      externalLot: "",
      materialCode: "",
      internalLot: "",
      qty: "",
    };
    setRealRows([...data, newRow]);
  };

  const handleCellChange = (
    rowIndex: number,
    field: keyof DataRow,
    value: string,
  ) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    setRealRows(newData);
  };

  const handlePaste = (
    e: React.ClipboardEvent,
    rowIndex: number,
    field: keyof DataRow,
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    // Split by newlines to get rows
    const rows = pastedText.split(/\r?\n/).filter((row) => row.length > 0);

    if (rows.length === 0) return;

    const fields: (keyof DataRow)[] = [
      "orderNo",
      "itemCode",
      "externalLot",
      "materialCode",
      "internalLot",
      "qty",
    ];
    const startFieldIndex = fields.indexOf(field);

    if (startFieldIndex === -1) return;

    const newData = [...data];

    rows.forEach((rowText, rowOffset) => {
      // Split by tab to get cells (Excel uses tabs between columns)
      const cells = rowText.split("\t");
      const targetRowIndex = rowIndex + rowOffset;

      // Add new rows if needed
      while (newData.length <= targetRowIndex) {
        newData.push({
          id: `${Date.now()}_${newData.length}_${Math.random()}`,
          orderNo: "",
          itemCode: "",
          externalLot: "",
          materialCode: "",
          internalLot: "",
          qty: "",
        });
      }

      // Fill in the cells starting from the clicked field
      cells.forEach((cellValue, cellOffset) => {
        const fieldIndex = startFieldIndex + cellOffset;
        if (fieldIndex < fields.length) {
          newData[targetRowIndex] = {
            ...newData[targetRowIndex],
            [fields[fieldIndex]]: cellValue.trim(),
          };
        }
      });
    });

    setRealRows(newData);
  };

  // Ensure at least 15 rows for display
  const displayRows = [...data];
  while (displayRows.length < 15) {
    displayRows.push({
      id: `empty_${displayRows.length}`,
      orderNo: "",
      itemCode: "",
      externalLot: "",
      materialCode: "",
      internalLot: "",
      qty: "",
    });
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Excel-style container */}
      <div className="relative">
        {/* Toolbar */}
        <div className="bg-gray-100 border-b border-gray-300 px-3 py-2 flex items-center gap-2">
          <button
            onClick={handleAddRow}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition flex items-center gap-1"
            title="Add new row"
          >
            <Plus className="w-3 h-3" />
            Add Row
          </button>
          <div className="text-xs text-gray-600 ml-auto">
            {data.length} rows
          </div>
        </div>

        {/* Spreadsheet Grid - Fixed height 300px with scrollbar */}
        <div className="overflow-auto" style={{ height: "250px" }}>
          <table className="w-full border-collapse">
            {/* Column Headers */}
            <thead className="sticky top-0 z-10">
              <tr>
                {/* Row number header */}
                <th className="bg-gray-100 border border-gray-300 w-12 min-w-12 text-center text-xs font-semibold text-gray-600"></th>

                {/* Column letter headers */}
                <th className="bg-gray-100 border border-gray-300 px-2 py-1 text-center text-xs font-semibold text-gray-600 min-w-[140px]">
                  A
                </th>
                <th className="bg-gray-100 border border-gray-300 px-2 py-1 text-center text-xs font-semibold text-gray-600 min-w-[140px]">
                  B
                </th>
                <th className="bg-gray-100 border border-gray-300 px-2 py-1 text-center text-xs font-semibold text-gray-600 min-w-[100px]">
                  C
                </th>
                <th className="bg-gray-100 border border-gray-300 px-2 py-1 text-center text-xs font-semibold text-gray-600 min-w-[140px]">
                  D
                </th>
                <th className="bg-gray-100 border border-gray-300 px-2 py-1 text-center text-xs font-semibold text-gray-600 min-w-[140px]">
                  E
                </th>
                <th className="bg-gray-100 border border-gray-300 px-2 py-1 text-center text-xs font-semibold text-gray-600 min-w-[100px]">
                  F
                </th>
              </tr>

              {/* Field name row */}
              <tr>
                <th className="bg-gray-50 border border-gray-300 text-center text-xs font-semibold text-gray-600">
                  1
                </th>
                <th className="bg-yellow-400 border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-800">
                  ORDER NO.
                </th>
                <th className="bg-yellow-400 border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-800">
                  Item Code
                </th>
                <th className="bg-yellow-400 border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-800">
                  External Lot.
                </th>
                <th className="bg-yellow-400 border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-800">
                  Material code
                </th>
                <th className="bg-yellow-400 border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-800">
                  Internal Lot
                </th>
                <th className="bg-yellow-400 border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-800">
                  Q'ty
                </th>
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {displayRows.map((row, index) => {
                const isEmptyRow = row.id.startsWith("empty_");
                const isDataRow = index < data.length;

                return (
                  <tr key={row.id} className="hover:bg-blue-50">
                    {/* Row number */}
                    <td className="bg-gray-50 border border-gray-300 text-center text-xs font-medium text-gray-600 py-1">
                      {index + 2}
                    </td>

                    {/* ORDER NO. (Column A) */}
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.orderNo}
                        onChange={(e) =>
                          isDataRow &&
                          handleCellChange(index, "orderNo", e.target.value)
                        }
                        onPaste={(e) => handlePaste(e, index, "orderNo")}
                        onFocus={(e) => {
                          if (isEmptyRow) {
                            handleAddRow();
                          }
                        }}
                        className="w-full px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset bg-transparent"
                      />
                    </td>

                    {/* Item Code (Column B) */}
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.itemCode}
                        onChange={(e) =>
                          isDataRow &&
                          handleCellChange(index, "itemCode", e.target.value)
                        }
                        onPaste={(e) => handlePaste(e, index, "itemCode")}
                        onFocus={(e) => {
                          if (isEmptyRow) {
                            handleAddRow();
                          }
                        }}
                        className="w-full px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset bg-transparent"
                      />
                    </td>

                    {/* External Lot. (Column C) */}
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.externalLot}
                        onChange={(e) =>
                          isDataRow &&
                          handleCellChange(index, "externalLot", e.target.value)
                        }
                        onPaste={(e) => handlePaste(e, index, "externalLot")}
                        onFocus={(e) => {
                          if (isEmptyRow) {
                            handleAddRow();
                          }
                        }}
                        className="w-full px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset bg-transparent"
                      />
                    </td>

                    {/* Material code (Column D) */}
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.materialCode}
                        onChange={(e) =>
                          isDataRow &&
                          handleCellChange(
                            index,
                            "materialCode",
                            e.target.value,
                          )
                        }
                        onPaste={(e) => handlePaste(e, index, "materialCode")}
                        onFocus={(e) => {
                          if (isEmptyRow) {
                            handleAddRow();
                          }
                        }}
                        className="w-full px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset bg-transparent"
                      />
                    </td>

                    {/* Internal Lot (Column E) */}
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.internalLot}
                        onChange={(e) =>
                          isDataRow &&
                          handleCellChange(index, "internalLot", e.target.value)
                        }
                        onPaste={(e) => handlePaste(e, index, "internalLot")}
                        onFocus={(e) => {
                          if (isEmptyRow) {
                            handleAddRow();
                          }
                        }}
                        className="w-full px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset bg-transparent"
                      />
                    </td>

                    {/* Q'ty (Column F) */}
                    <td className="border border-gray-300 p-0">
                      <input
                        type="text"
                        value={row.qty}
                        onChange={(e) =>
                          isDataRow &&
                          handleCellChange(index, "qty", e.target.value)
                        }
                        onPaste={(e) => handlePaste(e, index, "qty")}
                        onFocus={(e) => {
                          if (isEmptyRow) {
                            handleAddRow();
                          }
                        }}
                        className="w-full px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset bg-transparent"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Sheet tabs at bottom */}
        <div className="bg-gray-100 border-t border-gray-300 px-3 py-3 flex items-center gap-2"></div>
      </div>
    </div>
  );
}
