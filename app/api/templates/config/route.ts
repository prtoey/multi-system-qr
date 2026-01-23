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

  const now = new Date();
  const updatedAt =
    `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, "0")}-` +
    `${String(now.getDate()).padStart(2, "0")} ` +
    `${String(now.getHours()).padStart(2, "0")}:` +
    `${String(now.getMinutes()).padStart(2, "0")}`;

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      {
        templateId,
        config,
        updatedAt,
      },
      null,
      2
    )
  );

  return Response.json({ success: true });
}
