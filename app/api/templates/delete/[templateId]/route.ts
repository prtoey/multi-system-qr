import fs from "fs";
import path from "path";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await params;

  const root = process.cwd();

  const configPath = path.join(root, "configs", `${templateId}.json`);
  const templatePath = path.join(root, "templates", `${templateId}.xlsx`);
  const uploadedPath = path.join(
    root,
    "uploads",
    "templates",
    `${templateId}.xlsx`
  );

  const indexPath = path.join(root, "uploads", "templates", "templates.json");

  try {
    /* delete files */
    [configPath, templatePath, uploadedPath].forEach((p) => {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    });

    /* delete name from templates.json */
    if (fs.existsSync(indexPath)) {
      const indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

      indexData.templates = (indexData.templates || []).filter(
        (t: { name: string }) => t.name !== templateId
      );

      fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), "utf-8");
    }

    return Response.json({
      success: true,
      message: `Template "${templateId}" deleted completely`,
    });
  } catch (error) {
    console.error("DELETE TEMPLATE ERROR:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to delete template completely",
      }),
      { status: 500 }
    );
  }
}
