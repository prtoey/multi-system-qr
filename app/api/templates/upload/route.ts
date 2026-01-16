import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

type TemplateRegistry = {
  templates: {
    name: string;
    filename: string;
    createdAt: string;
  }[];
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    // Template name comes ONLY from filename
    const templateName = file.name.replace(/\.[^/.]+$/, "");

    const baseDir = path.join(process.cwd(), "uploads", "templates");
    const excelPath = path.join(baseDir, `${templateName}.xlsx`);
    const jsonPath = path.join(baseDir, "templates.json");

    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    // ---------- Read or Init JSON ----------
    let registry: TemplateRegistry = { templates: [] };

    if (fs.existsSync(jsonPath)) {
      registry = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    }

    // ---------- Prevent duplicate ----------
    if (registry.templates.some((t) => t.name === templateName)) {
      return NextResponse.json(
        { error: "Template already exists" },
        { status: 409 }
      );
    }

    // ---------- Save Excel ----------
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(excelPath, buffer);

    const now = new Date();
    const createdAt =
      `${now.getFullYear()}-` +
      `${String(now.getMonth() + 1).padStart(2, "0")}-` +
      `${String(now.getDate()).padStart(2, "0")} ` +
      `${String(now.getHours()).padStart(2, "0")}:` +
      `${String(now.getMinutes()).padStart(2, "0")}`;

    registry.templates.push({
      name: templateName,
      filename: `${templateName}.xlsx`,
      createdAt,
    });

    fs.writeFileSync(jsonPath, JSON.stringify(registry, null, 2));

    return NextResponse.json({
      success: true,
      templateName,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
