import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const jsonPath = path.join(
      process.cwd(),
      "uploads",
      "templates",
      "templates.json"
    );

    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ templates: [] });
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    if (!Array.isArray(data.templates)) {
      return NextResponse.json({ templates: [] });
    }

    return NextResponse.json({
      templates: data.templates.map((t: any) => t.name),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get template names" },
      { status: 500 }
    );
  }
}
