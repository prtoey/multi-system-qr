import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const templateId = formData.get("templateId") as string | null;
    const file = formData.get("file") as File | null;

    if (!templateId || !file) {
      return NextResponse.json(
        { error: "Missing templateId or file" },
        { status: 400 }
      );
    }

    const baseDir = path.join(process.cwd(), "uploads", "templates");
    const jsonPath = path.join(baseDir, "templates.json");

    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json(
        { error: "Template registry not found" },
        { status: 404 }
      );
    }

    const registry = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    //  Find template from registry
    const template = registry.templates.find((t: any) => t.name === templateId);

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    //  filename from registry
    const excelPath = path.join(baseDir, template.filename);

    //  protect against missing file
    if (!fs.existsSync(excelPath)) {
      return NextResponse.json(
        { error: "Excel file not found on disk" },
        { status: 404 }
      );
    }

    //  Replace Excel file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(excelPath, buffer);

    //  Update timestamp
    const now = new Date();
    template.createdAt =
      `${now.getFullYear()}-` +
      `${String(now.getMonth() + 1).padStart(2, "0")}-` +
      `${String(now.getDate()).padStart(2, "0")} ` +
      `${String(now.getHours()).padStart(2, "0")}:` +
      `${String(now.getMinutes()).padStart(2, "0")}`;

    fs.writeFileSync(jsonPath, JSON.stringify(registry, null, 2));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}
