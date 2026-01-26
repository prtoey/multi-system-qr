import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const templateId = formData.get("templateId") as string;
  const configRaw = formData.get("config") as string;

  if (!file || !templateId || !configRaw) {
    return NextResponse.json(
      { error: "Missing file, templateId, or config" },
      { status: 400 },
    );
  }

  const config = JSON.parse(configRaw);
  const buffer = Buffer.from(await file.arrayBuffer());

  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  /* -------------------------
     READ GLOBAL ROWS
  -------------------------- */
  const globalData = config.globalRows.map((row: any) => ({
    label: row.itemDataLabel,
    data: sheet[row.itemDataCell]?.v ?? null,
    qr: sheet[row.itemQRCell]?.v ?? null,
  }));

  /* -------------------------
     READ SYSTEM DATA
  -------------------------- */
  const systemsData = config.systems.map((system: any) => ({
    systemName: system.name,
    rows: system.dataRows.map((row: any) => ({
      data: sheet[row.itemDataCell]?.v ?? null,
      qr: sheet[row.itemQRCell]?.v ?? null,
      type: row.type ?? null,
    })),
  }));

  return NextResponse.json({
    templateId,
    globalData,
    systemsData,
  });
}
