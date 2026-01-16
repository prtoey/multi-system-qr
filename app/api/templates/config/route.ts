import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const { templateId, config } = await req.json();

  if (!templateId || !config) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const configDir = path.join(process.cwd(), "configs");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const filePath = path.join(configDir, `${templateId}.json`);

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      {
        templateId,
        config,
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  return Response.json({ success: true });
}
