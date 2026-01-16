import { Plus, Trash2 } from "lucide-react";

interface DataRow {
  id: string;
  orderNo: string;
  itemCode: string;
  externalLot: string;
  materialCode: string;
  internalLot: string;
  qty: string;
}

interface EditableDataGridProps {
  data: DataRow[];
  onDataChange: (data: DataRow[]) => void;
}

export function EditableDataGrid({
  data,
  onDataChange,
}: EditableDataGridProps) {
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
    onDataChange([...data, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    onDataChange(data.filter((row) => row.id !== id));
  };

  const handleCellChange = (
    id: string,
    field: keyof DataRow,
    value: string
  ) => {
    onDataChange(
      data.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handlePaste = (
    e: React.ClipboardEvent,
    rowIndex: number,
    field: keyof DataRow
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const rows = pastedText.split("\n").filter((row) => row.trim());

    if (rows.length === 1) {
      // Single cell paste
      const cells = rows[0].split("\t");
      if (cells.length === 1) {
        // Just paste the value into current cell
        handleCellChange(data[rowIndex].id, field, cells[0]);
      } else {
        // Multiple cells in one row
        const fields: (keyof DataRow)[] = [
          "orderNo",
          "itemCode",
          "externalLot",
          "materialCode",
          "internalLot",
          "qty",
        ];
        const startFieldIndex = fields.indexOf(field);
        const newData = [...data];

        cells.forEach((cellValue, i) => {
          const fieldIndex = startFieldIndex + i;
          if (fieldIndex < fields.length) {
            newData[rowIndex] = {
              ...newData[rowIndex],
              [fields[fieldIndex]]: cellValue.trim(),
            };
          }
        });

        onDataChange(newData);
      }
    } else {
      // Multiple rows paste
      const fields: (keyof DataRow)[] = [
        "orderNo",
        "itemCode",
        "externalLot",
        "materialCode",
        "internalLot",
        "qty",
      ];
      const startFieldIndex = fields.indexOf(field);
      const newData = [...data];

      rows.forEach((rowText, rowOffset) => {
        const cells = rowText.split("\t");
        const targetRowIndex = rowIndex + rowOffset;

        // Add new rows if needed
        while (newData.length <= targetRowIndex) {
          newData.push({
            id: `${Date.now()}_${newData.length}`,
            orderNo: "",
            itemCode: "",
            externalLot: "",
            materialCode: "",
            internalLot: "",
            qty: "",
          });
        }

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

      onDataChange(newData);
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-300 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_50px] bg-linear-to-r from-yellow-400 to-yellow-500 border-b-2 border-gray-400">
        <div className="px-4 py-3 font-bold text-gray-800 border-r border-gray-400">
          ORDER NO.
        </div>
        <div className="px-4 py-3 font-bold text-gray-800 border-r border-gray-400">
          Item Code
        </div>
        <div className="px-4 py-3 font-bold text-gray-800 border-r border-gray-400">
          External Lot.
        </div>
        <div className="px-4 py-3 font-bold text-gray-800 border-r border-gray-400">
          Material code
        </div>
        <div className="px-4 py-3 font-bold text-gray-800 border-r border-gray-400">
          Internal Lot
        </div>
        <div className="px-4 py-3 font-bold text-gray-800 border-r border-gray-400">
          Q'ty
        </div>
        <div className="px-2 py-3"></div>
      </div>

      {/* Data Rows */}
      <div className="max-h-[400px] overflow-y-auto">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No data rows. Click "Add Row" to start.</p>
            <p className="text-sm">
              You can also paste data from Excel directly into the cells.
            </p>
          </div>
        ) : (
          data.map((row, index) => (
            <div
              key={row.id}
              className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_50px] border-b border-gray-200 hover:bg-gray-50"
            >
              <input
                type="text"
                value={row.orderNo}
                onChange={(e) =>
                  handleCellChange(row.id, "orderNo", e.target.value)
                }
                onPaste={(e) => handlePaste(e, index, "orderNo")}
                className="px-4 py-2 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Order number"
              />
              <input
                type="text"
                value={row.itemCode}
                onChange={(e) =>
                  handleCellChange(row.id, "itemCode", e.target.value)
                }
                onPaste={(e) => handlePaste(e, index, "itemCode")}
                className="px-4 py-2 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Item code"
              />
              <input
                type="text"
                value={row.externalLot}
                onChange={(e) =>
                  handleCellChange(row.id, "externalLot", e.target.value)
                }
                onPaste={(e) => handlePaste(e, index, "externalLot")}
                className="px-4 py-2 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="External lot"
              />
              <input
                type="text"
                value={row.materialCode}
                onChange={(e) =>
                  handleCellChange(row.id, "materialCode", e.target.value)
                }
                onPaste={(e) => handlePaste(e, index, "materialCode")}
                className="px-4 py-2 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Material code"
              />
              <input
                type="text"
                value={row.internalLot}
                onChange={(e) =>
                  handleCellChange(row.id, "internalLot", e.target.value)
                }
                onPaste={(e) => handlePaste(e, index, "internalLot")}
                className="px-4 py-2 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Internal lot"
              />
              <input
                type="text"
                value={row.qty}
                onChange={(e) =>
                  handleCellChange(row.id, "qty", e.target.value)
                }
                onPaste={(e) => handlePaste(e, index, "qty")}
                className="px-4 py-2 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Quantity"
              />
              <button
                onClick={() => handleRemoveRow(row.id)}
                className="flex items-center justify-center hover:bg-red-100 transition"
                title="Delete row"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Row Button */}
      <div className="bg-gray-50 border-t-2 border-gray-300 p-3">
        <button
          onClick={handleAddRow}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Row
        </button>
      </div>
    </div>
  );
}
