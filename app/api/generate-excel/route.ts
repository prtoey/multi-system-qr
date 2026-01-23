export const runtime = "nodejs";

import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import QRCode from "qrcode";
import { NextRequest, NextResponse } from "next/server";

/* connect database */
const db = mysql.createPool({
  host: "172.16.52.187",
  user: "client",
  password: "pmd445566",
  database: "[pe]generate_qr_code_for_pms",
  port: 3307,
});

/* main api post */
export async function POST(req: NextRequest) {
  let outputPath = "";
  const generatedQrFiles: string[] = [];

  try {
    const { templateId, rows } = await req.json();

    if (!templateId || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    /* ---------- PATHS ---------- */
    const templatePath = path.join(
      process.cwd(),
      "uploads",
      "templates",
      `${templateId}.xlsx`,
    );

    const configPath = path.join(
      process.cwd(),
      "configs",
      `${templateId}.json`,
    );

    const outputDir = path.join(process.cwd(), "uploads", "generated");

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    if (!fs.existsSync(configPath)) {
      throw new Error(`Config not found: ${configPath}`);
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    /* ---------- LOAD CONFIG ---------- */
    const rawConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const config = rawConfig.config ?? rawConfig;

    /* ---------- LOAD EXCEL ---------- */
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    const templateSheet = workbook.getWorksheet("Template");
    if (!templateSheet) {
      throw new Error('Sheet "Template" not found');
    }

    const sheets: ExcelJS.Worksheet[] = [];

    // duplicate template first
    for (let i = 0; i < rows.length; i++) {
      const sheet = duplicateTemplateSheet(
        workbook,
        templateSheet,
        `Template_${i + 1}`,
      );
      sheets.push(sheet);
    }

    // remove base template
    workbook.removeWorksheet(templateSheet.id);

    // then apply data + QR
    for (let i = 0; i < rows.length; i++) {
      const data = rows[i];
      const sheet = sheets[i];

      await applyGlobalRows(sheet, data, config, outputDir, generatedQrFiles);

      for (const system of config.systems || []) {
        if (system.name === "PROMOS SYSTEM") {
          await applyPromosSystem(
            sheet,
            data,
            system,
            outputDir,
            generatedQrFiles,
          );
        }
      }
    }

    /* ---------- SAVE TEMP EXCEL ---------- */
    const fileName = `${templateId}_${Date.now()}.xlsx`;
    outputPath = path.join(outputDir, fileName);

    await workbook.xlsx.writeFile(outputPath);

    /* ---------- READ BUFFER ---------- */
    const buffer = fs.readFileSync(outputPath);

    /* ---------- SEND TO BROWSER ---------- */
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    /* ---------- CLEAN UP FILES ---------- */

    // delete excel
    if (outputPath && fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    // delete QR png
    for (const qrPath of generatedQrFiles) {
      if (fs.existsSync(qrPath)) {
        fs.unlinkSync(qrPath);
      }
    }
  }
}

function duplicateTemplateSheet(
  workbook: ExcelJS.Workbook,
  templateSheet: ExcelJS.Worksheet,
  newName: string,
): ExcelJS.Worksheet {
  // Create a new worksheet with the same column count
  const newSheet = workbook.addWorksheet(newName, {
    properties: { tabColor: templateSheet.properties?.tabColor },
    pageSetup: { ...templateSheet.pageSetup },
    views: templateSheet.views
      ? JSON.parse(JSON.stringify(templateSheet.views))
      : undefined,
  });

  // Copy columns (width, style, hidden, outlineLevel, etc.)
  templateSheet.columns.forEach((col, i) => {
    const newCol = newSheet.getColumn(i + 1);
    newCol.width = col.width;
    if (typeof col.hidden === "boolean") newCol.hidden = col.hidden;
    if (typeof col.outlineLevel === "number")
      newCol.outlineLevel = col.outlineLevel;
    if (col.style) newCol.style = { ...col.style };
  });

  // Copy rows and cells (values, styles, types, formulas, etc.)
  templateSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    const newRow = newSheet.getRow(rowNumber);
    newRow.height = row.height;
    newRow.hidden = row.hidden;
    newRow.outlineLevel = row.outlineLevel;

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const newCell = newRow.getCell(colNumber);

      // Copy value, formula, type
      if (cell.type === ExcelJS.ValueType.Formula) {
        newCell.value = {
          formula: cell.formula,
          result: cell.result,
        };
      } else {
        newCell.value = cell.value;
      }

      // Copy style (including border, font, alignment, fill, etc.)
      newCell.style = { ...cell.style };
      if (cell.border) newCell.border = { ...cell.border };
      if (cell.font) newCell.font = { ...cell.font };
      if (cell.alignment) newCell.alignment = { ...cell.alignment };
      if (cell.fill) newCell.fill = { ...cell.fill };

      // Copy data validation
      if (cell.dataValidation) {
        newCell.dataValidation = { ...cell.dataValidation };
      }

      // Copy numFmt
      if (cell.numFmt) {
        newCell.numFmt = cell.numFmt;
      }

      // Copy hyperlink
      if (cell.hyperlink) {
        newCell.value = {
          text: String(cell.text ?? cell.value ?? ""),
          hyperlink: cell.hyperlink,
        };
      }

      // Copy comment
      if (cell.note) {
        newCell.note = cell.note;
      }
    });

    newRow.commit();
  });

  // Copy merged cells and preserve right/bottom borders
  const merges = (templateSheet as any)._merges;
  if (merges) {
    for (const key of Object.keys(merges)) {
      const m = merges[key];
      newSheet.mergeCells(m.top, m.left, m.bottom, m.right);

      // Preserve right and bottom borders for merged ranges
      const bottomRow = m.bottom;
      const rightCol = m.right;

      // Bottom border for all columns in the bottom row of the merge
      for (let col = m.left; col <= m.right; col++) {
        const cell = newSheet.getRow(bottomRow).getCell(col);
        const templateCell = templateSheet.getRow(bottomRow).getCell(col);
        if (templateCell.border?.bottom) {
          cell.border = {
            ...cell.border,
            bottom: { ...templateCell.border.bottom },
          };
        }
      }

      // Right border for all rows in the rightmost column of the merge
      for (let row = m.top; row <= m.bottom; row++) {
        const cell = newSheet.getRow(row).getCell(rightCol);
        const templateCell = templateSheet.getRow(row).getCell(rightCol);
        if (templateCell.border?.right) {
          cell.border = {
            ...cell.border,
            right: { ...templateCell.border.right },
          };
        }
      }
    }
  }

  // Ensure column widths are set (sometimes lost after merge)
  templateSheet.columns.forEach((col, i) => {
    const newCol = newSheet.getColumn(i + 1);
    newCol.width = col.width;
  });

  return newSheet;
}

/* ================= HELPERS ================= */
function resolveWritableCell(
  sheet: ExcelJS.Worksheet,
  address: string,
): string {
  const target = sheet.getCell(address);
  const r = target.row;
  const c = target.col;

  // @ts-ignore private api
  for (const merge of sheet._merges?.values?.() || []) {
    if (
      r >= merge.top &&
      r <= merge.bottom &&
      c >= merge.left &&
      c <= merge.right
    ) {
      return sheet.getRow(merge.top).getCell(merge.left).address;
    }
  }
  return address;
}

/* ================= GLOBAL ROWS ================= */

async function applyGlobalRows(
  sheet: ExcelJS.Worksheet,
  data: any,
  config: any,
  outputDir: string,
  generatedQrFiles: string[],
) {
  if (!Array.isArray(config.globalRows)) return;

  for (const g of config.globalRows) {
    const value = resolveDataById(g.id, data);
    if (!value) continue;

    /* ---------- WRITE DATA CELL ---------- */
    const dataCell = resolveWritableCell(sheet, g.itemDataCell);
    sheet.getCell(dataCell).value = value;

    /* ---------- GENERATE QR ---------- */
    if (g.itemQRCell) {
      const qrCell = resolveWritableCell(sheet, g.itemQRCell);

      const qrFileName = `QR_${g.id}_${Date.now()}.png`;
      const qrPath = await generateQrPng(String(value), outputDir, qrFileName);

      generatedQrFiles.push(qrPath);
      addPngToExcel(sheet, qrPath, qrCell);
    }
  }
}

function resolveDataById(id: string, data: any): string {
  switch (id) {
    case "item":
      return data.itemCode ?? "";
    case "lot":
      return data.externalLot ?? "";
    case "qty":
      return String(data.qty ?? "");
    default:
      return "";
  }
}

/* ================= PROMOS SYSTEM ================= */
function normalizeItemCode(itemCode: string): string {
  if (!itemCode) return "";
  return itemCode.split("-")[0];
}

async function getItemAps(itemCode: string) {
  const code = normalizeItemCode(itemCode);
  if (!code) return null;

  const [rows] = await db.query(
    `SELECT item_aps, product FROM item_aps WHERE item_code = ? LIMIT 1`,
    [code],
  );

  return (rows as any[])[0] ?? null;
}

async function applyPromosSystem(
  sheet: ExcelJS.Worksheet,
  data: any,
  system: any,
  outputDir: string,
  generatedQrFiles: string[],
) {
  if (!system || !Array.isArray(system.fields)) return;

  const dbData = await getItemAps(data.itemCode);

  let qrCell = "";

  for (const field of system.fields) {
    if (!field.cell) continue;

    let value = "";

    switch (field.label) {
      case "ITEM CODE":
        value = data.itemCode ?? "";
        break;
      case "LOT":
        value = data.externalLot ?? "";
        break;
      case "ORDER NO.":
        value = data.orderNo ?? "";
        break;
      case "ITEM APS":
        value = dbData?.item_aps ?? "";
        break;
      case "QR CODE":
        qrCell = resolveWritableCell(sheet, field.cell);
        continue;
      default:
        continue;
    }

    if (!value) continue;

    const cell = resolveWritableCell(sheet, field.cell);
    sheet.getCell(cell).value = value;
  }

  /* ===== GENERATE QR (PNG) ===== */
  if (qrCell) {
    const payload = buildPromosQrPayload(data, dbData);

    const qrFileName = `QR_${Date.now()}.png`;
    const qrPath = await generateQrPng(payload, outputDir, qrFileName);
    generatedQrFiles.push(qrPath);
    addPngToExcel(sheet, qrPath, qrCell);
  }
}

/* ================= QR ================= */
function buildPromosQrPayload(data: any, db: any) {
  return (
    `@1${db?.item_aps ?? ""}` +
    `@2${data.externalLot ?? ""}` +
    `@3${data.orderNo ?? ""}` +
    `(E@02)${data.itemCode ?? ""}` +
    `(E@05)${data.externalLot ?? ""}` +
    `(E@06)${data.qty ?? ""}` +
    `(E@07)Production Record` +
    `(E@08)${db?.product ?? ""}` +
    `(E@099)For Split`
  );
}

async function generateQrPng(
  payload: string,
  outputDir: string,
  fileName: string,
) {
  const filePath = path.join(outputDir, fileName);

  await QRCode.toFile(filePath, payload, {
    type: "png",
    width: 300,
    margin: 2,
  });

  return filePath;
}

function addPngToExcel(
  sheet: ExcelJS.Worksheet,
  imagePath: string,
  cellAddress: string,
) {
  const cell = sheet.getCell(cellAddress);

  const imageId = sheet.workbook.addImage({
    filename: imagePath,
    extension: "png",
  });

  sheet.addImage(imageId, {
    tl: { col: Number(cell.col) - 1, row: Number(cell.row) - 1 },
    ext: { width: 60, height: 60 },
  });
}
