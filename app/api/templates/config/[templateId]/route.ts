import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: { templateId: string } }
) {
  const { templateId } = params;

  const configPath = path.join(process.cwd(), "configs", `${templateId}.json`);

  const defaultPath = path.join(process.cwd(), "configs", "defaultConfig.json");

  // If config not saved yet → return default
  if (!fs.existsSync(configPath)) {
    const defaultConfig = JSON.parse(fs.readFileSync(defaultPath, "utf-8"));

    return Response.json({
      templateId,
      config: defaultConfig,
      isDefault: true,
    });
  }

  const savedConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  return Response.json(savedConfig);
}
