import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  const clientPublicPath = path.resolve(process.cwd(), "client", "public");

  app.get("/ads.txt", (_req, res) => {
    const builtAds = path.resolve(distPath, "ads.txt");
    const srcAds = path.resolve(clientPublicPath, "ads.txt");
    const filePath = fs.existsSync(builtAds) ? builtAds : srcAds;
    if (fs.existsSync(filePath)) {
      res.type("text/plain").sendFile(filePath);
    } else {
      res.status(404).send("Not found");
    }
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
