export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const QR_SYSTEMS = ["PRINT LABEL", "ATTACH LABEL", "BOXPACK"];

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as File | null;
  const configRaw = formData.get("config") as string | null;
  const rowCountRaw = formData.get("rowCount") as string | null;

  if (!file || !configRaw || !rowCountRaw) {
    return NextResponse.json(
      { error: "Missing file, config, or rowCount" },
      { status: 400 },
    );
  }

  const rowCount = Number(rowCountRaw);
  if (Number.isNaN(rowCount) || rowCount <= 0) {
    return NextResponse.json({ error: "Invalid rowCount" }, { status: 400 });
  }

  const config = JSON.parse(configRaw);
  const buffer = Buffer.from(await file.arrayBuffer());

  /* READ WITH XLSX (GET CALCULATED .v) */
  const workbookXLSX = XLSX.read(buffer, { type: "buffer" });

  /* LOAD WITH EXCELJS (FOR IMAGES) */
  const workbookExcelJS = new ExcelJS.Workbook();
  await workbookExcelJS.xlsx.load(buffer as any);

  /* TEMP DIR (CONCURRENT SAFE) */
  const requestId = randomUUID();
  const outputDir = path.join(process.cwd(), "tmp", requestId);
  fs.mkdirSync(outputDir, { recursive: true });

  // 🔑 IMPORTANT: keep files until writeBuffer finishes
  const createdQrFiles: string[] = [];

  try {
    /* PROCESS EACH TEMPLATE SHEET */
    for (let i = 1; i <= rowCount; i++) {
      const sheetName = `Template_${i}`;

      const xlsxSheet = workbookXLSX.Sheets[sheetName];
      const excelSheet = workbookExcelJS.getWorksheet(sheetName);

      if (!xlsxSheet || !excelSheet) continue;

      /* ONLY SELECTED SYSTEMS */
      for (const system of config.systems) {
        if (!QR_SYSTEMS.includes(system.name)) continue;

        for (const row of system.dataRows) {
          if (!row.itemDataCell || !row.itemQRCell) continue;

          // if (row.itemDataCell == "BF15") {
          //   const test1 = getXlsxCellValue(xlsxSheet, "BF15");
          //   console.log("Skip row = ", system.name, row.itemDataCell, test1);
          //   console.log("debug");
          // }
          // USE XLSX .v (FORMULA RESULT)
          const qrValue = getXlsxCellValue(xlsxSheet, row.itemDataCell)
            .replace(/\s+/g, " ")
            .trim();

          if (qrValue === "" || qrValue === "-") {
            // const test1 = getXlsxCellValue(xlsxSheet, "BF15");
            // console.log("Skip row = ", system.name, row.itemDataCell, test1);
            continue;
          }
          const qrPath = await generateQrPng(
            qrValue,
            outputDir,
            `${randomUUID()}.png`,
          );

          addPngToExcel(excelSheet, qrPath, row.itemQRCell);

          // DO NOT DELETE YET
          createdQrFiles.push(qrPath);
        }
      }
    }

    /* WRITE EXCEL (EXCELJS READS PNG HERE) */
    const outBuffer = await workbookExcelJS.xlsx.writeBuffer();

    /* CLEAN UP PNG FILES (SAFE NOW) */
    for (const filePath of createdQrFiles) {
      try {
        fs.unlinkSync(filePath);
      } catch {}
    }

    return new Response(outBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=output-with-qr.xlsx",
      },
    });
  } finally {
    // REMOVE TEMP FOLDER
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
}

/* HELPERS */

// XLSX ALWAYS STORES CALCULATED VALUE IN .v
function getXlsxCellValue(sheet: XLSX.WorkSheet, cellAddress: string): string {
  const cell = sheet[cellAddress];
  if (!cell) return "";

  return cell.v !== undefined && cell.v !== null ? String(cell.v) : "";
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
    ext: { width: 50, height: 50 },
  });
}
